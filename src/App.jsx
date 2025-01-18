import { useState } from 'react'
import './App.css'
import WaterTracker from './components/WaterTracker'

function App() {
  const [darkMode, setDarkMode] = useState(true)

  return (
    <div className="App bg-background dark:bg-background-dark min-h-screen">
      <WaterTracker darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  )
}

export default App
