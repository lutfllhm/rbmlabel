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
    material: 'bg-gradient-to-r from-blue-400 to-blue-500 border-b-8 border-black shadow-[0_8px_0px_0px_rgba(0,0,0,1)]',
    stoklabel: 'bg-gradient-to-r from-emerald-400 to-emerald-500 border-b-8 border-black shadow-[0_8px_0px_0px_rgba(0,0,0,1)]',
    lps: 'bg-gradient-to-r from-orange-400 to-orange-500 border-b-8 border-black shadow-[0_8px_0px_0px_rgba(0,0,0,1)]'
  }

  const appNames = {
    material: 'Material Management',
    stoklabel: 'Stock Label',
    lps: 'LPS Production'
  }

  return (
    <nav className={`${appColors[app]} text-black sticky top-0 z-50 transition-colors duration-300`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 border-4 border-black bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              <Menu className="w-6 h-6 text-black" strokeWidth={3} />
            </button>

            {/* Logo & App Name */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center group-hover:rotate-6 transition-transform -rotate-6">
                <img src="/img/rbm.png" alt="RBM" className="w-7 h-7 invert" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-black uppercase">{appNames[app]}</h1>
                <p className="text-xs font-bold text-black/70">RBM System</p>
              </div>
            </Link>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" strokeWidth={3} />
              <input
                type="text"
                placeholder="Cari..."
                className="w-full pl-12 pr-4 py-3 bg-white border-4 border-black text-black placeholder-black/50 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Search Button (Mobile) */}
            <button className="md:hidden p-2 border-4 border-black bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
              <Search className="w-5 h-5 text-black" strokeWidth={3} />
            </button>

            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* Notifications */}
            <NotificationBell />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 border-4 border-black bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                <div className="w-8 h-8 bg-black border-2 border-black flex items-center justify-center">
                  <User className="w-5 h-5 text-white" strokeWidth={3} />
                </div>
                <span className="hidden md:block text-sm font-black text-black">
                  {user?.full_name || user?.username}
                </span>
                <ChevronDown className="hidden md:block w-4 h-4 text-black" strokeWidth={3} />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] py-2 -rotate-1">
                  <div className="px-4 py-3 border-b-4 border-black bg-gradient-to-r from-yellow-300 to-pink-300 dark:from-slate-700 dark:to-slate-600">
                    <p className="text-sm font-black text-black dark:text-white">
                      {user?.full_name}
                    </p>
                    <p className="text-xs font-bold text-black/70 dark:text-white/70">
                      {user?.email}
                    </p>
                  </div>
                  
                  <Link
                    to="/"
                    className="flex items-center px-4 py-2 text-sm font-bold text-black dark:text-white hover:bg-blue-300 dark:hover:bg-slate-700 border-b-2 border-black"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Home className="w-4 h-4 mr-3" strokeWidth={3} />
                    Home
                  </Link>
                  
                  <Link
                    to={`/apps/${app}/settings`}
                    className="flex items-center px-4 py-2 text-sm font-bold text-black dark:text-white hover:bg-blue-300 dark:hover:bg-slate-700 border-b-2 border-black"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="w-4 h-4 mr-3" strokeWidth={3} />
                    Pengaturan
                  </Link>
                  
                  <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-sm font-black text-white bg-red-500 hover:bg-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-3" strokeWidth={3} />
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
