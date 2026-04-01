import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const PageHeader = ({
  title,
  description,
  icon: Icon,
  actions,
  showBack = false,
  backUrl,
  breadcrumbs,
}) => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (backUrl) navigate(backUrl)
    else navigate(-1)
  }

  return (
    <div className="mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-4 flex" aria-label="Breadcrumb">
          <ol className="inline-flex flex-wrap items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="inline-flex items-center gap-2">
                {index > 0 && <span className="text-slate-300 dark:text-slate-600">/</span>}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="font-medium text-material-600 hover:underline dark:text-material-400"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-slate-500 dark:text-slate-400">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          {showBack && (
            <button
              type="button"
              onClick={handleBack}
              className="mt-0.5 shrink-0 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              title="Kembali"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={2} />
            </button>
          )}

          {Icon && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-material-100 text-material-700 dark:bg-material-950/50 dark:text-material-300">
              <Icon className="h-6 w-6" strokeWidth={2} />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
            )}
          </div>
        </div>

        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>

      <div className="mt-6 border-b border-slate-200 dark:border-slate-800" />
    </div>
  )
}

export default PageHeader
