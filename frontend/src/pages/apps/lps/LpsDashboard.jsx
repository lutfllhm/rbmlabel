import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FileText, 
  Plus, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  BarChart3,
  Activity
} from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import api from '../../../services/api'

const LpsDashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          api.get('/lps/dashboard/stats'),
          api.get('/lps/dashboard/activities')
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
          <div className="h-10 w-32 bg-gray-200 dark:bg-slate-700 rounded"></div>
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
      title: 'Total LPS',
      value: stats?.totalLps || 0,
      icon: FileText,
      color: 'bg-blue-500',
      change: '+15%',
      changeType: 'increase'
    },
    {
      title: 'LPS Selesai',
      value: stats?.finishedLps || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+20%',
      changeType: 'increase'
    },
    {
      title: 'LPS Pending',
      value: stats?.pendingLps || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '-5%',
      changeType: 'decrease'
    },
    {
      title: 'LPS Bulan Ini',
      value: stats?.lpsThisMonth || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+10%',
      changeType: 'increase'
    }
  ]

  const quickActions = [
    {
      title: 'Buat LPS Baru',
      description: 'Tambah LPS produksi baru',
      icon: Plus,
      color: 'bg-blue-500',
      link: '/apps/lps/create'
    },
    {
      title: 'Daftar LPS',
      description: 'Lihat semua LPS',
      icon: FileText,
      color: 'bg-green-500',
      link: '/apps/lps/list'
    },
    {
      title: 'Finish LPS',
      description: 'Tandai LPS selesai',
      icon: CheckCircle,
      color: 'bg-purple-500',
      link: '/apps/lps/finish'
    },
    {
      title: 'Laporan',
      description: 'Lihat laporan LPS',
      icon: BarChart3,
      color: 'bg-orange-500',
      link: '/apps/lps/reports'
    }
  ]

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard LPS</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">Kelola laporan produksi selesai</p>
        </div>
        <Link to="/apps/lps/create">
          <Button app="lps" variant="primary" className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Buat LPS Baru
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          const isIncrease = card.changeType === 'increase'
          return (
            <Card key={index} hover className="p-6 relative overflow-hidden group">
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-lps-500/5 to-lps-600/5 dark:from-lps-400/10 dark:to-lps-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 group-hover:scale-105 transition-transform duration-300">
                    {card.value.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-3">
                    <div className={`flex items-center px-2 py-1 rounded-lg ${
                      isIncrease 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      <TrendingUp className={`h-3 w-3 mr-1 ${!isIncrease && 'rotate-180'}`} />
                      <span className="text-xs font-semibold">{card.change}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-slate-500 ml-2">vs bulan lalu</span>
                  </div>
                </div>
                <div className={`w-14 h-14 rounded-xl ${card.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
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
          <div className="w-10 h-10 rounded-xl bg-lps-100 dark:bg-lps-900/30 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-lps-600 dark:text-lps-400" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link
                key={index}
                to={action.link}
                className="relative p-5 rounded-xl border-2 border-gray-200 dark:border-slate-700 hover:border-lps-400 dark:hover:border-lps-500 hover:shadow-xl transition-all group bg-white dark:bg-slate-800 overflow-hidden"
              >
                {/* Hover Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-lps-500/5 to-lps-600/5 dark:from-lps-400/10 dark:to-lps-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-lps-600 dark:group-hover:text-lps-400 transition-colors">{action.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{action.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </Card>

      {/* Recent Activities & Production Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-800/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-lps-100 dark:bg-lps-900/30 flex items-center justify-center mr-3">
                <Activity className="h-5 w-5 text-lps-600 dark:text-lps-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Aktivitas Terbaru</h2>
            </div>
          </div>
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="group flex items-start space-x-3 p-4 rounded-xl bg-white dark:bg-slate-800/50 hover:bg-lps-50 dark:hover:bg-slate-700/50 transition-all duration-300 border border-gray-100 dark:border-slate-700 hover:border-lps-300 dark:hover:border-lps-600 hover:shadow-md cursor-pointer">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-lps-100 dark:bg-lps-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <div className="w-2 h-2 bg-lps-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-lps-600 dark:group-hover:text-lps-400 transition-colors">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-10 w-10 text-gray-300 dark:text-slate-600" />
                </div>
                <p className="text-gray-500 dark:text-slate-400 font-medium">Belum ada aktivitas</p>
                <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Aktivitas akan muncul di sini</p>
              </div>
            )}
          </div>
        </Card>

        {/* Production Summary */}
        <Card className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-800/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-lps-100 dark:bg-lps-900/30 flex items-center justify-center mr-3">
                <BarChart3 className="h-5 w-5 text-lps-600 dark:text-lps-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Ringkasan Produksi</h2>
            </div>
          </div>
          <div className="space-y-4">
            <div className="group flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Total Produksi (PCS)</span>
              </div>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {stats?.totalPcs?.toLocaleString() || 0}
              </span>
            </div>
            
            <div className="group flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10 border border-green-200 dark:border-green-800 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Customer Unik</span>
              </div>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                {stats?.uniqueCustomers || 0}
              </span>
            </div>
            
            <div className="group flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 border border-purple-200 dark:border-purple-800 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Finish Bulan Ini</span>
              </div>
              <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {stats?.finishThisMonth || 0}
              </span>
            </div>
            
            <div className="group flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-900/10 border border-orange-200 dark:border-orange-800 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Total Finish</span>
              </div>
              <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                {stats?.totalFinish || 0}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LpsDashboard