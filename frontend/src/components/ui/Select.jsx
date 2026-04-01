import { forwardRef } from 'react'

const Select = forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon: LeftIcon,
      children,
      className = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
            w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900
            shadow-sm transition-all
            hover:border-slate-300
            focus:border-material-500 focus:outline-none focus:ring-2 focus:ring-material-500/20
            disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60
            dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100
            dark:hover:border-slate-500
            dark:focus:border-material-400 dark:focus:ring-material-400/20
            ${error ? 'border-red-400 hover:border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
            {...props}
          >
            {children}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
            <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
