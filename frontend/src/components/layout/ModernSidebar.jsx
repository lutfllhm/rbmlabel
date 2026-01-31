import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, Package, FileText, Users, 
  Settings, ChevronLeft, ChevronRight, Home,
  BarChart3, Tags, Inbox, Send, TrendingUp
} from 'lucide-react'

const ModernSidebar = ({ app = 'material', isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation()

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
    ]
  }

  const appColors = {
    material: 'text-material-600 dark:text-material-400 bg-material-50 dark:bg-material-900/20',
    stoklabel: 'text-stoklabel-600 dark:text-stoklabel-400 bg-stoklabel-50 dark:bg-stoklabel-900/20',
    lps: 'text-lps-600 dark:text-lps-400 bg-lps-50 dark:bg-lps-900/20'
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)]
          bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800
          transition-all duration-300 z-40
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800">
            {!isCollapsed && (
              <Link to="/" className="flex items-center space-x-2">
                <Home className="w-5 h-5 text-gray-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                  Kembali ke Home
                </span>
              </Link>
            )}
            
            <button
              onClick={onToggleCollapse}
              className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-slate-400" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-slate-400" />
              )}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems[app].map((item, index) => {
              const Icon = item.icon
              const active = isActive(item.path)
              
              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => onClose()}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl
                    transition-all duration-200 group
                    ${active 
                      ? `${appColors[app]} font-semibold shadow-sm` 
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className={`w-5 h-5 ${active ? '' : 'group-hover:scale-110 transition-transform'}`} />
                  {!isCollapsed && (
                    <span className="text-sm">{item.label}</span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          {!isCollapsed && (
            <div className="p-4 border-t border-gray-200 dark:border-slate-800">
              <div className="text-xs text-gray-500 dark:text-slate-500 text-center">
                RBM System v1.0
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default ModernSidebar
