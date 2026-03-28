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
    material: 'bg-blue-400 text-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
    stoklabel: 'bg-emerald-400 text-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
    lps: 'bg-orange-400 text-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)]
          bg-white dark:bg-slate-800 border-r-8 border-black
          transition-all duration-300 z-40
          shadow-[8px_0_0px_0px_rgba(0,0,0,1)]
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div
            className={`flex items-center border-b-4 border-black bg-gradient-to-r from-yellow-300 to-pink-300 dark:from-slate-700 dark:to-slate-600 ${
              isCollapsed ? 'justify-center p-2' : 'justify-between p-4'
            }`}
          >
            {!isCollapsed && (
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-black border-2 border-black flex items-center justify-center -rotate-6 group-hover:rotate-6 transition-transform">
                  <Home className="w-5 h-5 text-white" strokeWidth={3} />
                </div>
                <span className="text-sm font-black uppercase text-black dark:text-white">
                  Home
                </span>
              </Link>
            )}
            
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden shrink-0 border-2 border-black bg-white p-2 dark:bg-slate-800 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] lg:block"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-black dark:text-white" strokeWidth={3} />
              ) : (
                <ChevronLeft className="w-5 h-5 text-black dark:text-white" strokeWidth={3} />
              )}
            </button>
          </div>

          {/* Menu Items */}
          <nav
            className={`flex-1 overflow-y-auto overflow-x-hidden overscroll-contain ${
              isCollapsed ? 'space-y-2 p-2' : 'space-y-3 p-4'
            }`}
          >
            {menuItems[app].map((item, index) => {
              const Icon = item.icon
              const active = isActive(item.path)
              const rotation = index % 3 === 0 ? '-rotate-1' : index % 3 === 1 ? 'rotate-1' : 'rotate-0'
              
              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => onClose()}
                  className={`
                    flex items-center border-4 border-black transition-all duration-200 group font-black uppercase text-sm
                    ${active 
                      ? `${appColors[app]} scale-105` 
                      : 'bg-white dark:bg-slate-700 text-black dark:text-white hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                    }
                    ${isCollapsed
                      ? 'min-h-[2.75rem] justify-center px-2 py-2.5'
                      : 'space-x-3 px-4 py-3'
                    }
                    ${rotation}
                  `}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon
                    className={`shrink-0 ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'}`}
                    strokeWidth={3}
                    aria-hidden
                  />
                  {!isCollapsed && (
                    <span className="text-sm">{item.label}</span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          {!isCollapsed && (
            <div className="p-4 border-t-4 border-black bg-yellow-300 dark:bg-slate-700">
              <div className="text-xs font-black uppercase text-black dark:text-white text-center">
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
