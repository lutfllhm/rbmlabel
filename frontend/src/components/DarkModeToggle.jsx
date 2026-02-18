import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '../stores/themeStore'

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore()

  return (
    <button
      onClick={toggleDarkMode}
      className="relative p-3 border-4 border-black bg-white dark:bg-slate-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all rotate-3 hover:rotate-6"
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
          strokeWidth={3}
        />
        
        {/* Moon Icon */}
        <Moon
          className={`absolute inset-0 h-6 w-6 text-blue-400 transition-all duration-300 ${
            isDarkMode
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0'
          }`}
          strokeWidth={3}
        />
      </div>
    </button>
  )
}

export default DarkModeToggle
