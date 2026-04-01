import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Plus,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Activity,
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
          api.get('/lps/dashboard/activities'),
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
        <div className="h-16 w-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
        <div className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total LPS',
      value: stats?.totalLps || 0,
      icon: FileText,
      tone: 'bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300',
      glow: 'bg-violet-400 dark:bg-violet-500',
    },
    {
      title: 'Selesai',
      value: stats?.finishedLps || 0,
      icon: CheckCircle,
      tone: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
      glow: 'bg-emerald-400 dark:bg-emerald-500',
    },
    {
      title: 'Pending',
      value: stats?.pendingLps || 0,
      icon: Clock,
      tone: 'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200',
      glow: 'bg-amber-400 dark:bg-amber-500',
    },
    {
      title: 'Bulan ini',
      value: stats?.lpsThisMonth || 0,
      icon: TrendingUp,
      tone: 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300',
      glow: 'bg-sky-400 dark:bg-sky-500',
    },
  ]

  const quickActions = [
    { title: 'Buat LPS', description: 'Entri produksi baru', icon: Plus, link: '/apps/lps/create' },
    { title: 'Daftar LPS', description: 'Semua order', icon: FileText, link: '/apps/lps/list' },
    { title: 'Finish', description: 'Tandai selesai', icon: CheckCircle, link: '/apps/lps/finish' },
    { title: 'Laporan', description: 'Analitik LPS', icon: BarChart3, link: '/apps/lps/reports' },
  ]

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-violet-50/50 to-fuchsia-50/30 p-6 shadow-md shadow-slate-200/30 dark:border-slate-700/80 dark:from-slate-900 dark:via-slate-900 dark:to-lps-950/40 dark:shadow-black/20 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-lps-500/15 blur-3xl dark:bg-lps-500/25" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-48 rounded-full bg-fuchsia-400/10 blur-2xl dark:bg-fuchsia-500/10" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lps-600 dark:text-lps-400">LPS Production</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Produksi & penyelesaian order
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Pantau LPS yang jalan, yang selesai, dan yang menunggu tindak lanjut.
            </p>
          </div>
          <Link to="/apps/lps/create" className="shrink-0">
            <Button app="lps" variant="primary" className="gap-2 rounded-xl shadow-lg shadow-lps-600/25">
              <Plus className="h-4 w-4" strokeWidth={2} />
              Buat LPS baru
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <Card key={index} hover className="relative overflow-hidden p-5">
              <div
                className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-25 blur-2xl ${card.glow}`}
              />
              <div className="relative">
                <div className={`mb-3 inline-flex rounded-xl p-2.5 ring-1 ring-black/[0.04] dark:ring-white/10 ${card.tone}`}>
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{card.title}</p>
                <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">
                  {Number(card.value).toLocaleString()}
                </p>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="overflow-hidden p-0 shadow-md shadow-slate-200/25 dark:shadow-black/20">
        <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50/60 to-white px-6 py-4 dark:border-slate-800 dark:from-lps-950/25 dark:to-slate-900/40">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Aksi cepat</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Alur kerja LPS dalam satu ketukan</p>
        </div>
        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link
                  key={index}
                  to={action.link}
                  className="group rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 transition-all hover:border-lps-300/80 hover:bg-white hover:shadow-lg hover:shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-lps-600/50 dark:hover:bg-slate-800 dark:hover:shadow-black/20"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lps-600 shadow-md shadow-slate-200/30 ring-1 ring-slate-100 transition group-hover:scale-105 dark:bg-slate-900 dark:text-lps-400 dark:ring-slate-700">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{action.title}</h3>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{action.description}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6 shadow-md shadow-slate-200/20 dark:shadow-black/15">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
              <Activity className="h-5 w-5 text-lps-600 dark:text-lps-400" strokeWidth={2} />
            </span>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Aktivitas terbaru</h2>
          </div>
          <div className="space-y-2">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{activity.description}</p>
                  <p className="mt-1 text-xs text-slate-400">{activity.time}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400">Belum ada aktivitas</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 shadow-md shadow-slate-200/20 dark:shadow-black/15">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
              <BarChart3 className="h-5 w-5 text-lps-600 dark:text-lps-400" strokeWidth={2} />
            </span>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Ringkasan produksi</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Total produksi (PCS)', value: stats?.totalPcs?.toLocaleString() || '0', icon: FileText },
              { label: 'Customer unik', value: stats?.uniqueCustomers ?? 0, icon: CheckCircle },
              { label: 'Finish bulan ini', value: stats?.finishThisMonth ?? 0, icon: TrendingUp },
              { label: 'Total finish', value: stats?.totalFinish ?? 0, icon: BarChart3 },
            ].map((row, i) => {
              const Icon = row.icon
              return (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 dark:border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lps-100 text-lps-700 dark:bg-lps-950/40 dark:text-lps-300">
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{row.label}</span>
                  </div>
                  <span className="text-lg font-semibold tabular-nums text-slate-900 dark:text-white">{row.value}</span>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LpsDashboard
