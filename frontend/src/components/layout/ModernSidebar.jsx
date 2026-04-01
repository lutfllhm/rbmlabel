import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  BarChart3,
  Tags,
  Inbox,
  Send,
  TrendingUp,
} from 'lucide-react'

const menuItems = {
  material: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/apps/material/dashboard' },
    { icon: Package, label: 'Stock', path: '/apps/material/stock' },
    { icon: Tags, label: 'Kategori', path: '/apps/material/categories' },
    { icon: FileText, label: 'SPK', path: '/apps/material/spk' },
    { icon: BarChart3, label: 'Laporan', path: '/apps/material/reports' },
    { icon: Users, label: 'Pengguna', path: '/apps/material/users' },
    { icon: Settings, label: 'Pengaturan', path: '/apps/material/settings' },
  ],
  stoklabel: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/apps/stoklabel/dashboard' },
    { icon: Package, label: 'Stock', path: '/apps/stoklabel/stock' },
    { icon: Inbox, label: 'Label Masuk', path: '/apps/stoklabel/masuk' },
    { icon: Send, label: 'Label Keluar', path: '/apps/stoklabel/keluar' },
    { icon: FileText, label: 'Surat Jalan', path: '/apps/stoklabel/surat-jalan' },
    { icon: BarChart3, label: 'Laporan', path: '/apps/stoklabel/reports' },
    { icon: Users, label: 'Pengguna', path: '/apps/stoklabel/users' },
    { icon: Settings, label: 'Pengaturan', path: '/apps/stoklabel/settings' },
  ],
  lps: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/apps/lps/dashboard' },
    { icon: FileText, label: 'Buat LPS', path: '/apps/lps/create' },
    { icon: Package, label: 'Daftar LPS', path: '/apps/lps/list' },
    { icon: TrendingUp, label: 'Selesai', path: '/apps/lps/finish' },
    { icon: BarChart3, label: 'Laporan', path: '/apps/lps/reports' },
    { icon: Users, label: 'Pengguna', path: '/apps/lps/users' },
    { icon: Settings, label: 'Pengaturan', path: '/apps/lps/settings' },
  ],
}

const activeClasses = {
  material:
    'bg-gradient-to-r from-material-600 to-material-700 text-white shadow-md shadow-material-600/25 ring-1 ring-material-500/30 dark:from-material-600 dark:to-material-700',
  stoklabel:
    'bg-gradient-to-r from-stoklabel-600 to-stoklabel-700 text-white shadow-md shadow-stoklabel-600/25 ring-1 ring-stoklabel-500/30 dark:from-stoklabel-600 dark:to-stoklabel-700',
  lps: 'bg-gradient-to-r from-lps-600 to-lps-700 text-white shadow-md shadow-lps-600/25 ring-1 ring-lps-500/30 dark:from-lps-600 dark:to-lps-700',
}

const inactiveHover = {
  material: 'hover:bg-material-50 dark:hover:bg-material-950/30',
  stoklabel: 'hover:bg-stoklabel-50 dark:hover:bg-stoklabel-950/25',
  lps: 'hover:bg-lps-50 dark:hover:bg-lps-950/30',
}

const sidebarAccent = {
  material: 'from-material-500 to-violet-500',
  stoklabel: 'from-stoklabel-500 to-teal-500',
  lps: 'from-lps-500 to-violet-600',
}

const ModernSidebar = ({ app = 'material', isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation()
  const isActive = (path) => location.pathname === path
  const accent = sidebarAccent[app] || sidebarAccent.material
  const hoverCls = inactiveHover[app] || inactiveHover.material

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`
          fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] flex-col border-r border-slate-200/80 bg-white/95 shadow-[4px_0_24px_-12px_rgba(15,23,42,0.12)] backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-950/95 dark:shadow-black/20
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className={`h-1 w-full shrink-0 bg-gradient-to-r ${accent} opacity-90`} aria-hidden />

        <div className="flex h-full min-h-0 flex-col">
          <div
            className={`flex shrink-0 items-center border-b border-slate-100 dark:border-slate-800/80 ${
              isCollapsed ? 'justify-center p-2' : 'justify-between px-3 py-3'
            }`}
          >
            {!isCollapsed && (
              <Link
                to="/"
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/80"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm dark:bg-slate-800">
                  <Home className="h-4 w-4" strokeWidth={2} />
                </div>
                <span>Home</span>
              </Link>
            )}
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden rounded-xl border border-slate-200/90 bg-slate-50/80 p-2 text-slate-600 transition hover:bg-slate-100 lg:block dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" strokeWidth={2} />
              ) : (
                <ChevronLeft className="h-5 w-5" strokeWidth={2} />
              )}
            </button>
          </div>

          <nav
            className={`min-h-0 flex-1 space-y-1 overflow-y-auto overflow-x-hidden overscroll-contain ${
              isCollapsed ? 'p-2' : 'p-3'
            }`}
          >
            {menuItems[app].map((item, index) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => onClose()}
                  title={isCollapsed ? item.label : undefined}
                  className={`
                    relative flex items-center rounded-xl text-sm font-medium transition-all duration-200
                    ${active ? activeClasses[app] : `text-slate-600 ${hoverCls} dark:text-slate-400`}
                    ${isCollapsed ? 'min-h-[2.75rem] justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'}
                  `}
                >
                  {active && !isCollapsed && (
                    <span
                      className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-white/90 dark:bg-white/80"
                      aria-hidden
                    />
                  )}
                  <Icon
                    className={`shrink-0 ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'}`}
                    strokeWidth={active ? 2.25 : 2}
                    aria-hidden
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          {!isCollapsed && (
            <div className="shrink-0 border-t border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800/80 dark:bg-slate-900/40">
              <p className="text-center text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                RBM Inventory v1.0
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default ModernSidebar
