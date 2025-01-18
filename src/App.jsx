import { useState, useEffect } from 'react';
import './App.css';
import WaterTracker from './components/WaterTracker';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const localSetting = localStorage.getItem('darkMode');
    return localSetting === 'true' || (localSetting === null && true);
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="App bg-background dark:bg-background-dark min-h-screen">
      <WaterTracker darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  );
}

export default App;
