import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Droplet, Coffee } from 'lucide-react';
import MobileNav from './MobileNav';
import { drinkTypes, drinkSizes } from '../config/drinks';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { logWaterConsumption, getTodayWaterConsumption, removeLastDrink } from '../lib/waterTracking';
import { supabase } from '../lib/supabaseClient';

const WaterTracker = () => {
  const [user, setUser] = useState(null);
  const [currentAvatar, setCurrentAvatar] = useState('otter1');
  const [currentAmount, setCurrentAmount] = useState(0);
  const [dailyGoal] = useState(2000);
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchTodayWater();
    }
  }, [user]);

  const fetchTodayWater = async () => {
    try {
      const { total, drinks } = await getTodayWaterConsumption();
      setCurrentAmount(total);
      setDrinks(drinks.map(drink => ({
        amount: drink.amount_ml,
        type: drink.drink_type,
        timestamp: new Date(drink.logged_at)
      })));
    } catch {
      setError('Fehler beim Laden der Daten');
    }
  };

  const handleAddDrink = async (amount, type) => {
    setLoading(true);
    try {
      await logWaterConsumption({ amount_ml: amount, drink_type: type });
      setCurrentAmount(prev => prev + amount);
      setDrinks(prev => [...prev, { amount, type, timestamp: new Date() }]);
      setSuccess('Getränk erfolgreich hinzugefügt');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Fehler beim Speichern');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLastDrink = async () => {
    if (drinks.length === 0) return;
    
    setLoading(true);
    try {
      await removeLastDrink();
      const lastDrink = drinks[drinks.length - 1];
      setCurrentAmount(prev => prev - lastDrink.amount);
      setDrinks(prev => prev.slice(0, -1));
      setSuccess('Letztes Getränk entfernt');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Fehler beim Entfernen');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-dark-100 p-2 sm:p-4 relative">
      <MobileNav
        user={user}
        onAvatarChange={() => setCurrentAvatar(prev => prev === 'otter1' ? 'panda' : 'otter1')}
        onLogout={async () => {
          const { error } = await supabase.auth.signOut();
          if (error) setError(error.message);
        }}
        onRemoveLastDrink={handleRemoveLastDrink}
        loading={loading}
        drinksCount={drinks.length}
      />
      <Card className="w-full max-w-md mx-auto bg-white dark:bg-dark-200 rounded-xl mt-2 sm:mt-4">
        <CardHeader className="relative pt-3 pb-2 sm:pt-4 sm:pb-2">
          <CardTitle className="text-2xl sm:text-3xl font-extrabold text-center text-blue-600 dark:text-white">
            DrinkingOtter
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Fehler</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="mb-4">
              <AlertTitle>Erfolg</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          {user ? (
            <>
              <div className="relative w-40 h-40 sm:w-56 sm:h-56 mx-auto mb-4 sm:mb-6">
                <img 
                  src={`/assets/animals/${currentAvatar === 'otter1' ? 'otter1' : 'panda'}.svg`}
                  alt="Mascot"
                  className="w-full h-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-100 rounded-full flex items-center justify-center">
                    <Droplet className="w-10 h-10 sm:w-16 sm:h-16 text-blue-500" />
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {currentAmount} / {dailyGoal} ml
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {((currentAmount / (dailyGoal || 1)) * 100).toFixed(1)}% geschafft
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                {drinkSizes.map((drink) => (
                  <Button
                    key={`${drink.name}-${drink.type}`}
                    onClick={() => handleAddDrink(drink.amount, drink.type)}
                    disabled={loading}
                    className="w-full py-4 transition-all hover:scale-105 shadow-sm hover:shadow-md rounded-xl text-lg min-h-[56px]"
                    style={{
                      backgroundColor: drinkTypes[drink.type]?.color || '#3b82f6',
                      color: 'white'
                    }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-base font-medium">{drink.name}</span>
                      <div className="flex items-center gap-1 text-sm text-white/90">
                        {drink.type === 'water' ? (
                          <Droplet className="w-3 h-3" />
                        ) : (
                          <Coffee className="w-3 h-3" />
                        )}
                        <span>{drink.amount}ml</span>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-200">Letzte Getränke:</h3>
                <div className="max-h-32 overflow-y-auto">
                  {[...drinks].sort((a, b) => b.timestamp - a.timestamp).map((drink, index) => (
                    <div key={index} className="flex justify-between items-center py-1 sm:py-2 border-b dark:border-gray-600">
                      <span className="text-sm dark:text-gray-300">
                        {drink.amount}ml {drinkTypes[drink.type]?.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(drink.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 p-4">
              <h2 className="text-xl font-bold text-center text-black dark:text-white">Bitte anmelden</h2>
              <div className="w-full max-w-xs space-y-4">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="username"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      document.querySelector('input[type="password"]').focus();
                    }
                  }}
                />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Passwort"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="current-password"
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      const email = document.querySelector('input[type="email"]').value;
                      const password = document.querySelector('input[type="password"]').value;
                      try {
                        const { error } = await supabase.auth.signInWithPassword({
                          email,
                          password
                        });
                        if (error) throw error;
                      } catch (error) {
                        setError(error.message);
                      }
                    }
                  }}
                />
                <Button
                  onClick={async () => {
                    const email = document.querySelector('input[type="email"]').value;
                    const password = document.querySelector('input[type="password"]').value;
                    try {
                      const { error } = await supabase.auth.signInWithPassword({
                        email,
                        password
                      });
                      if (error) throw error;
                    } catch (error) {
                      setError(error.message);
                    }
                  }}
                  className="w-full"
                >
                  Anmelden
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WaterTracker;
