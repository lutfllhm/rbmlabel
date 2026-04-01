import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Package, Tags, FileText, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button'
import DarkModeToggle from '../components/DarkModeToggle'

const LoginPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login, user, isLoading } = useAuthStore()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    app: searchParams.get('app') || 'material',
  })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (user) {
      navigate(`/apps/${user.app}`)
    }
  }, [user, navigate])

  const apps = [
    {
      id: 'material',
      name: 'Material',
      icon: Package,
      gradient: 'from-sky-500 to-blue-600',
    },
    {
      id: 'stoklabel',
      name: 'Stock Label',
      icon: Tags,
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'lps',
      name: 'LPS',
      icon: FileText,
      gradient: 'from-violet-500 to-purple-600',
    },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.username || !formData.password) {
      toast.error('Username dan password harus diisi')
      return
    }

    const result = await login(formData)

    if (result.success) {
      toast.success('Login berhasil!')
      navigate(`/apps/${formData.app}`)
    } else {
      toast.error(result.error)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const selectedApp = apps.find((app) => app.id === formData.app)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl dark:bg-sky-500/5" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-500/5" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg dark:bg-white">
              <img src="/img/rbm.png" alt="RBM" className="h-7 w-7 object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(17%) sepia(95%) saturate(7471%) hue-rotate(2deg) brightness(98%) contrast(118%)' }} />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">RBM Inventory</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Sistem Manajemen Inventori</p>
            </div>
          </Link>
        </div>

        {/* Login Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          {/* App Selector */}
          <div className="border-b border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
            <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Pilih Modul
            </label>
            <div className="grid grid-cols-3 gap-2">
              {apps.map((app) => {
                const Icon = app.icon
                const isSelected = formData.app === app.id
                return (
                  <label key={app.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="app"
                      value={app.id}
                      checked={isSelected}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900 shadow-lg dark:border-white dark:bg-white'
                          : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600'
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          isSelected
                            ? 'text-white dark:text-slate-900'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                        strokeWidth={2}
                      />
                      <span
                        className={`text-xs font-semibold ${
                          isSelected
                            ? 'text-white dark:text-slate-900'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {app.name}
                      </span>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-white dark:focus:ring-white/10"
                placeholder="Masukkan username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-white dark:focus:ring-white/10"
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              app={formData.app}
              variant="primary"
              disabled={isLoading}
              className="w-full justify-center rounded-xl py-3 text-base font-semibold"
            >
              {isLoading ? (
                <>
                  <span className="mr-2 inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Memproses...
                </>
              ) : (
                `Masuk ke ${selectedApp?.name}`
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between text-sm">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
          <DarkModeToggle />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
