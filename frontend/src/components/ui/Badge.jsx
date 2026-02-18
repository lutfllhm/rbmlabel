const Badge = ({ 
  children, 
  variant = 'default',
  app = 'material',
  className = '' 
}) => {
  const variants = {
    default: 'bg-gray-200 dark:bg-slate-700 text-black dark:text-white border-2 border-black',
    success: 'bg-emerald-400 text-black border-2 border-black',
    warning: 'bg-yellow-400 text-black border-2 border-black',
    error: 'bg-red-500 text-white border-2 border-black',
    info: 'bg-blue-400 text-black border-2 border-black',
    material: 'bg-blue-300 text-black border-2 border-black',
    stoklabel: 'bg-emerald-300 text-black border-2 border-black',
    lps: 'bg-orange-300 text-black border-2 border-black',
  }

  return (
    <span className={`
      inline-flex items-center px-3 py-1 text-xs font-black uppercase
      shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
      ${variants[variant] || variants.default}
      ${className}
    `}>
      {children}
    </span>
  )
}

export default Badge
