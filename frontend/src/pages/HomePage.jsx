import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Package, 
  Tags, 
  FileText, 
  TrendingUp, 
  Users, 
  Activity,
  ArrowRight,
  BarChart3,
  Clock,
  Sparkles,
  Zap,
  Shield,
  CheckCircle2,
  Star,
  Award,
  Target
} from 'lucide-react'
import api from '../services/api'
import DarkModeToggle from '../components/DarkModeToggle'

const HomePage = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeFeature, setActiveFeature] = useState(0)
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
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/public/dashboard')
        setDashboardData(response.data)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        // Set default empty data to prevent crashes
        setDashboardData({
          stats: {
            material: { total_materials: 0, total_rolls: 0, total_categories: 0 },
            spk: { total_spk: 0, spk_this_month: 0 },
            label: { total_labels: 0, total_label_rolls: 0 },
            lps: { total_lps: 0, finished_lps: 0, lps_this_month: 0 }
          },
          recent: {
            spk: [],
            lps: []
          }
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Auto-rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgImage((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const apps = [
    {
      name: 'Material Management',
      description: 'Kelola stok material, kategori, dan SPK produksi dengan sistem terintegrasi',
      icon: Package,
      gradient: 'from-indigo-500 via-indigo-600 to-blue-600',
      path: '/login?app=material',
      stats: dashboardData?.stats?.material || {},
      features: ['Real-time Stock Monitoring', 'Automated SPK Generation', 'Smart Analytics & Reports']
    },
    {
      name: 'Stock Label',
      description: 'Manajemen stok label, tracking label masuk dan keluar secara real-time',
      icon: Tags,
      gradient: 'from-emerald-500 via-green-600 to-teal-600',
      path: '/login?app=stoklabel',
      stats: dashboardData?.stats?.label || {},
      features: ['Label Tracking System', 'Digital Surat Jalan', 'Inventory Control']
    },
    {
      name: 'LPS Production',
      description: 'Laporan produksi selesai dan verifikasi kualitas produk secara digital',
      icon: FileText,
      gradient: 'from-violet-500 via-purple-600 to-fuchsia-600',
      path: '/login?app=lps',
      stats: dashboardData?.stats?.lps || {},
      features: ['Production Logging', 'Quality Verification', 'Performance Analytics']
    }
  ]

  const features = [
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Data terupdate secara otomatis tanpa perlu refresh halaman'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Keamanan data terjamin dengan enkripsi tingkat enterprise'
    },
    {
      icon: Activity,
      title: 'Advanced Analytics',
      description: 'Laporan dan analisis mendalam untuk pengambilan keputusan'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-slate-200 dark:border-slate-700 border-t-blue-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-blue-500 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium animate-pulse transition-colors duration-300">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden transition-colors duration-300">
      {/* Header - Fixed with glassmorphism */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-white dark:bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-slate-200 dark:border-white/20 transition-colors duration-300">
                  <img 
                    src="/img/rbm.png" 
                    alt="RBM Logo" 
                    className="h-8 w-8 object-contain"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-300">RBM System</h1>
                <p className="text-xs text-slate-600 dark:text-slate-400 transition-colors duration-300">Production Management</p>
              </div>
            </Link>
            <div className="flex items-center space-x-3">
              <DarkModeToggle />
              <Link
                to="/login"
                className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50"
              >
                <span className="relative flex items-center">
                  Masuk
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Background Carousel */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        {/* Background Image Carousel with overlay */}
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
              {/* Adaptive overlay - lighter in light mode, darker in dark mode */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/95 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-slate-900/95 transition-colors duration-300"></div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-full mb-4 border border-slate-200 dark:border-white/20 transition-colors duration-300">
              <Star className="h-4 w-4 text-yellow-500 dark:text-yellow-400 mr-2" />
              <span className="text-sm font-medium text-slate-900 dark:text-white transition-colors duration-300">Sistem Terintegrasi #1 di Indonesia</span>
            </div>
            
            {/* Main Heading */}
            <h2 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight transition-colors duration-300">
              Sistem Manajemen
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Produksi Modern
              </span>
            </h2>
            
            {/* Subtitle */}
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
              Platform all-in-one untuk mengelola material, stok label, dan laporan produksi
              <br className="hidden md:block" />
              dengan teknologi terkini dan interface yang intuitif
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/login"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-bold text-white overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105"
              >
                <span className="relative flex items-center text-lg">
                  Mulai Sekarang
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <a
                href="#apps"
                className="px-8 py-4 bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-xl font-bold text-slate-900 dark:text-white border-2 border-slate-300 dark:border-white/20 hover:bg-white dark:hover:bg-white/20 transition-all duration-300"
              >
                Lihat Fitur
              </a>
            </div>
            
            {/* Stats Overview */}
            {dashboardData && dashboardData.stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                {[
                  { label: 'Total Materials', value: dashboardData.stats?.material?.total_materials || 0, icon: Package },
                  { label: 'Total SPK', value: dashboardData.stats?.spk?.total_spk || 0, icon: FileText },
                  { label: 'Label Stock', value: dashboardData.stats?.label?.total_labels || 0, icon: Tags },
                  { label: 'Total LPS', value: dashboardData.stats?.lps?.total_lps || 0, icon: BarChart3 }
                ].map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div
                      key={index}
                      className="group bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-500/20 dark:to-purple-500/20 flex items-center justify-center mb-3 border border-slate-200 dark:border-white/10 transition-colors duration-300">
                          <Icon className="h-7 w-7 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-300">
                          {stat.value.toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">{stat.label}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section id="apps" className="relative py-20 bg-slate-100 dark:bg-slate-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-500/10 backdrop-blur-md rounded-full mb-4 border border-blue-200 dark:border-blue-500/20 transition-colors duration-300">
              <Award className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 transition-colors duration-300" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 transition-colors duration-300">3 Aplikasi Powerful</span>
            </div>
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-300">
              Aplikasi Terintegrasi
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto transition-colors duration-300">
              Tiga aplikasi yang saling terhubung untuk mengelola seluruh proses produksi
            </p>
          </div>
          
          {/* Apps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {apps.map((app, index) => {
              const Icon = app.icon
              return (
                <div
                  key={index}
                  className="group relative"
                >
                  <div className="relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-500 overflow-hidden">
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${app.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                    
                    <div className="relative p-8">
                      {/* Icon */}
                      <div className="relative mb-6">
                        <div className={`absolute inset-0 bg-gradient-to-br ${app.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
                        <div className={`relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${app.gradient} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                          <Icon className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 transition-colors duration-300">
                        {app.name}
                      </h4>
                      
                      <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed transition-colors duration-300">
                        {app.description}
                      </p>
                      
                      {/* Features */}
                      <div className="space-y-2 mb-6">
                        {app.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start text-sm text-slate-700 dark:text-slate-300 transition-colors duration-300">
                            <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5 transition-colors duration-300" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* CTA Button */}
                      <Link
                        to={app.path}
                        className={`group/btn relative inline-flex items-center justify-center w-full px-6 py-3 text-white font-semibold rounded-xl bg-gradient-to-r ${app.gradient} hover:shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300`}
                      >
                        <span className="flex items-center">
                          Akses Aplikasi
                          <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-300">
              Kenapa Memilih RBM System?
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto transition-colors duration-300">
              Platform modern dengan fitur-fitur canggih untuk meningkatkan produktivitas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              const isActive = activeFeature === index
              return (
                <div
                  key={index}
                  className={`group relative bg-slate-50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-500 cursor-pointer ${
                    isActive ? 'ring-2 ring-blue-500 scale-105' : ''
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    isActive ? 'opacity-100' : ''
                  }`}></div>
                  
                  <div className="relative">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 mb-6 transform transition-all duration-500 ${
                      isActive ? 'scale-110 rotate-6' : 'group-hover:scale-110 group-hover:rotate-6'
                    }`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3 transition-colors duration-300">
                      {feature.title}
                    </h4>
                    
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Target className="h-16 w-16 text-white/80 mx-auto mb-6" />
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Siap Meningkatkan Produktivitas?
          </h3>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Bergabunglah dengan sistem manajemen produksi modern yang telah dipercaya
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-600 bg-white rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
          >
            Mulai Sekarang
            <ArrowRight className="ml-2 h-6 w-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-300">RBM System</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto transition-colors duration-300">
              Sistem Manajemen Produksi Modern untuk Efisiensi Maksimal
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-500 dark:text-slate-500 transition-colors duration-300">
              <span>© 2025 RBM System</span>
              <span>•</span>
              <span>All Rights Reserved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
