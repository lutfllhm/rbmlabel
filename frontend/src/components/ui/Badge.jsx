const Badge = ({ 
  children, 
  variant = 'default',
  app = 'material',
  className = '' 
}) => {
  const variants = {
    default: 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300',
    success: 'bg-success-light/10 dark:bg-success-dark/10 text-success-light dark:text-success-dark',
    warning: 'bg-warning-light/10 dark:bg-warning-dark/10 text-warning-light dark:text-warning-dark',
    error: 'bg-error-light/10 dark:bg-error-dark/10 text-error-light dark:text-error-dark',
    info: 'bg-info-light/10 dark:bg-info-dark/10 text-info-light dark:text-info-dark',
    material: 'bg-material-100 dark:bg-material-900/20 text-material-700 dark:text-material-300',
    stoklabel: 'bg-stoklabel-100 dark:bg-stoklabel-900/20 text-stoklabel-700 dark:text-stoklabel-300',
    lps: 'bg-lps-100 dark:bg-lps-900/20 text-lps-700 dark:text-lps-300',
  }

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${variants[variant] || variants.default}
      ${className}
    `}>
      {children}
    </span>
  )
}

export default Badge
