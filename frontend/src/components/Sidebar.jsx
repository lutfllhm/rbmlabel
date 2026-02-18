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
    <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-800 border-r-8 border-black pt-20 shadow-[8px_0_0px_0px_rgba(0,0,0,1)]">
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-3 space-y-3">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              const isActive = item.exact 
                ? location.pathname === item.href
                : location.pathname.startsWith(item.href)

              // Asymmetric rotation for neo-brutalism
              const rotation = index % 3 === 0 ? '-rotate-1' : index % 3 === 1 ? 'rotate-1' : 'rotate-0'

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive: navIsActive }) => {
                    const active = item.exact ? navIsActive : isActive
                    return `group flex items-center px-4 py-3 text-sm font-black uppercase border-4 border-black transition-all ${rotation} ${
                      active
                        ? `${appColor} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] scale-105`
                        : 'bg-white dark:bg-slate-700 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                    }`
                  }}
                >
                  <Icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 text-black dark:text-white`}
                    strokeWidth={3}
                  />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Settings at bottom */}
        <div className="flex-shrink-0 p-3 border-t-8 border-black bg-gradient-to-r from-yellow-300 to-pink-300 dark:from-slate-700 dark:to-slate-600">
          <NavLink
            to={`/apps/${user?.app}/settings`}
            className={({ isActive }) =>
              `group flex items-center px-4 py-3 text-sm font-black uppercase border-4 border-black transition-all rotate-1 ${
                isActive
                  ? 'bg-black text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white dark:bg-slate-800 text-black dark:text-white hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
              }`
            }
          >
            <Settings className="mr-3 flex-shrink-0 h-5 w-5" strokeWidth={3} />
            Settings
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Sidebar