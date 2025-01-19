import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Handle dark mode based on system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const rootElement = document.documentElement

if (prefersDark) {
  rootElement.classList.add('dark')
} else {
  rootElement.classList.remove('dark')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
