const ringClass = {
  material: 'border-t-material-600 dark:border-t-material-400',
  stoklabel: 'border-t-stoklabel-600 dark:border-t-stoklabel-400',
  lps: 'border-t-lps-600 dark:border-t-lps-400',
}

const PageLoading = ({ app = 'material', label = 'Memuat…' }) => {
  const ring = ringClass[app] || ringClass.material
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      <div
        className={`h-11 w-11 animate-spin rounded-full border-2 border-slate-200 dark:border-slate-700 ${ring}`}
      />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  )
}

export default PageLoading
