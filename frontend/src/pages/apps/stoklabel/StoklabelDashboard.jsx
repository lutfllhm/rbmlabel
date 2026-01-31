import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Tags, 
  Plus, 
  Truck, 
  TrendingUp, 
  AlertTriangle,
  BarChart3,
  ClipboardList,
  Activity
} from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import api from '../../../services/api'

const StoklabelDashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          api.get('/stoklabel/dashboard/stats'),
          api.get('/stoklabel/dashboard/activities')
        ])
        
        setStats(statsRes.data)
        setRecentActivities(activitiesRes.data)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-64 bg-gray-200 dark:bg-slate-700 rounded"></div>
            <div className="h-4 w-48 bg-gray-200 dark:bg-slate-700 rounded mt-2"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-gray-200 dark:bg-slate-700 rounded"></div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
        
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
          ))}
        </div>
        
        {/* Quick Actions Skeleton */}
        <div className="h-48 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
        
        {/* Bottom Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
          <div className="h-96 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Labels',
      value: stats?.totalLabels || 0,
      icon: Tags,
      color: 'bg-green-500',
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Total Rolls',
      value: stats?.totalRolls || 0,
      icon: Activity,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Label Masuk',
      value: stats?.masukThisMonth || 0,
      icon: Plus,
      color: 'bg-purple-500',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Low Stock Items',
      value: stats?.lowStockItems || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: '-2%',
      changeType: 'decrease'
    }
  ]

  const quickActions = [
    {
      title: 'Add Stock Label',
      description: 'Tambah stok label baru',
      icon: Plus,
      color: 'bg-green-500',
      href: '/apps/stoklabel/stock?action=add'
    },
    {
      title: 'Label Keluar',
      description: 'Catat label keluar',
      icon: Truck,
      color: 'bg-blue-500',
      href: '/apps/stoklabel/keluar?action=create'
    },
    {
      title: 'Surat Jalan',
      description: 'Buat surat jalan',
      icon: ClipboardList,
      color: 'bg-purple-500',
      href: '/apps/stoklabel/surat-jalan?action=create'
    },
    {
      title: 'View Reports',
      description: 'Lihat laporan stok',
      icon: BarChart3,
      color: 'bg-orange-500',
      href: '/apps/stoklabel/reports'
    }
  ]

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stock Label Dashboard</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">Kelola stok label dan distribusi</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/apps/stoklabel/stock?action=add">
            <Button app="stoklabel" variant="primary" className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Stok
            </Button>
          </Link>
          <Link to="/apps/stoklabel/keluar?action=create">
            <Button app="stoklabel" variant="secondary" className="flex items-center">
              <Truck className="h-4 w-4 mr-2" />
              Label Keluar
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          const isIncrease = stat.changeType === 'increase'
          return (
            <Card key={index} hover className="p-6 relative overflow-hidden group">
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-stoklabel-500/5 to-stoklabel-600/5 dark:from-stoklabel-400/10 dark:to-stoklabel-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 group-hover:scale-105 transition-transform duration-300">{stat.value.toLocaleString()}</p>
                  <div className="flex items-center mt-3">
                    <div className={`flex items-center px-2 py-1 rounded-lg ${
                      isIncrease 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      <TrendingUp className={`h-3 w-3 mr-1 ${!isIncrease && 'rotate-180'}`} />
                      <span className="text-xs font-semibold">{stat.change}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-slate-500 ml-2">vs bulan lalu</span>
                  </div>
                </div>
                <div className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-800/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Aksi Cepat</h2>
          <div className="w-10 h-10 rounded-xl bg-stoklabel-100 dark:bg-stoklabel-900/30 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-stoklabel-600 dark:text-stoklabel-400" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link
                key={index}
                to={action.href}
                className="relative p-5 rounded-xl border-2 border-gray-200 dark:border-slate-700 hover:border-stoklabel-400 dark:hover:border-stoklabel-500 hover:shadow-xl transition-all group bg-white dark:bg-slate-800 overflow-hidden"
              >
                {/* Hover Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-stoklabel-500/5 to-stoklabel-600/5 dark:from-stoklabel-400/10 dark:to-stoklabel-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-stoklabel-600 dark:group-hover:text-stoklabel-400 transition-colors">{action.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{action.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </Card>

      {/* Recent Activities & Stock Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-800/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-stoklabel-100 dark:bg-stoklabel-900/30 flex items-center justify-center mr-3">
                <Activity className="h-5 w-5 text-stoklabel-600 dark:text-stoklabel-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Aktivitas Terbaru</h2>
            </div>
            <Link to="/apps/stoklabel/masuk" className="text-sm text-stoklabel-600 dark:text-stoklabel-400 hover:text-stoklabel-700 dark:hover:text-stoklabel-300 font-medium hover:underline">
              Lihat semua →
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="group flex items-center space-x-3 p-4 rounded-xl bg-white dark:bg-slate-800/50 hover:bg-stoklabel-50 dark:hover:bg-slate-700/50 transition-all duration-300 border border-gray-100 dark:border-slate-700 hover:border-stoklabel-300 dark:hover:border-stoklabel-600 hover:shadow-md cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-stoklabel-100 dark:bg-stoklabel-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Plus className="h-5 w-5 text-stoklabel-600 dark:text-stoklabel-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-stoklabel-600 dark:group-hover:text-stoklabel-400 transition-colors">{activity.title}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{activity.description}</p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-slate-500 flex-shrink-0">{activity.time}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-10 w-10 text-gray-300 dark:text-slate-600" />
                </div>
                <p className="text-gray-500 dark:text-slate-400 font-medium">Tidak ada aktivitas terbaru</p>
                <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Aktivitas akan muncul di sini</p>
              </div>
            )}
          </div>
        </Card>

        {/* Stock Status */}
        <Card className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-800/50">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-xl bg-stoklabel-100 dark:bg-stoklabel-900/30 flex items-center justify-center mr-3">
              <BarChart3 className="h-5 w-5 text-stoklabel-600 dark:text-stoklabel-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Status Stok</h2>
          </div>
          <div className="space-y-4">
            <div className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10 border border-green-200 dark:border-green-800 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-300 block">Stok Tinggi</span>
                  <span className="text-xs text-gray-500 dark:text-slate-400">Stok aman</span>
                </div>
              </div>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                {stats?.totalLabels ? Math.floor(stats.totalLabels * 0.6) : 0}
              </span>
            </div>
            
            <div className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-900/10 border border-yellow-200 dark:border-yellow-800 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-300 block">Stok Sedang</span>
                  <span className="text-xs text-gray-500 dark:text-slate-400">Perlu perhatian</span>
                </div>
              </div>
              <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {stats?.totalLabels ? Math.floor(stats.totalLabels * 0.3) : 0}
              </span>
            </div>
            
            <div className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-900/10 border border-red-200 dark:border-red-800 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-300 block">Stok Rendah</span>
                  <span className="text-xs text-gray-500 dark:text-slate-400">Segera restock</span>
                </div>
              </div>
              <span className="text-lg font-bold text-red-600 dark:text-red-400">
                {stats?.lowStockItems || 0}
              </span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
            <Link 
              to="/apps/stoklabel/stock" 
              className="flex items-center justify-center px-4 py-2 bg-stoklabel-600 dark:bg-stoklabel-500 hover:bg-stoklabel-700 dark:hover:bg-stoklabel-400 text-white rounded-lg font-medium transition-colors"
            >
              Lihat Detail Stok
              <BarChart3 className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default StoklabelDashboard