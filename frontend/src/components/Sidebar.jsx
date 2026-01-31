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

  const menuItems = getMenuItems()

  return (
    <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg border-r border-gray-200 pt-16">
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
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
                    return `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      active
                        ? 'bg-primary-100 text-primary-900 border-r-2 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }}
                >
                  <Icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Settings at bottom */}
        <div className="flex-shrink-0 p-2 border-t border-gray-200">
          <NavLink
            to={`/apps/${user?.app}/settings`}
            className={({ isActive }) =>
              `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-primary-100 text-primary-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Settings className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            Settings
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Sidebar