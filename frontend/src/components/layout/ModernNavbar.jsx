import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Search, User, Settings, LogOut, ChevronDown, Home } from 'lucide-react'
import DarkModeToggle from '../DarkModeToggle'
import NotificationBell from '../NotificationBell'
import { useAuthStore } from '../../stores/authStore'

const accentDot = {
  material: 'bg-material-500 shadow-material-500/40',
  stoklabel: 'bg-stoklabel-500 shadow-stoklabel-500/40',
  lps: 'bg-lps-500 shadow-lps-500/40',
}

const barGradient = {
  material: 'from-material-500 via-violet-500 to-sky-500',
  stoklabel: 'from-stoklabel-500 via-emerald-400 to-teal-500',
  lps: 'from-lps-500 via-fuchsia-500 to-violet-500',
}

const avatarGradient = {
  material: 'from-material-500 to-material-700',
  stoklabel: 'from-stoklabel-500 to-stoklabel-700',
  lps: 'from-lps-500 to-lps-700',
}

const ModernNavbar = ({ app = 'material', onMenuClick }) => {
  const { user, logout } = useAuthStore()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const appNames = {
    material: 'Material Management',
    stoklabel: 'Stock Label',
    lps: 'LPS Production',
  }

  const bar = barGradient[app] || barGradient.material
  const av = avatarGradient[app] || avatarGradient.material

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
      <div
        className={`h-0.5 w-full bg-gradient-to-r opacity-90 dark:opacity-100 ${bar}`}
        aria-hidden
      />
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-[3.65rem] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onMenuClick}
              className="rounded-xl border border-slate-200/90 bg-white p-2.5 text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 lg:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Menu className="h-5 w-5" strokeWidth={2} />
            </button>

            <Link to="/" className="group flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-lg dark:bg-white">
                <img src="/img/rbm.png" alt="RBM" className="h-6 w-6 object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(17%) sepia(95%) saturate(7471%) hue-rotate(2deg) brightness(98%) contrast(118%)' }} />
              </div>
              <div className="hidden min-w-0 md:block">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${accentDot[app]}`} />
                  <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                    {appNames[app]}
                  </h1>
                </div>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">RBM Inventory · B2B</p>
              </div>
            </Link>
          </div>

          <div className="hidden max-w-md flex-1 md:block lg:mx-8">
            <div className="relative">
              <Search
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                strokeWidth={2}
              />
              <input
                type="search"
                placeholder="Cari data, part number, PO…"
                className="w-full rounded-full border border-slate-200/90 bg-slate-50/90 py-2.5 pl-12 pr-4 text-sm text-slate-900 shadow-inner shadow-slate-200/20 placeholder:text-slate-400 transition focus:border-material-500/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-material-500/15 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white dark:shadow-none dark:placeholder:text-slate-500 dark:focus:border-material-500/50 dark:focus:bg-slate-900"
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="rounded-full border border-slate-200/90 bg-white p-2 text-slate-600 shadow-sm md:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              <Search className="h-5 w-5" strokeWidth={2} />
            </button>

            <DarkModeToggle />
            <NotificationBell />

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-2xl border border-slate-200/90 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-inner ${av}`}
                >
                  <User className="h-4 w-4" strokeWidth={2} />
                </div>
                <span className="hidden max-w-[8rem] truncate text-sm font-medium text-slate-800 md:block dark:text-slate-100">
                  {user?.full_name || user?.username}
                </span>
                <ChevronDown className="hidden h-4 w-4 text-slate-500 md:block" strokeWidth={2} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 py-1 shadow-xl shadow-slate-200/50 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-black/40">
                  <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user?.full_name}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                  </div>
                  <Link
                    to="/"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Home className="h-4 w-4" strokeWidth={2} />
                    Home
                  </Link>
                  <Link
                    to={`/apps/${app}/settings`}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="h-4 w-4" strokeWidth={2} />
                    Pengaturan
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={2} />
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
