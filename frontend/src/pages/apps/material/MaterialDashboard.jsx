import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Package, 
  FileText, 
  Tags, 
  TrendingUp, 
  Plus,
  BarChart3,
  Archive,
  AlertTriangle
} from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import api from '../../../services/api'

const MaterialDashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          api.get('/material/dashboard/stats'),
          api.get('/material/dashboard/activities')
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
      title: 'Total Materials',
      value: stats?.totalMaterials || 0,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Total Rolls',
      value: stats?.totalRolls || 0,
      icon: Archive,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Active SPK',
      value: stats?.activeSPK || 0,
      icon: FileText,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'increase'
    },
    {
      title: 'Low Stock Items',
      value: stats?.lowStockItems || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: '-5%',
      changeType: 'decrease'
    }
  ]

  const quickActions = [
    {
      title: 'Add Material Stock',
      description: 'Tambah stok material baru',
      icon: Plus,
      color: 'bg-blue-500',
      href: '/apps/material/stock?action=add'
    },
    {
      title: 'Create SPK',
      description: 'Buat SPK produksi baru',
      icon: FileText,
      color: 'bg-green-500',
      href: '/apps/material/spk?action=create'
    },
    {
      title: 'Manage Labels',
      description: 'Kelola daftar label',
      icon: Tags,
      color: 'bg-purple-500',
      href: '/apps/material/labels'
    },
    {
      title: 'View Reports',
      description: 'Lihat laporan material',
      icon: BarChart3,
      color: 'bg-orange-500',
      href: '/apps/material/reports'
    }
  ]

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Material Dashboard</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">Kelola stok material dan SPK produksi</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/apps/material/stock?action=add">
            <Button app="material" variant="primary" className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Material
            </Button>
          </Link>
          <Link to="/apps/material/spk?action=create">
            <Button app="material" variant="secondary" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Buat SPK
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
              <div className="absolute inset-0 bg-gradient-to-br from-material-500/5 to-material-600/5 dark:from-material-400/10 dark:to-material-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
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
          <div className="w-10 h-10 rounded-xl bg-material-100 dark:bg-material-900/30 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-material-600 dark:text-material-400" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link
                key={index}
                to={action.href}
                className="relative p-5 rounded-xl border-2 border-gray-200 dark:border-slate-700 hover:border-material-400 dark:hover:border-material-500 hover:shadow-xl transition-all group bg-white dark:bg-slate-800 overflow-hidden"
              >
                {/* Hover Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-material-500/5 to-material-600/5 dark:from-material-400/10 dark:to-material-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-material-600 dark:group-hover:text-material-400 transition-colors">{action.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{action.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </Card>

      {/* Recent Activities & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-800/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-material-100 dark:bg-material-900/30 flex items-center justify-center mr-3">
                <FileText className="h-5 w-5 text-material-600 dark:text-material-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Aktivitas Terbaru</h2>
            </div>
            <Link to="/apps/material/spk" className="text-sm text-material-600 dark:text-material-400 hover:text-material-700 dark:hover:text-material-300 font-medium hover:underline">
              Lihat semua →
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="group flex items-center space-x-3 p-4 rounded-xl bg-white dark:bg-slate-800/50 hover:bg-material-50 dark:hover:bg-slate-700/50 transition-all duration-300 border border-gray-100 dark:border-slate-700 hover:border-material-300 dark:hover:border-material-600 hover:shadow-md cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-material-100 dark:bg-material-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <FileText className="h-5 w-5 text-material-600 dark:text-material-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-material-600 dark:group-hover:text-material-400 transition-colors">{activity.title}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{activity.description}</p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-slate-500 flex-shrink-0">{activity.time}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-10 w-10 text-gray-300 dark:text-slate-600" />
                </div>
                <p className="text-gray-500 dark:text-slate-400 font-medium">Tidak ada aktivitas terbaru</p>
                <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Aktivitas akan muncul di sini</p>
              </div>
            )}
          </div>
        </Card>

        {/* Material Categories Chart */}
        <Card className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-800/50">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-xl bg-material-100 dark:bg-material-900/30 flex items-center justify-center mr-3">
              <BarChart3 className="h-5 w-5 text-material-600 dark:text-material-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Material per Kategori</h2>
          </div>
          <div className="space-y-4">
            {stats?.categoryStats?.map((category, index) => {
              const percentage = (category.count / stats.totalMaterials) * 100
              const colors = [
                'bg-blue-500 dark:bg-blue-400',
                'bg-green-500 dark:bg-green-400',
                'bg-purple-500 dark:bg-purple-400',
                'bg-orange-500 dark:bg-orange-400',
                'bg-pink-500 dark:bg-pink-400'
              ]
              return (
                <div key={index} className="space-y-2 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]} mr-2`}></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-slate-300 group-hover:text-material-600 dark:group-hover:text-material-400 transition-colors">{category.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-bold text-gray-900 dark:text-white mr-2">{category.count}</span>
                      <span className="text-xs text-gray-500 dark:text-slate-400">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`${colors[index % colors.length]} h-3 rounded-full transition-all duration-700 ease-out group-hover:opacity-90`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            }) || (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-10 w-10 text-gray-300 dark:text-slate-600" />
                </div>
                <p className="text-gray-500 dark:text-slate-400 font-medium">Tidak ada data tersedia</p>
                <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Data kategori akan muncul di sini</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default MaterialDashboard