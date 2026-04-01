/**
 * Page title strip — selaras dengan dashboard (gradient + orbs) per app.
 */
const themes = {
  material: {
    border: 'border-slate-200/80 dark:border-slate-700/80',
    bg: 'from-white via-slate-50/90 to-material-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-material-950/40',
    orbA: 'bg-material-500/15 blur-3xl dark:bg-material-500/20',
    orbB: 'bg-violet-400/10 blur-2xl dark:bg-violet-500/10',
    eyebrow: 'text-material-600 dark:text-material-400',
  },
  stoklabel: {
    border: 'border-slate-200/80 dark:border-slate-700/80',
    bg: 'from-white via-emerald-50/40 to-sky-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-stoklabel-950/35',
    orbA: 'bg-stoklabel-500/15 blur-3xl dark:bg-stoklabel-500/20',
    orbB: 'bg-sky-400/10 blur-2xl dark:bg-sky-500/10',
    eyebrow: 'text-stoklabel-600 dark:text-stoklabel-400',
  },
  lps: {
    border: 'border-slate-200/80 dark:border-slate-700/80',
    bg: 'from-white via-violet-50/50 to-fuchsia-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-lps-950/40',
    orbA: 'bg-lps-500/15 blur-3xl dark:bg-lps-500/25',
    orbB: 'bg-fuchsia-400/10 blur-2xl dark:bg-fuchsia-500/10',
    eyebrow: 'text-lps-600 dark:text-lps-400',
  },
}

const AppPageHero = ({ app = 'material', eyebrow, title, description, children, className = '' }) => {
  const t = themes[app] || themes.material

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br p-6 shadow-md shadow-slate-200/30 dark:shadow-black/20 sm:p-7 ${t.border} ${t.bg} ${className}`}
    >
      <div className={`pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full ${t.orbA}`} aria-hidden />
      <div className={`pointer-events-none absolute bottom-0 left-1/4 h-24 w-40 rounded-full ${t.orbB}`} aria-hidden />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${t.eyebrow}`}>{eyebrow}</p>
          )}
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">{title}</h1>
          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{description}</p>
          )}
        </div>
        {children && <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div>}
      </div>
    </div>
  )
}

export default AppPageHero
