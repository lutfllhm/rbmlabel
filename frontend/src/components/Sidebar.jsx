import { NavLink, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { 
  Home,
  Package,
  Tags,
  FileText,
  BarChart3,
  Settings,
  Users,
  Plus,
  List,
  TrendingUp,
  Archive,
  Truck,
  ClipboardList
} from 'lucide-react'

const Sidebar = () => {
  const { user } = useAuthStore()
  const location = useLocation()

  const getMenuItems = () => {
    const baseItems = [
      {
        name: 'Dashboard',
        href: `/apps/${user?.app}`,
        icon: Home,
        exact: true
      }
    ]

    switch (user?.app) {
      case 'material':
        return [
          ...baseItems,
          {
            name: 'Material Stock',
            href: `/apps/material/stock`,
            icon: Package
          },
          {
            name: 'Categories',
            href: `/apps/material/categories`,
            icon: Archive
          },
          {
            name: 'Label List',
            href: `/apps/material/labels`,
            icon: Tags
          },
          {
            name: 'SPK',
            href: `/apps/material/spk`,
            icon: FileText
          },
          {
            name: 'Reports',
            href: `/apps/material/reports`,
            icon: BarChart3
          },
          ...(user?.role === 'admin' ? [{
            name: 'Users',
            href: `/apps/material/users`,
            icon: Users
          }] : [])
        ]

      case 'stoklabel':
        return [
          ...baseItems,
          {
            name: 'Stock Label',
            href: `/apps/stoklabel/stock`,
            icon: Tags
          },
          {
            name: 'Label Masuk',
            href: `/apps/stoklabel/masuk`,
            icon: Plus
          },
          {
            name: 'Label Keluar',
            href: `/apps/stoklabel/keluar`,
            icon: Truck
          },
          {
            name: 'Surat Jalan',
            href: `/apps/stoklabel/surat-jalan`,
            icon: ClipboardList
          },
          {
            name: 'Reports',
            href: `/apps/stoklabel/reports`,
            icon: BarChart3
          },
          ...(user?.role === 'admin' ? [{
            name: 'Users',
            href: `/apps/stoklabel/users`,
            icon: Users
          }] : [])
        ]

      case 'lps':
        return [
          ...baseItems,
          {
            name: 'LPS List',
            href: `/apps/lps/list`,
            icon: List
          },
          {
            name: 'Create LPS',
            href: `/apps/lps/create`,
            icon: Plus
          },
          {
            name: 'Label Finish',
            href: `/apps/lps/finish`,
            icon: FileText
          },
          {
            name: 'Reports',
            href: `/apps/lps/reports`,
            icon: BarChart3
          },
          ...(user?.role === 'admin' ? [{
            name: 'Users',
            href: `/apps/lps/users`,
            icon: Users
          }] : [])
        ]

      default:
        return baseItems
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

  const menuItems = getMenuItems()
  const appColor = getAppColor(user?.app)

  return (
    <div className="fixed inset-y-0 left-0 z-30 w-64 border-r border-slate-200 bg-white pt-16 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-full flex-col">
        <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
          <nav className="mt-5 flex-1 space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = item.exact 
                ? location.pathname === item.href
                : location.pathname.startsWith(item.href)

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive: navIsActive }) => {
                    const active = item.exact ? navIsActive : isActive
                    return `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      active
                        ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`
                  }}
                >
                  <Icon
                    className="h-5 w-5 flex-shrink-0"
                    strokeWidth={2}
                  />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Settings at bottom */}
        <div className="flex-shrink-0 border-t border-slate-200 p-3 dark:border-slate-800">
          <NavLink
            to={`/apps/${user?.app}/settings`}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`
            }
          >
            <Settings className="h-5 w-5 flex-shrink-0" strokeWidth={2} />
            Settings
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Sidebar