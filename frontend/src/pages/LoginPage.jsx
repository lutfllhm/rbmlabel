import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Package, Tags, FileText, Eye, EyeOff, ArrowLeft, Lock, User as UserIcon, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login, user, isLoading } = useAuthStore()
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    app: searchParams.get('app') || 'material'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  useEffect(() => {
    if (user) {
      navigate(`/apps/${user.app}`)
    }
  }, [user, navigate])

  const apps = [
    {
      id: 'material',
      name: 'Material Management',
      description: 'Kelola stok material dan SPK',
      icon: Package,
      color: 'bg-blue-400',
      borderColor: 'border-blue-600',
      hoverColor: 'hover:bg-blue-500'
    },
    {
      id: 'stoklabel',
      name: 'Stock Label',
      description: 'Manajemen stok label',
      icon: Tags,
      color: 'bg-emerald-400',
      borderColor: 'border-emerald-600',
      hoverColor: 'hover:bg-emerald-500'
    },
    {
      id: 'lps',
      name: 'LPS Production',
      description: 'Laporan produksi selesai',
      icon: FileText,
      color: 'bg-orange-400',
      borderColor: 'border-orange-600',
      hoverColor: 'hover:bg-orange-500'
    }
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
      [e.target.name]: e.target.value
    })
  }

  const selectedApp = apps.find(app => app.id === formData.app)
  const SelectedIcon = selectedApp?.icon || Package

  return (
    <div className="min-h-screen bg-yellow-300 dark:bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-pink-400 border-4 border-black rotate-12 -z-0"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-400 border-4 border-black -rotate-6 -z-0"></div>
      <div className="absolute top-1/2 right-10 w-24 h-24 bg-emerald-400 border-4 border-black rotate-45 -z-0"></div>

      <div className="relative z-10 max-w-6xl w-full">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-black uppercase border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali
        </Link>

        {/* Main Container - Asymmetric Grid */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Side - App Selection (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rotate-1">
              <Link to="/" className="block group">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-black dark:bg-yellow-300 border-4 border-black rotate-6 group-hover:rotate-12 transition-transform flex items-center justify-center">
                    <img 
                      src="/img/rbm.png" 
                      alt="RBM" 
                      className="w-10 h-10 object-contain invert dark:invert-0"
                    />
                  </div>
                </div>
                <h1 className="text-4xl font-black uppercase text-black dark:text-white mb-2">
                  RBM SYSTEM
                </h1>
                <p className="text-lg font-bold text-black/70 dark:text-white/70">
                  Login Portal
                </p>
              </Link>
            </div>

            {/* App Selection Cards */}
            <div className="space-y-4">
              <div className="bg-black text-white border-4 border-black p-4 -rotate-1">
                <h3 className="text-xl font-black uppercase flex items-center">
                  <Zap className="w-6 h-6 mr-2" />
                  Pilih Aplikasi
                </h3>
              </div>

              {apps.map((app) => {
                const Icon = app.icon
                const isSelected = formData.app === app.id
                return (
                  <label
                    key={app.id}
                    className={`block cursor-pointer group ${isSelected ? 'scale-105' : ''} transition-transform`}
                  >
                    <input
                      type="radio"
                      name="app"
                      value={app.id}
                      checked={isSelected}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${
                      isSelected 
                        ? `${app.color} ${app.borderColor} shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rotate-2` 
                        : 'bg-white dark:bg-slate-700 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1'
                    } transition-all`}>
                      <div className="flex items-center">
                        <div className={`w-14 h-14 ${isSelected ? 'bg-black' : app.color} border-4 border-black flex items-center justify-center mr-4 ${isSelected ? 'rotate-6' : ''} transition-transform`}>
                          <Icon className={`w-7 h-7 ${isSelected ? 'text-white' : 'text-black'}`} strokeWidth={3} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-black uppercase text-black dark:text-white">
                            {app.name}
                          </h4>
                          <p className="text-sm font-bold text-black/70 dark:text-white/70">
                            {app.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Right Side - Login Form (3 columns) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Login Form */}
            <div className="bg-white dark:bg-slate-800 border-8 border-black p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] -rotate-1">
              {/* Header */}
              <div className="flex items-center mb-8">
                <div className={`w-16 h-16 ${selectedApp?.color} border-4 border-black flex items-center justify-center mr-4 rotate-3`}>
                  <SelectedIcon className="h-8 w-8 text-black" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-3xl font-black uppercase text-black dark:text-white">{selectedApp?.name}</h3>
                  <p className="text-base font-bold text-black/70 dark:text-white/70">Masuk untuk melanjutkan</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div className="space-y-3">
                  <label htmlFor="username" className="block text-lg font-black uppercase text-black dark:text-white">
                    Username
                  </label>
                  <div className="flex items-stretch gap-0">
                    <div className={`flex-shrink-0 w-14 border-4 border-black border-r-0 flex items-center justify-center transition-colors ${
                      focusedField === 'username' 
                        ? selectedApp?.color
                        : 'bg-white dark:bg-slate-700'
                    }`}>
                      <UserIcon className="h-6 w-6 text-black dark:text-white" strokeWidth={3} />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      autoComplete="username"
                      className="flex-1 px-4 py-4 bg-white dark:bg-slate-700 border-4 border-black text-black dark:text-white placeholder-black/50 dark:placeholder-white/50 focus:outline-none font-bold text-lg transition-all"
                      placeholder="Masukkan username"
                      value={formData.username}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField(null)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-3">
                  <label htmlFor="password" className="block text-lg font-black uppercase text-black dark:text-white">
                    Password
                  </label>
                  <div className="flex items-stretch gap-0">
                    <div className={`flex-shrink-0 w-14 border-4 border-black border-r-0 flex items-center justify-center transition-colors ${
                      focusedField === 'password' 
                        ? selectedApp?.color
                        : 'bg-white dark:bg-slate-700'
                    }`}>
                      <Lock className="h-6 w-6 text-black dark:text-white" strokeWidth={3} />
                    </div>
                    <div className="relative flex-1">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="current-password"
                        className="w-full px-4 py-4 pr-14 bg-white dark:bg-slate-700 border-4 border-black text-black dark:text-white placeholder-black/50 dark:placeholder-white/50 focus:outline-none font-bold text-lg"
                        placeholder="Masukkan password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-black dark:text-white hover:scale-110 transition-transform"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-6 w-6" strokeWidth={3} />
                        ) : (
                          <Eye className="h-6 w-6" strokeWidth={3} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center px-8 py-5 mt-8 font-black uppercase text-xl text-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${selectedApp?.color}`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-4 border-black border-t-transparent mr-3"></div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Lock className="h-6 w-6 mr-3" strokeWidth={3} />
                      Masuk Sekarang
                    </>
                  )}
                </button>
              </form>

              {/* Additional Info */}
              <div className="mt-8 pt-6 border-t-4 border-black">
                <p className="text-center text-sm font-bold text-black/70 dark:text-white/70">
                  Dengan masuk, Anda menyetujui{' '}
                  <a href="#" className="text-black dark:text-white underline hover:no-underline font-black">
                    Syarat & Ketentuan
                  </a>
                </p>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center px-6 py-3 bg-emerald-400 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-1">
                <Lock className="h-5 w-5 text-black mr-2" strokeWidth={3} />
                <span className="text-sm font-black uppercase text-black">Koneksi Aman</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
