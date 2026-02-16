import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Package, Tags, FileText } from 'lucide-react'
import api from '../services/api'
import DarkModeToggle from '../components/DarkModeToggle'

const HomePage = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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
        setDashboardData({
          stats: {
            material: { total_materials: 0, total_rolls: 0, total_categories: 0 },
            spk: { total_spk: 0, spk_this_month: 0 },
            label: { total_labels: 0, total_label_rolls: 0 },
            lps: { total_lps: 0, finished_lps: 0, lps_this_month: 0 }
          }
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Slow background image transition
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const apps = [
    {
      name: 'Material Management',
      description: 'Kelola stok material dan SPK produksi',
      icon: Package,
      path: '/login?app=material',
      number: '01'
    },
    {
      name: 'Stock Label',
      description: 'Manajemen stok label dan tracking',
      icon: Tags,
      path: '/login?app=stoklabel',
      number: '02'
    },
    {
      name: 'LPS Production',
      description: 'Laporan produksi dan verifikasi',
      icon: FileText,
      path: '/login?app=lps',
      number: '03'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-slate-900 dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm tracking-widest text-slate-600 dark:text-slate-400 uppercase">Loading</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
      {/* Luxury Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-sm flex items-center justify-center transition-transform group-hover:scale-105">
                <img 
                  src="/img/rbm.png" 
                  alt="RBM" 
                  className="w-8 h-8 object-contain invert dark:invert-0"
                />
              </div>
              <div>
                <h1 className="text-xl font-light tracking-wider text-slate-900 dark:text-white">RBM SYSTEM</h1>
                <p className="text-xs tracking-widest text-slate-500 dark:text-slate-400 uppercase">Production Management</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-6">
              <DarkModeToggle />
              <Link
                to="/login"
                className="group relative px-8 py-3 border border-slate-900 dark:border-white text-slate-900 dark:text-white text-sm tracking-widest uppercase overflow-hidden transition-all duration-300 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900"
              >
                <span className="relative flex items-center">
                  Login
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Full Screen */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Images with Slow Fade */}
        <div className="absolute inset-0">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-2000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-white/90 dark:bg-slate-950/90"></div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-8 lg:px-12 text-center">
          <div className="mb-8">
            <p className="text-xs tracking-[0.3em] text-slate-600 dark:text-slate-400 uppercase mb-6">
              Sistem Terintegrasi #1 di Indonesia
            </p>
          </div>
          
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight text-slate-900 dark:text-white mb-8 leading-none">
            SISTEM
            <br />
            MANAJEMEN
            <br />
            <span className="italic font-serif">Produksi</span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Platform terintegrasi untuk mengelola material, stok label,
            <br className="hidden md:block" />
            dan laporan produksi dengan presisi tinggi
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/login"
              className="group px-12 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm tracking-widest uppercase transition-all duration-300 hover:bg-slate-800 dark:hover:bg-slate-100"
            >
              <span className="flex items-center">
                Mulai Sekarang
                <ArrowRight className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            
            <a
              href="#applications"
              className="px-12 py-4 border border-slate-900 dark:border-white text-slate-900 dark:text-white text-sm tracking-widest uppercase transition-all duration-300 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900"
            >
              Lihat Aplikasi
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-px h-16 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
        </div>
      </section>

      {/* Stats Section */}
      {dashboardData && dashboardData.stats && (
        <section className="py-24 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-8 lg:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { label: 'Materials', value: dashboardData.stats?.material?.total_materials || 0 },
                { label: 'SPK', value: dashboardData.stats?.spk?.total_spk || 0 },
                { label: 'Labels', value: dashboardData.stats?.label?.total_labels || 0 },
                { label: 'LPS', value: dashboardData.stats?.lps?.total_lps || 0 }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <p className="text-5xl md:text-6xl font-light text-slate-900 dark:text-white mb-3 transition-transform group-hover:scale-105">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-xs tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Applications Section */}
      <section id="applications" className="py-32 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="mb-20 text-center">
            <p className="text-xs tracking-[0.3em] text-slate-600 dark:text-slate-400 uppercase mb-4">
              Tiga Aplikasi Terintegrasi
            </p>
            <h3 className="text-4xl md:text-5xl font-light text-slate-900 dark:text-white">
              Solusi Lengkap
            </h3>
          </div>
          
          <div className="space-y-px">
            {apps.map((app, index) => {
              const Icon = app.icon
              return (
                <Link
                  key={index}
                  to={app.path}
                  className="group block border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all duration-500"
                >
                  <div className="py-12 px-8 flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                      <span className="text-6xl font-light text-slate-300 dark:text-slate-700 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {app.number}
                      </span>
                      <div>
                        <h4 className="text-2xl md:text-3xl font-light text-slate-900 dark:text-white mb-2 group-hover:translate-x-2 transition-transform">
                          {app.name}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 tracking-wide">
                          {app.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <Icon className="w-8 h-8 text-slate-400 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" strokeWidth={1} />
                      <ArrowRight className="w-6 h-6 text-slate-400 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-2 transition-all" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-8 lg:px-12 text-center">
          <h3 className="text-4xl md:text-6xl font-light text-slate-900 dark:text-white mb-8 leading-tight">
            Tingkatkan Efisiensi
            <br />
            <span className="italic font-serif">Produksi Anda</span>
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 font-light">
            Bergabunglah dengan sistem manajemen produksi modern
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-12 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm tracking-widest uppercase transition-all duration-300 hover:bg-slate-800 dark:hover:bg-slate-100"
          >
            Mulai Sekarang
            <ArrowRight className="w-4 h-4 ml-3" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <p className="text-xs tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                RBM System
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">
                © 2025 All Rights Reserved
              </p>
            </div>
            <div className="flex items-center space-x-8 text-xs tracking-widest text-slate-500 dark:text-slate-400 uppercase">
              <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
