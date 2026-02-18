import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

const Select = forwardRef(({ 
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Pilih...',
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-black uppercase text-black dark:text-white mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative group">
        <select
          ref={ref}
          className={`
            w-full px-4 py-3 pr-12
            bg-white dark:bg-slate-800 
            border-4 border-black
            text-black dark:text-white font-bold
            focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px]
            disabled:bg-gray-200 dark:disabled:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50
            transition-all duration-200
            appearance-none cursor-pointer
            shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
            ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-white dark:bg-slate-800 text-black dark:text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black dark:text-white">
          <ChevronDown className="h-5 w-5" strokeWidth={3} />
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm font-bold text-red-600 dark:text-red-400 flex items-center">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm font-bold text-gray-600 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select
