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
  X
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
        return 'bg-blue-600'
      case 'stoklabel':
        return 'bg-green-600'
      case 'lps':
        return 'bg-purple-600'
      default:
        return 'bg-blue-600'
    }
  }

  const AppIcon = getAppIcon(user?.app)
  const appColor = getAppColor(user?.app)

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 mr-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            <Link to="/" className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className={`p-2 ${appColor} rounded-lg mr-3`}>
                  <AppIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    {getAppName(user?.app)}
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">RBM System v1.0</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications */}
            <NotificationBell />

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`w-8 h-8 ${appColor} rounded-full flex items-center justify-center`}>
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.full_name || user?.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.full_name || user?.username}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-gray-400 mt-1 capitalize">
                      {user?.role} • {getAppName(user?.app)}
                    </p>
                  </div>
                  
                  <Link
                    to={`/apps/${user?.app}/settings`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="h-4 w-4 mr-3 text-gray-400" />
                    Pengaturan
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
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
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link
              to={`/apps/${user?.app}/dashboard`}
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to={`/apps/${user?.app}/settings`}
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
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
