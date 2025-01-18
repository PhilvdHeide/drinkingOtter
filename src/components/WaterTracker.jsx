import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Minus, Droplet, Coffee, Menu, LogIn } from 'lucide-react';
import { drinkTypes, drinkSizes } from '../config/drinks';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { logWaterConsumption, getTodayWaterConsumption } from '../lib/waterTracking';
import { supabase } from '../lib/supabaseClient';

const WaterTracker = () => {
  const [dailyGoal] = useState(2000);
  const [drinks, setDrinks] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastGoalReached, setLastGoalReached] = useState(false);
  const [currentAnimal, setCurrentAnimal] = useState('otter');
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [logoutError, setLogoutError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedPreference = localStorage.getItem('darkMode');
    return savedPreference ? JSON.parse(savedPreference) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Get the current animal's body path for clipping
  const getCurrentPath = () => {
    if (currentAnimal === 'otter') {
      return "M2549.91,1119.388c-19.441-119.702-61.918-263.263-133.085-407.023c89.27-31.646,152.854-111.828,152.854-205.554 c0-197.255-259.033-293.872-406.953-153.762C1961.397,150.344,1673.147,0,1273.982,0C924.717,0,625.417,120.492,402.916,349.324 C253.739,214.589,0,311.545,0,506.811c0,94.768,64.971,175.723,155.799,206.628C70.146,899.623,44.337,1062.215,37.221,1123.81 c-4.907,42.655-13.501,54.226-4.923,116.52c29.164,232.879,184.753,439.164,377.257,599.865 c-90.082,169.21-55.549,389.28,25.288,561.703c-141.438,323.81-212.127,773.728,1.338,1070.084 c0.269,207.542,82.675,318.043,168.887,352.92c85.018,34.409,196.347-0.736,276.608-60.999 c36.656,10.819,81.546,22.37,123.566,29.427c-0.124,146.436,31.136,244.913,75.081,360.805 c99.299,261.94,161.771,437.82,21.671,622.472C1003.963,4905.795,919.751,5000,1080.64,5000c12.985,0,28.325-0.408,48.298-1.274 c188.741-8.202,474.917-258.093,471.181-550.524c-3.273-254.448-84.707-423.63-24.407-641.288 c50.34-7.863,98.407-18.463,144.13-31.813c59.101,40.333,124.83,63.046,186.962,63.046 c169.107-0.049,239.904-182.394,242.882-353.662c72.415-102.052,117.773-224.543,133.128-362.691 c29.803-268.181-34.909-507.246-93.661-718.696c82.637-175.552,117.16-400.25,21.736-570.545 c238.673-211.084,340.826-444.711,349.415-615.113C2564.073,1179.563,2555.339,1152.706,2549.91,1119.388z";
    } else {
      return "M3920.794,4056.005c-85.632-49.608-195.182-38.477-283.421,13.373c-87.206-141.271-227.766-199.012-387.848-133.027 c279.285-283.236,284.319-752.215,78.751-942.638c368.809-236.896,546.24-576.93,556.749-929.412 c-3.106-443.455-187.485-865.413-465.6-1201.752c208.581-279.28,187.729-630.597-42.574-786.464 c-218.832-148.1-541.389-50.158-649.568,229.803c-288.549-138.259-553.296-190.189-894.988-153.486 c-121.082,13.021-202.384,29.288-346.862,83.052c-133.512,49.792-200.044,88.013-247.456,116.056 c-106.802-428.104-686.661-489.54-829.909-48.707c-61.104,188.065,3.152,424.411,119.271,580.601 c16.655,22.408,39.05,39.152,64.343,49.103c-142.932,189.691-255.86,401.63-327.101,625.219c0,0,0,0-0.007,0.051 c-60.525,189.853-91.016,388.066-84.465,588.112c29.64,332.625,198.098,632.824,509.169,846.089 c-200.051,182.532-204.888,635.565,57.154,923.58c-135.29-27.215-246.98,36.264-319.544,153.808 c-87.721-51.133-196.777-63.56-283.421-13.373C77.414,4094.257-1.101,4183.493,0.012,4391.283 C1.908,4748.587,297.047,5000,631.282,5000h2801.674c333.627,0,629.374-250.812,631.271-608.717 C4065.354,4183.499,3986.847,4094.27,3920.794,4056.005z";
    }
  };

  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Fetch user profile from public.users table
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('display_name')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const [initialLoading, setInitialLoading] = useState(true);

  // Check auth state on mount
  useEffect(() => {
    let authListener;
    
    const initializeSession = async () => {
      setInitialLoading(true);
      
      try {
        // First check existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (session) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
          await loadConsumption();
        } else {
          setUser(null);
          setUserProfile(null);
          setDrinks([]);
          setShowLoginForm(true); // Show login form if no session
        }
        
        // Then setup auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session) {
            setUser(session.user);
            await fetchUserProfile(session.user.id);
            await loadConsumption();
          } else {
            setUser(null);
            setUserProfile(null);
            setDrinks([]);
            setShowLoginForm(true); // Show login form on sign out
          }
        });
        
        authListener = subscription;
      } catch (error) {
        console.error('Session initialization error:', error);
        // If session check fails, try to refresh the session
        try {
          const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) throw refreshError;
          
          if (refreshedSession) {
            setUser(refreshedSession.user);
            await fetchUserProfile(refreshedSession.user.id);
            await loadConsumption();
          }
        } catch (refreshError) {
          console.error('Session refresh error:', refreshError);
          setUser(null);
          setUserProfile(null);
          setDrinks([]);
          setShowLoginForm(true);
        }
      } finally {
        setInitialLoading(false);
      }
    };

    initializeSession();

    return () => {
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, []);

  const loadConsumption = async () => {
    setLoading(true);
    try {
      const response = await getTodayWaterConsumption();
      if (response && response.drinks) {
        // Ensure drinks is an array and map valid entries
        const validDrinks = Array.isArray(response.drinks) 
          ? response.drinks
              .filter(drink => drink && 
                typeof drink.amount_ml === 'number' && 
                drink.amount_ml > 0 && 
                drink.drink_type && 
                drink.logged_at)
              .map(drink => ({
                id: drink.id || Date.now(),
                amount_ml: drink.amount_ml,
                drink_type: drink.drink_type,
                logged_at: drink.logged_at
              }))
          : [];
        setDrinks(validDrinks);
      }
    } catch (error) {
      console.error('Error loading consumption:', error);
    } finally {
      setLoading(false);
    }
  };

  const [email, setEmail] = useState(localStorage.getItem('lastLoginEmail') || '');
  const [password, setPassword] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        setLoginError(error.message);
        throw error;
      }
      setShowLoginForm(false);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    console.log('handleLogout called');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setLogoutError(error.message);
        throw error;
      }
      setUser(null);
      setDrinks([]);
      setMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
      setLogoutError('An unexpected error occurred during logout.');
    } finally {
      setLoading(false);
    }
  };

  const currentAmount = drinks.reduce((sum, drink) => sum + (drink.amount_ml || 0), 0);

  // Drink types and sizes are imported from config/drinks.js

  const handleAddDrink = async (amount, type) => {
    setLoading(true);
    try {
      const { data: newDrink, error } = await logWaterConsumption({
        amount_ml: amount,
        drink_type: type
      });

      if (error) throw error;

      setDrinks(prev => {
        const newDrinks = [...prev, {
          ...newDrink,
          amount_ml: newDrink.amount_ml || amount,
          drink_type: newDrink.drink_type || type,
          logged_at: newDrink.logged_at || new Date().toISOString()
        }];
        return newDrinks;
      });

      // Trigger success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error logging consumption:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLastDrink = async () => {
    if (drinks.length > 0) {
      setLoading(true);
      try {
        await logWaterConsumption({});  // No drink_type means remove last drink
        setDrinks(prev => prev.slice(0, -1));
      } catch (error) {
        console.error('Error removing drink:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let successTimer;
    
    // Only show success when goal is exceeded by at least 1ml
    if (currentAmount > dailyGoal && !lastGoalReached) {
      setShowSuccess(true);
      setLastGoalReached(true);
      successTimer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } else if (currentAmount <= dailyGoal && lastGoalReached) {
      setLastGoalReached(false);
    }

    return () => {
      if (successTimer) {
        clearTimeout(successTimer);
      }
    };
  }, [currentAmount, dailyGoal, lastGoalReached]);

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-dark-100 p-4">
      <Card className="max-w-md mx-auto bg-white dark:bg-dark-200">
        <CardHeader className="relative pt-8 pb-4">
          {user && (
            <div className="absolute left-4 top-4 z-50">
              <div className="relative inline-block">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-4 bg-white/80 backdrop-blur-sm hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md rounded-xl"
                >
                  <Menu className="w-6 h-6" />
                </Button>
                {menuOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-xl shadow-lg bg-white/90 dark:bg-dark-200/90 backdrop-blur-sm ring-1 ring-black dark:ring-white/10 ring-opacity-5">
                    <div className="py-1">
                      <button
                        onClick={toggleDarkMode}
                        className="block w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors duration-200"
                      >
                        {isDarkMode ? 'Hellmodus' : 'Dunkelmodus'}
                      </button>
                      <button
                        onClick={() => {
                          setCurrentAnimal(currentAnimal === 'otter' ? 'panda' : 'otter');
                          setMenuOpen(false);
                        }}
                        className="block w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors duration-200"
                      >
                        {currentAnimal === 'otter' ? 'Zu Panda wechseln' : 'Zu Otter wechseln'}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors duration-200"
                      >
                        Abmelden
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {initialLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : !user && (
            <Alert className="mb-4 dark:bg-dark-200 dark:text-gray-200">
              <AlertTitle>Bitte anmelden</AlertTitle>
              <AlertDescription>
                Melde dich an, um deinen Wasserkonsum zu tracken.
              </AlertDescription>
            </Alert>
          )}
          {!user && (
            <div className="mb-4">
              {showLoginForm ? (
                <div className="w-64 p-4 rounded-xl shadow-lg bg-white/90 backdrop-blur-sm ring-1 ring-black ring-opacity-5">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                  }} className="space-y-3">
                    {loginError && (
                      <Alert variant="destructive" className="mb-2">
                        <AlertTitle>Login Fehler</AlertTitle>
                        <AlertDescription>{loginError}</AlertDescription>
                      </Alert>
                    )}
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-300 dark:border-gray-600 dark:text-gray-200"
                      />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      Anmelden
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowLoginForm(false);
                        setLoginError(null);
                      }}
                      className="w-full"
                    >
                      Abbrechen
                    </Button>
                  </form>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLoginForm(true)}
                  className="p-4 bg-white/80 backdrop-blur-sm hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md rounded-xl"
                >
                  <LogIn className="w-6 h-6" />
                </Button>
              )}
            </div>
            )}
          <CardTitle className="text-center pt-2">
            {user ? `Hallo ${userProfile?.display_name || 'Freund'}!` : 'Wasser-Tracker'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showSuccess && (
            <Alert className="mb-4 bg-green-100">
              <AlertTitle>Tagesziel erreicht! 🎉</AlertTitle>
              <AlertDescription>Gut gemacht!</AlertDescription>
            </Alert>
          )}
          {logoutError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Logout Fehler</AlertTitle>
              <AlertDescription>{logoutError}</AlertDescription>
            </Alert>
          )}
          {user && (
            <div>
              <div className="relative w-64 h-64 mx-auto mb-6">
            <svg 
              key={`${currentAnimal}-${currentAmount}`}
              viewBox={currentAnimal === 'otter' ? "0 0 2569.679 5000" : "0 0 4064.239 5000"} 
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
                    y={5000 * (1 - Math.min(Math.max((currentAmount / (dailyGoal || 1)) * 100, 0), 100) / 100)}
                    width={currentAnimal === 'otter' ? "2569.679" : "4064.239"}
                    height={5000}
                  />
                </clipPath>
              </defs>
              <path
                d={getCurrentPath()}
                fill={(drinks.length > 0 && drinks[drinks.length - 1].drink_type && drinkTypes[drinks[drinks.length - 1].drink_type]?.color) || '#3b82f6'}
                clipPath="url(#fillClip)"
                style={{ 
                  transition: 'all 0.3s ease'
                }}
              />
            </svg>
          </div>

          <div className="text-center mb-6">
            <p className="text-2xl font-bold text-blue-600">
              {currentAmount} / {dailyGoal} ml
            </p>
              <p className="text-sm text-gray-500">
              {((currentAmount / (dailyGoal || 1)) * 100).toFixed(1)}% geschafft
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {drinkSizes.map((drink) => (
                <Button
                  key={`${drink.name}-${drink.type}`}
                  onClick={() => handleAddDrink(drink.amount, drink.type)}
                  disabled={loading}
                  className="w-full py-7 transition-all hover:scale-105 shadow-sm hover:shadow-md rounded-xl"
                  style={{
                    backgroundColor: drinkTypes[drink.type]?.color || '#3b82f6',
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
              disabled={loading || drinks.length === 0}
              className="p-4 hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md rounded-xl"
            >
              <Minus className="w-6 h-6" />
            </Button>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">Letzte Getränke:</h3>
            <div className="max-h-32 overflow-y-auto">
              {drinks.slice().reverse().map((drink, index) => {
                const drinkType = drinkTypes[drink.drink_type];
                const timestamp = drink.logged_at ? new Date(drink.logged_at) : null;
                return (
                  <div 
                    key={index} 
                    className="text-sm text-gray-600 flex justify-between items-center mb-1"
                  >
                    <span>{drinkType?.name || 'Unbekannt'}: {drink.amount_ml || 0}ml</span>
                    <span>
                      {timestamp ? timestamp.toLocaleTimeString('de-DE', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }) : '--:--'}
                    </span>
                  </div>
                );
              })}
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
