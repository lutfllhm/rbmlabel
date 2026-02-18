import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Package, Tags, FileText, Zap, TrendingUp, Shield } from 'lucide-react'
import api from '../services/api'
import DarkModeToggle from '../components/DarkModeToggle'

const HomePage = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

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

  const apps = [
    {
      name: 'Material Management',
      description: 'Kelola stok material dan SPK produksi',
      icon: Package,
      path: '/login?app=material',
      color: 'bg-blue-400',
      borderColor: 'border-blue-600'
    },
    {
      name: 'Stock Label',
      description: 'Manajemen stok label dan tracking',
      icon: Tags,
      path: '/login?app=stoklabel',
      color: 'bg-emerald-400',
      borderColor: 'border-emerald-600'
    },
    {
      name: 'LPS Production',
      description: 'Laporan produksi dan verifikasi',
      icon: FileText,
      path: '/login?app=lps',
      color: 'bg-orange-400',
      borderColor: 'border-orange-600'
    }
  ]

  const features = [
    { icon: Zap, text: 'Real-time Updates', color: 'bg-yellow-400' },
    { icon: TrendingUp, text: 'Analytics Dashboard', color: 'bg-pink-400' },
    { icon: Shield, text: 'Secure & Reliable', color: 'bg-purple-400' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-300">
        <div className="text-center">
          <div className="w-20 h-20 border-8 border-black border-t-transparent animate-spin mx-auto mb-6"></div>
          <p className="text-2xl font-black uppercase">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-yellow-300 dark:bg-slate-900">
      {/* Neo-Brutal Header */}
      <header className="border-b-8 border-black bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="w-16 h-16 bg-black dark:bg-yellow-300 border-4 border-black rotate-3 group-hover:rotate-6 transition-transform flex items-center justify-center">
                <img 
                  src="/img/rbm.png" 
                  alt="RBM" 
                  className="w-10 h-10 object-contain invert dark:invert-0"
                />
              </div>
              <div>
                <h1 className="text-3xl font-black uppercase text-black dark:text-white">RBM</h1>
                <p className="text-sm font-bold uppercase text-black/70 dark:text-white/70">System</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <DarkModeToggle />
              <Link
                to="/login"
                className="px-8 py-4 bg-black dark:bg-yellow-300 text-white dark:text-black font-black uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                Login →
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Asymmetric */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text */}
            <div className="space-y-8">
              <div className="inline-block px-6 py-2 bg-pink-400 border-4 border-black rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-sm font-black uppercase">#1 di Indonesia</p>
              </div>
              
              <h2 className="text-6xl lg:text-8xl font-black uppercase leading-none text-black dark:text-white">
                SISTEM
                <br />
                <span className="text-blue-400">PRODUKSI</span>
                <br />
                LABEL
              </h2>
              
              <p className="text-xl font-bold text-black/80 dark:text-white/80 max-w-lg">
                Platform terintegrasi untuk mengelola material, stok label, dan laporan produksi
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="px-10 py-5 bg-emerald-400 text-black font-black uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  Mulai Sekarang
                </Link>
                
                <a
                  href="#applications"
                  className="px-10 py-5 bg-white dark:bg-slate-700 text-black dark:text-white font-black uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  Lihat Demo
                </a>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-3 pt-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 px-4 py-2 ${feature.color} border-4 border-black -rotate-1 hover:rotate-0 transition-transform`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-bold text-sm">{feature.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Side - Stats Cards Asymmetric */}
            <div className="relative h-[600px]">
              {dashboardData && dashboardData.stats && (
                <>
                  {/* Card 1 - Top Left */}
                  <div className="absolute top-0 left-0 w-48 p-6 bg-blue-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-3 hover:rotate-6 transition-transform">
                    <Package className="w-8 h-8 mb-3" />
                    <p className="text-4xl font-black">{dashboardData.stats?.material?.total_materials || 0}</p>
                    <p className="text-sm font-bold uppercase mt-1">Materials</p>
                  </div>

                  {/* Card 2 - Top Right */}
                  <div className="absolute top-12 right-0 w-48 p-6 bg-emerald-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-2 hover:rotate-0 transition-transform">
                    <Tags className="w-8 h-8 mb-3" />
                    <p className="text-4xl font-black">{dashboardData.stats?.label?.total_labels || 0}</p>
                    <p className="text-sm font-bold uppercase mt-1">Labels</p>
                  </div>

                  {/* Card 3 - Middle Left */}
                  <div className="absolute top-48 left-12 w-48 p-6 bg-orange-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-3 hover:rotate-0 transition-transform">
                    <FileText className="w-8 h-8 mb-3" />
                    <p className="text-4xl font-black">{dashboardData.stats?.lps?.total_lps || 0}</p>
                    <p className="text-sm font-bold uppercase mt-1">LPS</p>
                  </div>

                  {/* Card 4 - Bottom Right */}
                  <div className="absolute bottom-0 right-12 w-48 p-6 bg-pink-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-2 hover:rotate-6 transition-transform">
                    <TrendingUp className="w-8 h-8 mb-3" />
                    <p className="text-4xl font-black">{dashboardData.stats?.spk?.total_spk || 0}</p>
                    <p className="text-sm font-bold uppercase mt-1">SPK</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section - Neo-Brutal Cards */}
      <section id="applications" className="py-20 bg-white dark:bg-slate-800 border-y-8 border-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <h3 className="text-5xl lg:text-7xl font-black uppercase text-black dark:text-white mb-4">
              APLIKASI
            </h3>
            <p className="text-xl font-bold text-black/70 dark:text-white/70">
              Tiga solusi terintegrasi untuk bisnis Anda
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apps.map((app, index) => {
              const Icon = app.icon
              return (
                <Link
                  key={index}
                  to={app.path}
                  className={`group relative p-8 ${app.color} border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1.5 hover:translate-y-1.5 transition-all`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <Icon className="w-12 h-12" strokeWidth={3} />
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                  </div>
                  
                  <h4 className="text-2xl font-black uppercase mb-3">
                    {app.name}
                  </h4>
                  <p className="text-base font-bold text-black/80">
                    {app.description}
                  </p>
                  
                  {/* Decorative element */}
                  <div className={`absolute -bottom-2 -right-2 w-16 h-16 ${app.borderColor} border-4 border-black -z-10`}></div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-purple-400 dark:bg-purple-600 border-b-8 border-black">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-block px-8 py-3 bg-yellow-300 border-4 border-black rotate-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-12">
            <p className="text-lg font-black uppercase">Siap Memulai?</p>
          </div>
          
          <h3 className="text-5xl lg:text-7xl font-black uppercase text-black dark:text-white mb-8 leading-tight">
            TINGKATKAN
            <br />
            PRODUKTIVITAS
            <br />
            ANDA SEKARANG!
          </h3>
          
          <Link
            to="/login"
            className="inline-block px-12 py-6 bg-black dark:bg-yellow-300 text-white dark:text-black font-black text-xl uppercase border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1.5 hover:translate-y-1.5 transition-all"
          >
            Mulai Gratis →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-2xl font-black uppercase mb-4">RBM System</h4>
              <p className="font-bold text-white/70">
                Platform manajemen produksi modern untuk bisnis Indonesia
              </p>
            </div>
            
            <div>
              <h5 className="text-lg font-black uppercase mb-4">Aplikasi</h5>
              <ul className="space-y-2 font-bold">
                <li><a href="#" className="hover:text-yellow-300 transition-colors">Material Management</a></li>
                <li><a href="#" className="hover:text-yellow-300 transition-colors">Stock Label</a></li>
                <li><a href="#" className="hover:text-yellow-300 transition-colors">LPS Production</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-black uppercase mb-4">Kontak</h5>
              <ul className="space-y-2 font-bold text-white/70">
                <li>Email: info@rbm.com</li>
                <li>Phone: +62 xxx xxxx</li>
                <li>Pusat Pergudangan Romokalisari D-39 Romokalisari Benowo, Surabaya, Indonesia</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t-4 border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="font-bold text-white/70 mb-4 md:mb-0">
              © 2025 RBM System. All rights reserved.
            </p>
            <div className="flex space-x-6 font-bold">
              <a href="#" className="hover:text-yellow-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-yellow-300 transition-colors">Terms</a>
              <a href="#" className="hover:text-yellow-300 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
