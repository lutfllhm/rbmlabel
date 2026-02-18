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
        primary: 'bg-blue-400 hover:bg-blue-500 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]',
        secondary: 'bg-yellow-300 hover:bg-yellow-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]',
        outline: 'bg-white dark:bg-slate-800 text-black dark:text-white border-4 border-black hover:bg-gray-100 dark:hover:bg-slate-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]',
        danger: 'bg-red-500 hover:bg-red-600 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]',
      },
      stoklabel: {
        primary: 'bg-emerald-400 hover:bg-emerald-500 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]',
        secondary: 'bg-pink-300 hover:bg-pink-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]',
        outline: 'bg-white dark:bg-slate-800 text-black dark:text-white border-4 border-black hover:bg-gray-100 dark:hover:bg-slate-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]',
        danger: 'bg-red-500 hover:bg-red-600 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]',
      },
      lps: {
        primary: 'bg-orange-400 hover:bg-orange-500 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]',
        secondary: 'bg-purple-300 hover:bg-purple-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]',
        outline: 'bg-white dark:bg-slate-800 text-black dark:text-white border-4 border-black hover:bg-gray-100 dark:hover:bg-slate-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]',
        danger: 'bg-red-500 hover:bg-red-600 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]',
      }
    }
    return baseClasses[app]?.[variant] || baseClasses.material[variant]
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`
        ${getVariantClasses()}
        ${sizes[size]}
        font-black uppercase
        transition-all duration-200
        active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
