const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`
      bg-white dark:bg-slate-800 
      rounded-xl shadow-sm 
      border border-gray-200 dark:border-slate-700
      ${hover ? 'hover:shadow-lg hover:-translate-y-1' : ''}
      transition-all duration-300
      ${className}
    `}>
      {children}
    </div>
  )
}

export default Card
