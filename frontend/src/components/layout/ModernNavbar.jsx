import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Menu, Search, User, Settings, 
  LogOut, ChevronDown, Home 
} from 'lucide-react'
import DarkModeToggle from '../DarkModeToggle'
import NotificationBell from '../NotificationBell'
import { useAuthStore } from '../../stores/authStore'

const ModernNavbar = ({ app = 'material', onMenuClick }) => {
  const { user, logout } = useAuthStore()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const appColors = {
    material: 'bg-material-600 dark:bg-material-700',
    stoklabel: 'bg-stoklabel-600 dark:bg-stoklabel-700',
    lps: 'bg-lps-600 dark:bg-lps-700'
  }

  const appNames = {
    material: 'Material Management',
    stoklabel: 'Stock Label',
    lps: 'LPS Production'
  }

  return (
    <nav className={`${appColors[app]} text-white shadow-lg sticky top-0 z-50 transition-colors duration-300`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo & App Name */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <img src="/img/rbm.png" alt="RBM" className="w-6 h-6" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg font-bold">{appNames[app]}</h1>
                <p className="text-xs text-white/70">RBM System</p>
              </div>
            </Link>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Cari..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Search Button (Mobile) */}
            <button className="md:hidden p-2 rounded-lg hover:bg-white/10">
              <Search className="w-5 h-5" />
            </button>

            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* Notifications */}
            <NotificationBell />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {user?.full_name || user?.username}
                </span>
                <ChevronDown className="hidden md:block w-4 h-4" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 py-2 animate-slide-up">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {user?.full_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {user?.email}
                    </p>
                  </div>
                  
                  <Link
                    to="/"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Home className="w-4 h-4 mr-3" />
                    Home
                  </Link>
                  
                  <Link
                    to={`/apps/${app}/settings`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Pengaturan
                  </Link>
                  
                  <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default ModernNavbar
