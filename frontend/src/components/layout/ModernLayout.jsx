import { useState } from 'react'
import ModernNavbar from './ModernNavbar'
import ModernSidebar from './ModernSidebar'

const orbClass = {
  material: 'bg-material-500/15 dark:bg-material-500/20',
  stoklabel: 'bg-stoklabel-500/15 dark:bg-stoklabel-500/20',
  lps: 'bg-lps-500/15 dark:bg-lps-500/20',
}

const orbClassSecondary = {
  material: 'bg-sky-400/10 dark:bg-sky-500/10',
  stoklabel: 'bg-emerald-400/10 dark:bg-emerald-500/10',
  lps: 'bg-violet-400/10 dark:bg-violet-500/10',
}

const ModernLayout = ({ app = 'material', children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-100/90 dark:bg-slate-950">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div
          className={`absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full blur-3xl ${orbClass[app] || orbClass.material}`}
        />
        <div
          className={`absolute -bottom-32 -left-24 h-[22rem] w-[22rem] rounded-full blur-3xl ${orbClassSecondary[app] || orbClassSecondary.material}`}
        />
        <div
          className="absolute inset-0 opacity-[0.4] dark:opacity-[0.25]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgb(148 163 184 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(148 163 184 / 0.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10">
        <ModernNavbar app={app} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex">
          <ModernSidebar
            app={app}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          <main
            className={`
            min-h-screen flex-1 overflow-x-hidden p-4 pt-20 transition-all duration-300 md:p-6 md:pt-20 lg:p-8 lg:pt-20
            ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
          `}
          >
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default ModernLayout
