import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Minus, Droplet, Coffee } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';


const WaterTracker = () => {
  const [dailyGoal] = useState(2000);
  const [drinks, setDrinks] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastGoalReached, setLastGoalReached] = useState(false);
  const [currentOtter, setCurrentOtter] = useState(1);

  // Get the current otter's body path for clipping
  const getCurrentOtterPath = () => {
    const otterPath = currentOtter === 1 
      ? "M200,50 C300,50 350,100 350,200 C350,300 300,400 200,400 C100,400 50,300 50,200 C50,100 100,50 200,50 Z"
      : "M200,50 C320,50 380,120 380,200 C380,280 340,400 200,400 C60,400 20,280 20,200 C20,120 80,50 200,50 Z";
    return otterPath;
  };

  const currentAmount = drinks.reduce((sum, drink) => sum + drink.amount, 0);
  const fillPercentage = (currentAmount / dailyGoal) * 100;

  // Getränketypen mit ihren Eigenschaften
  const drinkTypes = {
    water: { color: '#3b82f6', name: 'Wasser' }, // Darker blue for better contrast
    tea: { color: '#059669', name: 'Tee' }, // Darker green for better contrast
    cocoa: { color: '#78350f', name: 'Kakao' } // Adjusted brown
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
    return drinks.map((drink) => {
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
    let successTimer;
    
    if (currentAmount >= dailyGoal && !lastGoalReached) {
      setShowSuccess(true);
      setLastGoalReached(true);
      successTimer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } else if (currentAmount < dailyGoal && lastGoalReached) {
      setLastGoalReached(false);
    }

    // Cleanup-Funktion
    return () => {
      if (successTimer) {
        clearTimeout(successTimer);
      }
    };
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
            <div className="absolute top-0 right-0 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentOtter(currentOtter === 1 ? 2 : 1)}
                className="p-2"
              >
                Otter wechseln
              </Button>
            </div>
            <svg viewBox="0 0 400 600" className="w-full h-full">
              {/* Otter Silhouette */}
              <path
                className="otter-outline"
                d={currentOtter === 1 ? 
                  "M200,50 C300,50 350,100 350,200 C350,300 300,400 200,400 C100,400 50,300 50,200 C50,100 100,50 200,50 Z M150,140 C125,140 115,160 115,175 C115,190 125,205 150,205 C175,205 185,190 185,175 C185,160 175,140 150,140 Z M250,140 C225,140 215,160 215,175 C215,190 225,205 250,205 C275,205 285,190 285,175 C285,160 275,140 250,140 Z M200,240 C175,240 150,255 200,285 C250,255 225,240 200,240 Z M175,290 L225,290 C250,340 225,385 200,385 C175,385 150,340 175,290 Z" :
                  "M200,50 C320,50 380,120 380,200 C380,280 340,400 200,400 C60,400 20,280 20,200 C20,120 80,50 200,50 Z M130,130 C100,130 85,150 85,170 C85,190 100,210 130,210 C160,210 175,190 175,170 C175,150 160,130 130,130 Z M270,130 C240,130 225,150 225,170 C225,190 240,210 270,210 C300,210 315,190 315,170 C315,150 300,130 270,130 Z M200,230 C160,230 120,260 200,300 C280,260 240,230 200,230 Z M160,310 L240,310 C280,350 240,390 200,390 C160,390 120,350 160,310 Z"}
                fill="none"
                stroke="#666"
                strokeWidth="2"
              />
              
              {/* Füllungen für die Getränke */}
              <defs>
                <clipPath id="otterClip">
                  <path d={getCurrentOtterPath()} />
                </clipPath>
              </defs>
              
              {/* Chronologische Füllungen - in umgekehrter Reihenfolge für korrekte Überlagerung */}
              {calculateFillSegments().reverse().map((segment, index) => (
                <rect
                  key={index}
                  x="0"
                  y={400 - segment.startY - segment.height}
                  width="400"
                  height={segment.height}
                  fill={segment.color}
                  clipPath="url(#otterClip)"
                  style={{ transition: 'all 0.3s ease' }}
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
                    color: 'white' // Immer weißer Text für besseren Kontrast
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
