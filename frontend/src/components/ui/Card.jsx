const Card = ({ children, className = '', hover = false, variant = 'default' }) => {
  const variants = {
    default: 'bg-white dark:bg-slate-800 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
    yellow: 'bg-yellow-300 dark:bg-yellow-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
    blue: 'bg-blue-400 dark:bg-blue-500 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
    green: 'bg-emerald-400 dark:bg-emerald-500 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
    orange: 'bg-orange-400 dark:bg-orange-500 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
    pink: 'bg-pink-400 dark:bg-pink-500 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
  }

  return (
    <div className={`
      ${variants[variant]}
      ${hover ? 'hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px]' : ''}
      transition-all duration-200
      ${className}
    `}>
      {children}
    </div>
  )
}

export default Card
