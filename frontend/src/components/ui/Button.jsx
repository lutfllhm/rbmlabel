const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  app = 'material',
  className = '',
  ...props 
}) => {
  const getVariantClasses = () => {
    const baseClasses = {
      material: {
        primary: 'bg-material-600 hover:bg-material-700 dark:bg-material-500 dark:hover:bg-material-400 text-white',
        secondary: 'bg-material-100 hover:bg-material-200 dark:bg-material-900 dark:hover:bg-material-800 text-material-700 dark:text-material-300',
        outline: 'border-2 border-material-600 dark:border-material-400 text-material-600 dark:text-material-400 hover:bg-material-50 dark:hover:bg-material-900',
      },
      stoklabel: {
        primary: 'bg-stoklabel-600 hover:bg-stoklabel-700 dark:bg-stoklabel-500 dark:hover:bg-stoklabel-400 text-white',
        secondary: 'bg-stoklabel-100 hover:bg-stoklabel-200 dark:bg-stoklabel-900 dark:hover:bg-stoklabel-800 text-stoklabel-700 dark:text-stoklabel-300',
        outline: 'border-2 border-stoklabel-600 dark:border-stoklabel-400 text-stoklabel-600 dark:text-stoklabel-400 hover:bg-stoklabel-50 dark:hover:bg-stoklabel-900',
      },
      lps: {
        primary: 'bg-lps-600 hover:bg-lps-700 dark:bg-lps-500 dark:hover:bg-lps-400 text-white',
        secondary: 'bg-lps-100 hover:bg-lps-200 dark:bg-lps-900 dark:hover:bg-lps-800 text-lps-700 dark:text-lps-300',
        outline: 'border-2 border-lps-600 dark:border-lps-400 text-lps-600 dark:text-lps-400 hover:bg-lps-50 dark:hover:bg-lps-900',
      }
    }
    return baseClasses[app]?.[variant] || baseClasses.material[variant]
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`
        ${getVariantClasses()}
        ${sizes[size]}
        rounded-lg font-medium
        transition-all duration-200
        hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
