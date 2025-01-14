import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Minus, Droplet, Coffee, Menu } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';


const WaterTracker = () => {
  const [dailyGoal] = useState(2000);
  const [drinks, setDrinks] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastGoalReached, setLastGoalReached] = useState(false);
  const [currentAnimal, setCurrentAnimal] = useState('otter');
  const [menuOpen, setMenuOpen] = useState(false);

  // Get the current animal's body path for clipping
  const getCurrentPath = () => {
    if (currentAnimal === 'otter') {
      return "M2549.91,1119.388c-19.441-119.702-61.918-263.263-133.085-407.023c89.27-31.646,152.854-111.828,152.854-205.554 c0-197.255-259.033-293.872-406.953-153.762C1961.397,150.344,1673.147,0,1273.982,0C924.717,0,625.417,120.492,402.916,349.324 C253.739,214.589,0,311.545,0,506.811c0,94.768,64.971,175.723,155.799,206.628C70.146,899.623,44.337,1062.215,37.221,1123.81 c-4.907,42.655-13.501,54.226-4.923,116.52c29.164,232.879,184.753,439.164,377.257,599.865 c-90.082,169.21-55.549,389.28,25.288,561.703c-141.438,323.81-212.127,773.728,1.338,1070.084 c0.269,207.542,82.675,318.043,168.887,352.92c85.018,34.409,196.347-0.736,276.608-60.999 c36.656,10.819,81.546,22.37,123.566,29.427c-0.124,146.436,31.136,244.913,75.081,360.805 c99.299,261.94,161.771,437.82,21.671,622.472C1003.963,4905.795,919.751,5000,1080.64,5000c12.985,0,28.325-0.408,48.298-1.274 c188.741-8.202,474.917-258.093,471.181-550.524c-3.273-254.448-84.707-423.63-24.407-641.288 c50.34-7.863,98.407-18.463,144.13-31.813c59.101,40.333,124.83,63.046,186.962,63.046 c169.107-0.049,239.904-182.394,242.882-353.662c72.415-102.052,117.773-224.543,133.128-362.691 c29.803-268.181-34.909-507.246-93.661-718.696c82.637-175.552,117.16-400.25,21.736-570.545 c238.673-211.084,340.826-444.711,349.415-615.113C2564.073,1179.563,2555.339,1152.706,2549.91,1119.388z";
    } else {
      return "M3920.794,4056.005c-85.632-49.608-195.182-38.477-283.421,13.373c-87.206-141.271-227.766-199.012-387.848-133.027 c279.285-283.236,284.319-752.215,78.751-942.638c368.809-236.896,546.24-576.93,556.749-929.412 c-3.106-443.455-187.485-865.413-465.6-1201.752c208.581-279.28,187.729-630.597-42.574-786.464 c-218.832-148.1-541.389-50.158-649.568,229.803c-288.549-138.259-553.296-190.189-894.988-153.486 c-121.082,13.021-202.384,29.288-346.862,83.052c-133.512,49.792-200.044,88.013-247.456,116.056 c-106.802-428.104-686.661-489.54-829.909-48.707c-61.104,188.065,3.152,424.411,119.271,580.601 c16.655,22.408,39.05,39.152,64.343,49.103c-142.932,189.691-255.86,401.63-327.101,625.219c0,0,0,0-0.007,0.051 c-60.525,189.853-91.016,388.066-84.465,588.112c29.64,332.625,198.098,632.824,509.169,846.089 c-200.051,182.532-204.888,635.565,57.154,923.58c-135.29-27.215-246.98,36.264-319.544,153.808 c-87.721-51.133-196.777-63.56-283.421-13.373C77.414,4094.257-1.101,4183.493,0.012,4391.283 C1.908,4748.587,297.047,5000,631.282,5000h2801.674c333.627,0,629.374-250.812,631.271-608.717 C4065.354,4183.499,3986.847,4094.27,3920.794,4056.005z";
    }
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

          {/* Animal SVG mit Füllung */}
          <div className="relative w-64 h-64 mx-auto mb-6">
            <div className="absolute top-0 right-0 mb-2">
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2"
                >
                  <Menu className="w-4 h-4" />
                </Button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setCurrentAnimal(currentAnimal === 'otter' ? 'panda' : 'otter');
                          setMenuOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {currentAnimal === 'otter' ? 'Zu Panda wechseln' : 'Zu Otter wechseln'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <svg viewBox={currentAnimal === 'otter' ? "0 0 2569.679 5000" : "0 0 4064.239 5000"} className="w-full h-full">
              {/* Animal Silhouette */}
              <path
                className="animal-outline"
                d={getCurrentPath()}
                fill="none"
                stroke="#666"
                strokeWidth="2"
              />
              
              {/* Füllungen für die Getränke */}
              <defs>
                <clipPath id="animalClip">
                  <path d={getCurrentPath()} />
                </clipPath>
              </defs>
              
              {/* Chronologische Füllungen - in umgekehrter Reihenfolge für korrekte Überlagerung */}
              {calculateFillSegments().reverse().map((segment, index) => (
                <rect
                  key={index}
                  x="0"
                  y={5000 - segment.startY - segment.height}
                  width={currentAnimal === 'otter' ? "2569.679" : "4064.239"}
                  height={segment.height}
                  fill={segment.color}
                  clipPath="url(#animalClip)"
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
