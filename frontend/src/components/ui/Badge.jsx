const Badge = ({
  children,
  variant = 'default',
  app = 'material',
  className = '',
}) => {
  const variants = {
    default:
      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200',
    error: 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300',
    info: 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300',
    material: 'bg-material-100 text-material-800 dark:bg-material-950/50 dark:text-material-300',
    stoklabel: 'bg-stoklabel-100 text-stoklabel-800 dark:bg-stoklabel-950/50 dark:text-stoklabel-300',
    lps: 'bg-lps-100 text-lps-800 dark:bg-lps-950/50 dark:text-lps-300',
  }

  return (
    <span
      className={`
      inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
      ${variants[variant] || variants.default}
      ${className}
    `}
    >
      {children}
    </span>
  )
}

export default Badge
