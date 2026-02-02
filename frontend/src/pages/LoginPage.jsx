import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Package, Tags, FileText, Eye, EyeOff, Sparkles, ArrowLeft, CheckCircle2, Lock, User as UserIcon, Shield } from 'lucide-react'
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
  const [currentBgImage, setCurrentBgImage] = useState(0)

  // Background images carousel
  const backgroundImages = [
    '/img/1.jpeg',
    '/img/2.jpeg',
    '/img/3.jpeg',
    '/img/4.jpeg',
    '/img/5.jpeg',
    '/img/6.jpeg',
    '/img/7.jpeg',
    '/img/8.jpeg'
  ]

  useEffect(() => {
    // If user is already logged in, redirect to their app
    if (user) {
      navigate(`/apps/${user.app}`)
    }
  }, [user, navigate])

  // Auto-rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgImage((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const apps = [
    {
      id: 'material',
      name: 'Material Management',
      description: 'Kelola stok material dan SPK',
      icon: Package,
      gradient: 'from-indigo-500 via-indigo-600 to-blue-600',
      bgHover: 'hover:bg-indigo-500/10',
      borderColor: 'border-indigo-500',
      textColor: 'text-indigo-400',
      ringColor: 'ring-indigo-500'
    },
    {
      id: 'stoklabel',
      name: 'Stock Label',
      description: 'Manajemen stok label',
      icon: Tags,
      gradient: 'from-emerald-500 via-green-600 to-teal-600',
      bgHover: 'hover:bg-emerald-500/10',
      borderColor: 'border-emerald-500',
      textColor: 'text-emerald-400',
      ringColor: 'ring-emerald-500'
    },
    {
      id: 'lps',
      name: 'LPS Production',
      description: 'Laporan produksi selesai',
      icon: FileText,
      gradient: 'from-violet-500 via-purple-600 to-fuchsia-600',
      bgHover: 'hover:bg-violet-500/10',
      borderColor: 'border-violet-500',
      textColor: 'text-violet-400',
      ringColor: 'ring-violet-500'
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Image Carousel with darker overlay */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentBgImage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Background ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Darker gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-900/95"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-5xl w-full animate-fade-in-up">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center text-slate-300 hover:text-white font-medium transition-colors group mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </Link>

        {/* Main Container - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Branding & App Selection */}
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center lg:text-left">
              <Link to="/" className="inline-block group">
                <div className="flex items-center justify-center lg:justify-start mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/20">
                      <img 
                        src="/img/rbm.png" 
                        alt="RBM Logo" 
                        className="h-12 w-12 object-contain"
                      />
                    </div>
                  </div>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  RBM System
                </h1>
              </Link>
              <p className="text-slate-300 text-lg">Sistem Manajemen Produksi Terintegrasi</p>
              <p className="text-slate-400 text-sm mt-2">Pilih aplikasi dan masuk untuk melanjutkan</p>
            </div>

            {/* App Selection */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6">
              <div className="flex items-center mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mr-3">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Pilih Aplikasi</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {apps.map((app) => {
                  const Icon = app.icon
                  const isSelected = formData.app === app.id
                  return (
                    <label
                      key={app.id}
                      className={`group relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? `${app.borderColor} bg-slate-700/50 shadow-lg ${app.ringColor} ring-2 ring-opacity-30`
                          : 'border-white/10 hover:border-white/20 bg-slate-800/30 hover:bg-slate-700/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="app"
                        value={app.id}
                        checked={isSelected}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${app.gradient} flex items-center justify-center mr-3 transform transition-transform ${
                        isSelected ? 'scale-110 rotate-3' : 'group-hover:scale-105'
                      }`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-sm font-bold ${isSelected ? app.textColor : 'text-white'}`}>
                          {app.name}
                        </h4>
                        <p className="text-xs text-slate-400">{app.description}</p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle2 className={`h-5 w-5 ${app.textColor}`} />
                        </div>
                      )}
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Features List */}
            <div className="hidden lg:block bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-400" />
                Keamanan & Fitur
              </h4>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Koneksi terenkripsi SSL/TLS</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Autentikasi multi-level</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Data backup otomatis</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Akses 24/7 dari mana saja</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="space-y-6">{/* Login Form */}

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8">
              <div className="flex items-center mb-8">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedApp?.gradient} flex items-center justify-center mr-4 shadow-lg`}>
                  <SelectedIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedApp?.name}</h3>
                  <p className="text-sm text-slate-400">Silakan masuk untuk melanjutkan</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div className="relative">
                  <label htmlFor="username" className="block text-sm font-semibold text-slate-300 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${
                      focusedField === 'username' ? selectedApp?.textColor : 'text-slate-500'
                    }`}>
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      autoComplete="username"
                      className={`block w-full pl-14 pr-4 py-3.5 bg-slate-900/50 border-2 rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all duration-300 ${
                        focusedField === 'username'
                          ? `${selectedApp?.borderColor} ring-4 ${selectedApp?.ringColor} ring-opacity-20`
                          : 'border-white/10 hover:border-white/20'
                      }`}
                      placeholder="Masukkan username Anda"
                      value={formData.username}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField(null)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${
                      focusedField === 'password' ? selectedApp?.textColor : 'text-slate-500'
                    }`}>
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      className={`block w-full pl-14 pr-12 py-3.5 bg-slate-900/50 border-2 rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all duration-300 ${
                        focusedField === 'password'
                          ? `${selectedApp?.borderColor} ring-4 ${selectedApp?.ringColor} ring-opacity-20`
                          : 'border-white/10 hover:border-white/20'
                      }`}
                      placeholder="Masukkan password Anda"
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`group relative w-full flex items-center justify-center px-6 py-4 overflow-hidden font-bold text-white text-lg transition-all duration-300 ease-out rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r ${selectedApp?.gradient}`}
                >
                  <span className="relative flex items-center">
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Memproses...
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5 mr-2" />
                        Masuk
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-center text-sm text-slate-400">
                  Dengan masuk, Anda menyetujui{' '}
                  <a href="#" className="text-slate-300 hover:text-white underline">
                    Syarat & Ketentuan
                  </a>
                </p>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center px-4 py-2 bg-slate-800/50 backdrop-blur-xl rounded-full shadow-lg border border-white/10">
                <Shield className="h-4 w-4 text-green-400 mr-2" />
                <span className="text-xs font-medium text-slate-300">Koneksi Aman & Terenkripsi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
