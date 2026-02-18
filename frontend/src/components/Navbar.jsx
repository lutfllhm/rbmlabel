import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Package,
  Tags,
  FileText,
  Menu,
  X,
  Bell
} from 'lucide-react'
import NotificationBell from './NotificationBell'

const Navbar = () => {
  const { user, logout } = useAuthStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const userMenuRef = useRef(null)

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getAppIcon = (app) => {
    switch (app) {
      case 'material':
        return Package
      case 'stoklabel':
        return Tags
      case 'lps':
        return FileText
      default:
        return Package
    }
  }

  const getAppName = (app) => {
    switch (app) {
      case 'material':
        return 'Material Management'
      case 'stoklabel':
        return 'Stock Label'
      case 'lps':
        return 'LPS Production'
      default:
        return 'RBM System'
    }
  }

  const getAppColor = (app) => {
    switch (app) {
      case 'material':
        return 'bg-blue-400'
      case 'stoklabel':
        return 'bg-emerald-400'
      case 'lps':
        return 'bg-orange-400'
      default:
        return 'bg-blue-400'
    }
  }

  const AppIcon = getAppIcon(user?.app)
  const appColor = getAppColor(user?.app)

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <nav className="bg-gradient-to-r from-white via-yellow-100 to-pink-100 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 border-b-8 border-black fixed w-full top-0 z-50 shadow-[0_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 bg-black text-white border-2 border-black hover:bg-gray-800 mr-3"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" strokeWidth={3} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={3} />
              )}
            </button>

            <Link to="/" className="flex items-center group">
              <div className="flex-shrink-0 flex items-center">
                <div className={`p-3 ${appColor} border-4 border-black mr-3 -rotate-6 group-hover:rotate-6 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                  <AppIcon className="h-6 w-6 text-black" strokeWidth={3} />
                </div>
                <div>
                  <h1 className="text-lg font-black uppercase text-black dark:text-white tracking-tight">
                    {getAppName(user?.app)}
                  </h1>
                  <p className="text-xs font-bold text-black/70 dark:text-white/70 hidden sm:block">RBM SYSTEM V1.0</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <NotificationBell />

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 sm:space-x-3 p-2 border-4 border-black bg-white dark:bg-slate-700 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all rotate-1"
              >
                <div className={`w-8 h-8 ${appColor} border-3 border-black flex items-center justify-center -rotate-12`}>
                  <User className="h-4 w-4 text-black" strokeWidth={3} />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-black text-black dark:text-white">{user?.full_name || user?.username}</p>
                  <p className="text-xs font-bold text-black/70 dark:text-white/70 uppercase">{user?.role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-black dark:text-white hidden sm:block" strokeWidth={3} />
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] z-50 -rotate-1">
                  <div className="px-4 py-3 border-b-4 border-black bg-gradient-to-r from-yellow-300 to-pink-300 dark:from-slate-700 dark:to-slate-600">
                    <p className="text-sm font-black text-black dark:text-white">{user?.full_name || user?.username}</p>
                    <p className="text-xs font-bold text-black/70 dark:text-white/70">{user?.email}</p>
                    <p className="text-xs font-bold text-black/70 dark:text-white/70 mt-1 uppercase">
                      {user?.role} • {getAppName(user?.app)}
                    </p>
                  </div>
                  
                  <Link
                    to={`/apps/${user?.app}/settings`}
                    className="flex items-center px-4 py-3 text-sm font-bold text-black dark:text-white hover:bg-blue-300 dark:hover:bg-slate-700 transition-colors border-b-4 border-black"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="h-5 w-5 mr-3 text-black dark:text-white" strokeWidth={3} />
                    Pengaturan
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm font-black text-white bg-red-500 hover:bg-red-600 transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-3" strokeWidth={3} />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-4 border-black bg-white dark:bg-slate-800">
          <div className="px-4 py-3 space-y-2">
            <Link
              to={`/apps/${user?.app}/dashboard`}
              className="block px-3 py-2 border-2 border-black text-sm font-bold text-black dark:text-white hover:bg-yellow-300 dark:hover:bg-slate-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to={`/apps/${user?.app}/settings`}
              className="block px-3 py-2 border-2 border-black text-sm font-bold text-black dark:text-white hover:bg-yellow-300 dark:hover:bg-slate-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pengaturan
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
