import { useState } from 'react'
import ModernNavbar from './ModernNavbar'
import ModernSidebar from './ModernSidebar'

const ModernLayout = ({ app = 'material', children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Navbar - Fixed at top */}
      <ModernNavbar 
        app={app} 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
      />

      {/* Main Container - Below navbar */}
      <div className="flex pt-16">
        {/* Sidebar - Fixed, starts below navbar */}
        <ModernSidebar 
          app={app} 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content - Scrollable, with margin for sidebar on desktop */}
        <main className={`
          flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden min-h-[calc(100vh-4rem)] 
          transition-all duration-300
          ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
        `}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default ModernLayout
