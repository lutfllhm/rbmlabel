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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="bg-white dark:bg-slate-800 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-1">
          <h1 className="text-3xl font-black uppercase text-black dark:text-white">Dashboard LPS</h1>
          <p className="text-base font-bold text-black/70 dark:text-white/70 mt-1">Kelola laporan produksi selesai</p>
        </div>
        <Link to="/apps/lps/create">
          <Button app="lps" variant="primary" className="flex items-center px-6 py-3 bg-orange-400 text-black font-black uppercase border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
            <Plus className="w-5 h-5 mr-2" strokeWidth={3} />
            Buat LPS Baru
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          const isIncrease = card.changeType === 'increase'
          const rotations = ['rotate-2', '-rotate-1', 'rotate-1', '-rotate-2']
          return (
            <div key={index} className={`bg-white dark:bg-slate-800 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all ${rotations[index]}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 ${card.color} border-4 border-black flex items-center justify-center rotate-6`}>
                  <Icon className="h-7 w-7 text-black" strokeWidth={3} />
                </div>
              </div>
              <p className="text-sm font-black uppercase text-black/70 dark:text-white/70">{card.title}</p>
              <p className="text-4xl font-black text-black dark:text-white mt-2">{card.value.toLocaleString()}</p>
              <div className="flex items-center mt-3">
                <div className={`flex items-center px-3 py-1 border-2 border-black ${
                  isIncrease 
                    ? 'bg-green-400 text-black' 
                    : 'bg-red-400 text-black'
                }`}>
                  <TrendingUp className={`h-4 w-4 mr-1 ${!isIncrease && 'rotate-180'}`} strokeWidth={3} />
                  <span className="text-xs font-black">{card.change}</span>
                </div>
                <span className="text-xs font-bold text-black/70 dark:text-white/70 ml-2">vs bulan lalu</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 border-4 border-black p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] -rotate-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black uppercase text-black dark:text-white">Aksi Cepat</h2>
          <div className="w-12 h-12 bg-orange-400 border-4 border-black flex items-center justify-center rotate-12">
            <TrendingUp className="h-6 w-6 text-black" strokeWidth={3} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            const rotations = ['rotate-1', '-rotate-2', 'rotate-2', '-rotate-1']
            return (
              <Link
                key={index}
                to={action.link}
                className={`bg-white dark:bg-slate-700 border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all ${rotations[index]}`}
              >
                <div className={`w-12 h-12 ${action.color} border-4 border-black flex items-center justify-center mb-4 rotate-6`}>
                  <Icon className="h-6 w-6 text-black" strokeWidth={3} />
                </div>
                <h3 className="font-black uppercase text-black dark:text-white mb-1">{action.title}</h3>
                <p className="text-sm font-bold text-black/70 dark:text-white/70">{action.description}</p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activities & Production Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white dark:bg-slate-800 border-4 border-black p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rotate-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-400 border-4 border-black flex items-center justify-center mr-3 rotate-6">
                <Activity className="h-6 w-6 text-black" strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-black uppercase text-black dark:text-white">Aktivitas Terbaru</h2>
            </div>
          </div>
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-yellow-300 dark:bg-slate-700 border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 bg-black border-2 border-black flex items-center justify-center">
                      <div className="w-2 h-2 bg-white"></div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-black dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-sm font-bold text-black/70 dark:text-white/70 mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs font-bold text-black/70 dark:text-white/70 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border-4 border-black bg-yellow-300 dark:bg-slate-700">
                <div className="w-20 h-20 bg-black border-4 border-black flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-10 w-10 text-white" strokeWidth={3} />
                </div>
                <p className="text-black dark:text-white font-black uppercase">Belum ada aktivitas</p>
                <p className="text-sm font-bold text-black/70 dark:text-white/70 mt-1">Aktivitas akan muncul di sini</p>
              </div>
            )}
          </div>
        </div>

        {/* Production Summary */}
        <div className="bg-white dark:bg-slate-800 border-4 border-black p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] -rotate-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-pink-400 border-4 border-black flex items-center justify-center mr-3 -rotate-6">
                <BarChart3 className="h-6 w-6 text-black" strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-black uppercase text-black dark:text-white">Ringkasan Produksi</h2>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-blue-400 border-4 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-black border-2 border-black flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5 text-white" strokeWidth={3} />
                </div>
                <span className="text-sm font-black uppercase text-black">Total Produksi (PCS)</span>
              </div>
              <span className="text-xl font-black text-black">
                {stats?.totalPcs?.toLocaleString() || 0}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-green-400 border-4 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-black border-2 border-black flex items-center justify-center mr-3">
                  <CheckCircle className="h-5 w-5 text-white" strokeWidth={3} />
                </div>
                <span className="text-sm font-black uppercase text-black">Customer Unik</span>
              </div>
              <span className="text-xl font-black text-black">
                {stats?.uniqueCustomers || 0}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-purple-400 border-4 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-black border-2 border-black flex items-center justify-center mr-3">
                  <TrendingUp className="h-5 w-5 text-white" strokeWidth={3} />
                </div>
                <span className="text-sm font-black uppercase text-black">Finish Bulan Ini</span>
              </div>
              <span className="text-xl font-black text-black">
                {stats?.finishThisMonth || 0}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-orange-400 border-4 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-black border-2 border-black flex items-center justify-center mr-3">
                  <BarChart3 className="h-5 w-5 text-white" strokeWidth={3} />
                </div>
                <span className="text-sm font-black uppercase text-black">Total Finish</span>
              </div>
              <span className="text-xl font-black text-black">
                {stats?.totalFinish || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LpsDashboard