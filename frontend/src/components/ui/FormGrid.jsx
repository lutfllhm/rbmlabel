const FormGrid = ({ 
  cols = 1, 
  children, 
  className = '' 
}) => {
  const gridClasses = {
    1: 'grid grid-cols-1 gap-4',
    2: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
  }

  return (
    <div className={`${gridClasses[cols] || gridClasses[1]} ${className}`}>
      {children}
    </div>
  )
}

export default FormGrid
