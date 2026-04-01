const Card = ({ children, className = '', hover = false, variant = 'default' }) => {
  const variants = {
    default:
      'rounded-2xl border border-slate-200/80 bg-white/95 shadow-sm shadow-slate-200/40 ring-1 ring-slate-100/80 dark:border-slate-700/70 dark:bg-slate-900/75 dark:shadow-none dark:ring-white/[0.04]',
    muted:
      'rounded-2xl border border-slate-200/80 bg-slate-50/80 shadow-none dark:border-slate-700 dark:bg-slate-800/50',
    yellow:
      'rounded-2xl border border-amber-200/90 bg-amber-50/90 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/30',
    blue:
      'rounded-2xl border border-blue-200/90 bg-blue-50/80 shadow-sm dark:border-blue-900/40 dark:bg-blue-950/30',
    green:
      'rounded-2xl border border-emerald-200/90 bg-emerald-50/80 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/30',
    orange:
      'rounded-2xl border border-orange-200/90 bg-orange-50/80 shadow-sm dark:border-orange-900/40 dark:bg-orange-950/30',
    pink:
      'rounded-2xl border border-pink-200/90 bg-pink-50/80 shadow-sm dark:border-pink-900/40 dark:bg-pink-950/30',
  }

  return (
    <div
      className={`
      ${variants[variant] || variants.default}
      ${hover ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-300/50 dark:hover:shadow-lg dark:hover:shadow-black/30' : ''}
      ${className}
    `}
    >
      {children}
    </div>
  )
}

export default Card
