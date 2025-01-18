import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Minus, Droplet, Coffee, Menu } from 'lucide-react';
import { drinkTypes, drinkSizes } from '../config/drinks';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import DarkModeToggle from './DarkModeToggle';

const WaterTracker = ({ darkMode, setDarkMode }) => {
  WaterTracker.propTypes = {
    darkMode: PropTypes.bool.isRequired,
    setDarkMode: PropTypes.func.isRequired
  };
  const [dailyGoal] = useState(2000);
  const [drinks, setDrinks] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [user] = useState(true); // Temporary mock user
  const [showMenu, setShowMenu] = useState(false);
  const [currentAnimal, setCurrentAnimal] = useState('otter');

  const currentAmount = drinks.reduce((sum, drink) => sum + drink.amount, 0);
  const fillPercentage = (currentAmount / dailyGoal) * 100;

  const getCurrentPath = () => {
    return currentAnimal === 'otter' 
      ? drinkTypes.water.path 
      : '/src/assets/otters/panda.svg';
  };

  const handleAddDrink = (amount, type) => {
    setDrinks(prev => [
      ...prev,
      {
        amount,
        type,
        timestamp: new Date()
      }
    ]);

    const newTotal = currentAmount + amount;
    if (newTotal >= dailyGoal && !showSuccess) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else if (newTotal < dailyGoal && showSuccess) {
      setShowSuccess(false);
    }
  };

  const handleRemoveLastDrink = () => {
    if (drinks.length > 0) {
      setDrinks(prev => prev.slice(0, -1));
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark">
      <Card className="h-screen max-w-md mx-auto bg-white dark:bg-gray-800 rounded-none">
        <CardHeader className="relative pt-8 pb-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Trink-{currentAnimal === 'otter' ? 'Otter' : 'Panda'}
            </h1>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            {showMenu && (
              <div className="absolute right-4 top-16 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-2 w-40 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setCurrentAnimal('otter');
                    setShowMenu(false);
                  }}
                  className="w-full text-left p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                >
                  Otter
                </button>
                <button
                  onClick={() => {
                    setCurrentAnimal('panda');
                    setShowMenu(false);
                  }}
                  className="w-full text-left p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                >
                  Panda
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                <div className="p-2">
                  <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showSuccess && (
            <Alert className="mb-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 animate-fade-in">
              <AlertTitle className="text-green-900 dark:text-green-100 font-semibold text-lg">🎉 Tagesziel erreicht!</AlertTitle>
              <AlertDescription className="text-green-800 dark:text-green-200">
                Gut gemacht! Du hast heute {currentAmount} ml getrunken.
              </AlertDescription>
            </Alert>
          )}

          {!user && (
            <Alert className="mb-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
              <AlertTitle className="text-blue-900 dark:text-blue-100 font-semibold">Bitte anmelden</AlertTitle>
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                Melde dich an, um deinen Wasserkonsum zu tracken.
              </AlertDescription>
            </Alert>
          )}
          {user && (
            <div>
              <div className="relative w-64 h-64 mx-auto mb-6">
                <svg 
                  key={`${fillPercentage}`}
                  viewBox="0 0 2569.679 5000" 
                  className="w-full h-full"
                >
                  <path
                    className="animal-outline"
                    d={getCurrentPath()}
                    fill="none"
                    stroke="#666"
                    strokeWidth="2"
                  />
                  <defs>
                    <clipPath id="fillClip">
                      <rect
                        x="0"
                        y={5000 * (1 - Math.min(fillPercentage, 100) / 100)}
                        width="2569.679"
                        height={5000}
                      />
                    </clipPath>
                  </defs>
                  <path
                    d={getCurrentPath()}
                    fill={drinks.length > 0 ? drinkTypes[drinks[drinks.length - 1].type].color : 'none'}
                    clipPath="url(#fillClip)"
                    style={{ 
                      transition: 'all 0.3s ease'
                    }}
                  />
                </svg>
              </div>

              <div className="text-center mb-6">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {currentAmount} / {dailyGoal} ml
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {fillPercentage.toFixed(1)}% geschafft
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {drinkSizes.map((drink) => (
                  <Button
                    key={`${drink.name}-${drink.type}`}
                    onClick={() => handleAddDrink(drink.amount, drink.type)}
                    className="w-full py-7 transition-all hover:scale-105 shadow-sm hover:shadow-md rounded-xl"
                    style={{
                      backgroundColor: drinkTypes[drink.type].color,
                      color: 'white'
                    }}
                  >
                    {drink.type === 'water' ? (
                      <Droplet className="w-6 h-6 mr-3" />
                    ) : (
                      <Coffee className="w-6 h-6 mr-3" />
                    )}
                    {drink.name}
                  </Button>
                ))}
              </div>

              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleRemoveLastDrink}
                  disabled={drinks.length === 0}
                  className="p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md rounded-xl"
                >
                  <Minus className="w-6 h-6" />
                </Button>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2 dark:text-white">Letzte Getränke:</h3>
                <div className="max-h-32 overflow-y-auto">
                  {drinks.slice().reverse().map((drink, index) => (
                    <div 
                      key={index} 
                      className="text-sm text-gray-600 dark:text-gray-300 flex justify-between items-center mb-1"
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WaterTracker;
