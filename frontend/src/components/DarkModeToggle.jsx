import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '../stores/themeStore'

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore()

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      title={isDarkMode ? 'Mode terang' : 'Mode gelap'}
    >
      <Sun
        className={`h-5 w-5 text-amber-500 transition-all ${isDarkMode ? 'hidden' : 'block'}`}
        strokeWidth={2}
      />
      <Moon
        className={`h-5 w-5 text-slate-300 transition-all ${isDarkMode ? 'block' : 'hidden'}`}
        strokeWidth={2}
      />
    </button>
  )
}

export default DarkModeToggle
