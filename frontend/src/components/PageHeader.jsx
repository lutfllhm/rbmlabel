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
    <div className="mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex mb-3" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="inline-flex items-center">
                {index > 0 && (
                  <svg className="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    {crumb.icon && <crumb.icon className="w-4 h-4 mr-2" />}
                    {crumb.label}
                  </a>
                ) : (
                  <span className="inline-flex items-center text-sm font-medium text-gray-500">
                    {crumb.icon && <crumb.icon className="w-4 h-4 mr-2" />}
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
              className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors mt-1"
              title="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Icon */}
          {Icon && (
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          )}

          {/* Title & Description */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-gray-600">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center space-x-2 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mt-6 border-b border-gray-200"></div>
    </div>
  )
}

export default PageHeader
