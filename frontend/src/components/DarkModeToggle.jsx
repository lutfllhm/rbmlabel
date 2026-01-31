import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '../stores/themeStore'

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore()

  return (
    <button
      onClick={toggleDarkMode}
      className="relative p-2 rounded-lg transition-all duration-300 hover:scale-110 group"
      title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
    >
      <div className="relative w-6 h-6">
        {/* Sun Icon */}
        <Sun
          className={`absolute inset-0 h-6 w-6 text-yellow-500 transition-all duration-300 ${
            isDarkMode
              ? 'rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100'
          }`}
        />
        
        {/* Moon Icon */}
        <Moon
          className={`absolute inset-0 h-6 w-6 text-blue-400 transition-all duration-300 ${
            isDarkMode
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
      
      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-lg blur-md transition-opacity duration-300 ${
          isDarkMode
            ? 'bg-blue-400/20 opacity-100'
            : 'bg-yellow-400/20 opacity-0 group-hover:opacity-100'
        }`}
      ></div>
    </button>
  )
}

export default DarkModeToggle
