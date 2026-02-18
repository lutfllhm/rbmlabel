import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const PageHeader = ({ 
  title, 
  description, 
  icon: Icon,
  actions,
  showBack = false,
  backUrl,
  breadcrumbs
}) => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (backUrl) {
      navigate(backUrl)
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="mb-8">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-2">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="inline-flex items-center">
                {index > 0 && (
                  <svg className="w-4 h-4 text-black dark:text-white mx-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="inline-flex items-center text-sm font-bold text-black dark:text-white hover:underline"
                  >
                    {crumb.icon && <crumb.icon className="w-4 h-4 mr-2" strokeWidth={3} />}
                    {crumb.label}
                  </a>
                ) : (
                  <span className="inline-flex items-center text-sm font-bold text-black/60 dark:text-white/60">
                    {crumb.icon && <crumb.icon className="w-4 h-4 mr-2" strokeWidth={3} />}
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start space-x-4">
          {/* Back button */}
          {showBack && (
            <button
              onClick={handleBack}
              className="flex-shrink-0 p-3 border-4 border-black bg-white dark:bg-slate-800 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all mt-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              title="Kembali"
            >
              <ArrowLeft className="w-5 h-5 text-black dark:text-white" strokeWidth={3} />
            </button>
          )}

          {/* Icon */}
          {Icon && (
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-pink-400 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-6">
                <Icon className="w-7 h-7 text-black" strokeWidth={3} />
              </div>
            </div>
          )}

          {/* Title & Description */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-black uppercase text-black dark:text-white tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-sm font-bold text-black/70 dark:text-white/70">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center space-x-3 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mt-6 border-b-4 border-black"></div>
    </div>
  )
}

export default PageHeader
