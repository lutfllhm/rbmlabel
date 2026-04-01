const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  app = 'material',
  className = '',
  ...props
}) => {
  const accent = {
    material: {
      primary: 'bg-material-600 text-white hover:bg-material-700 focus-visible:ring-material-500',
      secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 focus-visible:ring-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
      outline:
        'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    },
    stoklabel: {
      primary: 'bg-stoklabel-600 text-white hover:bg-stoklabel-700 focus-visible:ring-stoklabel-500',
      secondary: 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 focus-visible:ring-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-100 dark:hover:bg-emerald-900/40',
      outline:
        'border border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50 focus-visible:ring-emerald-500 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-100 dark:hover:bg-emerald-950/30',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    },
    lps: {
      primary: 'bg-lps-600 text-white hover:bg-lps-700 focus-visible:ring-lps-500',
      secondary: 'bg-violet-50 text-violet-900 hover:bg-violet-100 focus-visible:ring-violet-500 dark:bg-violet-950/40 dark:text-violet-100 dark:hover:bg-violet-900/40',
      outline:
        'border border-violet-200 bg-white text-violet-900 hover:bg-violet-50 focus-visible:ring-violet-500 dark:border-violet-800 dark:bg-slate-900 dark:text-violet-100 dark:hover:bg-violet-950/30',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    },
  }

  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50'

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  }

  const styles = accent[app] || accent.material

  return (
    <button
      className={`${base} ${styles[variant] || styles.primary} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
