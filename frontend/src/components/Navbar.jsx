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

  const getAppGradient = (app) => {
    switch (app) {
      case 'material':
        return 'from-sky-500 to-blue-600'
      case 'stoklabel':
        return 'from-emerald-500 to-teal-600'
      case 'lps':
        return 'from-violet-500 to-purple-600'
      default:
        return 'from-sky-500 to-blue-600'
    }
  }

  const appGradient = getAppGradient(user?.app)

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-sm dark:border-slate-800/80 dark:bg-slate-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" strokeWidth={2} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={2} />
              )}
            </button>

            <Link to="/" className="group flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg dark:bg-white">
                <img src="/img/rbm.png" alt="RBM" className="h-5 w-5 object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(17%) sepia(95%) saturate(7471%) hue-rotate(2deg) brightness(98%) contrast(118%)' }} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                  {getAppName(user?.app)}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">RBM System</p>
              </div>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <NotificationBell />

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-slate-300 hover:shadow dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${appGradient}`}>
                  <User className="h-4 w-4 text-white" strokeWidth={2} />
                </div>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.full_name || user?.username}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role}</p>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" strokeWidth={2} />
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
                  <div className={`bg-gradient-to-br ${appGradient} px-4 py-4`}>
                    <p className="font-semibold text-white">{user?.full_name || user?.username}</p>
                    <p className="text-sm text-white/80">{user?.email}</p>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {user?.role} • {getAppName(user?.app)}
                    </div>
                  </div>
                  
                  <div className="p-1">
                    <Link
                      to={`/apps/${user?.app}/settings`}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="h-4 w-4" strokeWidth={2} />
                      Pengaturan
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <LogOut className="h-4 w-4" strokeWidth={2} />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-1 px-4 py-3">
            <Link
              to={`/apps/${user?.app}/dashboard`}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to={`/apps/${user?.app}/settings`}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
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
