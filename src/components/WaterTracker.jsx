import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, Droplet, Coffee } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const WaterTracker = () => {
  const [dailyGoal] = useState(2000);
  const [drinks, setDrinks] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastGoalReached, setLastGoalReached] = useState(false);

  const currentAmount = drinks.reduce((sum, drink) => sum + drink.amount, 0);
  const fillPercentage = (currentAmount / dailyGoal) * 100;

  // Getränketypen mit ihren Eigenschaften
  const drinkTypes = {
    water: { color: '#a5d8ff', name: 'Wasser' },
    tea: { color: '#86efac', name: 'Tee' },
    cocoa: { color: '#92400e', name: 'Kakao' }
  };

  // Predefinierte Getränkemengen
  const drinkSizes = [
    { name: 'Kleines Glas', amount: 200, type: 'water', Icon: Droplet },
    { name: 'Großes Glas', amount: 300, type: 'water', Icon: Droplet },
    { name: 'Wasserflasche', amount: 500, type: 'water', Icon: Droplet },
    { name: 'Tee', amount: 200, type: 'tea', Icon: Coffee },
    { name: 'Kakao', amount: 300, type: 'cocoa', Icon: Coffee },
  ];

  // Erfolgstext generieren
  const getSuccessText = () => {
    const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const adjectives = ['Hydrierter', 'Wässriger', 'Spritziger', 'Erfrischender', 'Durstiger'];
    const day = days[new Date().getDay()];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    return `${adj} ${day}`;
  };

  // Berechne die Füllungssegmente
  const calculateFillSegments = () => {
    let currentHeight = 0;
    return drinks.map((drink, index) => {
      const height = (drink.amount / dailyGoal) * 100;
      const segment = {
        startY: currentHeight,
        height: height,
        color: drinkTypes[drink.type].color
      };
      currentHeight += height;
      return segment;
    });
  };

  // Überprüfe, ob das Tagesziel erreicht wurde
  useEffect(() => {
    if (currentAmount >= dailyGoal && !lastGoalReached) {
      setShowSuccess(true);
      setLastGoalReached(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [currentAmount, dailyGoal, lastGoalReached]);

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Wasser-Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Erfolgsmeldung */}
          {showSuccess && (
            <Alert className="mb-4 bg-green-100">
              <AlertTitle>Tagesziel erreicht! 🎉</AlertTitle>
              <AlertDescription>{getSuccessText()}</AlertDescription>
            </Alert>
          )}

          {/* Otter SVG mit Füllung */}
          <div className="relative w-64 h-64 mx-auto mb-6">
            <svg viewBox="0 0 400 600" className="w-full h-full">
              {/* Neue Otter Silhouette basierend auf dem PNG */}
              <path
                className="otter-outline"
                d="M200,50 C300,50 350,100 350,200 C350,300 300,400 200,400 C100,400 50,300 50,200 C50,100 100,50 200,50 Z
                   M150,150 C130,150 120,170 120,180 C120,190 130,200 150,200 C170,200 180,190 180,180 C180,170 170,150 150,150 Z
                   M250,150 C230,150 220,170 220,180 C220,190 230,200 250,200 C270,200 280,190 280,180 C280,170 270,150 250,150 Z
                   M200,250 C180,250 160,260 200,280 C240,260 220,250 200,250 Z
                   M180,300 L220,300 C240,350 220,380 200,380 C180,380 160,350 180,300 Z"
                fill="none"
                stroke="#666"
                strokeWidth="2"
              />
              
              {/* Füllungen für die Getränke */}
              <defs>
                <clipPath id="otterClip">
                  <path d="M200,50 C300,50 350,100 350,200 C350,300 300,400 200,400 C100,400 50,300 50,200 C50,100 100,50 200,50 Z" />
                </clipPath>
              </defs>
              
              {/* Chronologische Füllungen */}
              {calculateFillSegments().map((segment, index) => (
                <rect
                  key={index}
                  x="0"
                  y={400 - segment.startY - segment.height}
                  width="400"
                  height={segment.height}
                  fill={segment.color}
                  clipPath="url(#otterClip)"
                />
              ))}
            </svg>
          </div>

          {/* Fortschritt */}
          <div className="text-center mb-6">
            <p className="text-2xl font-bold text-blue-600">
              {currentAmount} / {dailyGoal} ml
            </p>
            <p className="text-sm text-gray-500">
              {fillPercentage.toFixed(1)}% geschafft
            </p>
          </div>

          {/* Getränke Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {drinkSizes.map((drink) => {
              const { Icon } = drink;
              return (
                <Button
                  key={`${drink.name}-${drink.type}`}
                  onClick={() => setDrinks([...drinks, { 
                    amount: drink.amount, 
                    type: drink.type, 
                    timestamp: new Date() 
                  }])}
                  className="w-full"
                  style={{
                    backgroundColor: drinkTypes[drink.type].color,
                    color: drink.type === 'water' ? 'white' : 'black'
                  }}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {drink.name}
                </Button>
              );
            })}
          </div>

          {/* Manuelle Anpassung */}
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (drinks.length > 0) {
                  setDrinks(drinks.slice(0, -1));
                }
              }}
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>

          {/* Letzte Getränke */}
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">Letzte Getränke:</h3>
            <div className="max-h-32 overflow-y-auto">
              {drinks.slice().reverse().map((drink, index) => (
                <div 
                  key={index} 
                  className="text-sm text-gray-600 flex justify-between items-center mb-1"
                >
                  <span>{drinkTypes[drink.type].name}: {drink.amount}ml</span>
                  <span>{drink.timestamp.toLocaleTimeString('de-DE', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</span>
                </div>
              ))}
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default WaterTracker;