import { forwardRef } from 'react'

const Input = forwardRef(({ 
  label,
  error,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          w-full px-3 py-2 
          bg-white dark:bg-slate-800 
          border border-gray-300 dark:border-slate-600
          rounded-lg 
          text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
          disabled:bg-gray-100 dark:disabled:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50
          transition-all duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
