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
  AlertTriangle,
} from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
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
          api.get('/material/dashboard/activities'),
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
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="h-16 w-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="flex gap-2">
            <div className="h-10 w-32 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-10 w-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
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
      title: 'Total Materials',
      value: stats?.totalMaterials || 0,
      icon: Package,
      tone: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
      glow: 'bg-blue-400 dark:bg-blue-500',
    },
    {
      title: 'Total Rolls',
      value: stats?.totalRolls || 0,
      icon: Archive,
      tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
      glow: 'bg-emerald-400 dark:bg-emerald-500',
    },
    {
      title: 'Active SPK',
      value: stats?.activeSPK || 0,
      icon: FileText,
      tone: 'bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300',
      glow: 'bg-violet-400 dark:bg-violet-500',
    },
    {
      title: 'Low Stock',
      value: stats?.lowStockItems || 0,
      icon: AlertTriangle,
      tone: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200',
      glow: 'bg-amber-400 dark:bg-amber-500',
    },
  ]

  const quickActions = [
    { title: 'Tambah stok material', description: 'Input PO & roll baru', icon: Plus, href: '/apps/material/stock?action=add' },
    { title: 'Buat SPK', description: 'Surat perintah kerja', icon: FileText, href: '/apps/material/spk?action=create' },
    { title: 'Daftar label', description: 'Master label produksi', icon: Tags, href: '/apps/material/labels' },
    { title: 'Laporan', description: 'Ringkasan & export', icon: BarChart3, href: '/apps/material/reports' },
  ]

  const totalM = stats?.totalMaterials || 0

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/90 to-material-50/50 p-6 shadow-md shadow-slate-200/30 dark:border-slate-700/80 dark:from-slate-900 dark:via-slate-900 dark:to-material-950/40 dark:shadow-black/20 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-material-500/15 blur-3xl dark:bg-material-500/20" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-32 w-64 rounded-full bg-violet-400/10 blur-2xl dark:bg-violet-500/10" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-material-600/90 dark:text-material-400">
              Material
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Ringkasan inventori & SPK
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Angka penting dan aksi singkat — siap untuk sesi kerja berikutnya.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link to="/apps/material/stock?action=add">
              <Button app="material" variant="primary" className="gap-2 rounded-xl shadow-lg shadow-material-600/20">
                <Plus className="h-4 w-4" strokeWidth={2} />
                Tambah material
              </Button>
            </Link>
            <Link to="/apps/material/spk?action=create">
              <Button app="material" variant="outline" className="gap-2 rounded-xl">
                <FileText className="h-4 w-4" strokeWidth={2} />
                Buat SPK
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} hover className="relative overflow-hidden p-5">
              <div
                className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-25 blur-2xl ${stat.glow}`}
              />
              <div className="relative">
                <div className={`mb-3 inline-flex rounded-xl p-2.5 ring-1 ring-black/[0.04] dark:ring-white/10 ${stat.tone}`}>
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{stat.title}</p>
                <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">
                  {Number(stat.value).toLocaleString()}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2} />
                  <span>vs bulan lalu (indikatif)</span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="overflow-hidden p-0 shadow-md shadow-slate-200/25 dark:shadow-black/20">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/90 to-white px-6 py-4 dark:border-slate-800 dark:from-slate-800/40 dark:to-slate-900/40">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Aksi cepat</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Pintasan ke tugas yang paling sering dipakai</p>
        </div>
        <div className="p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link
                key={index}
                to={action.href}
                className="group rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 transition-all hover:border-material-300/80 hover:bg-white hover:shadow-lg hover:shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-material-600/50 dark:hover:bg-slate-800 dark:hover:shadow-black/20"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-material-600 shadow-md shadow-slate-200/30 ring-1 ring-slate-100 transition group-hover:scale-105 dark:bg-slate-900 dark:text-material-400 dark:ring-slate-700">
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
              <FileText className="h-5 w-5 text-material-600 dark:text-material-400" strokeWidth={2} />
            </span>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Aktivitas terbaru</h2>
          </div>
          <div className="space-y-2">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-slate-900">
                    <FileText className="h-4 w-4 text-material-600" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{activity.title}</p>
                    <p className="truncate text-xs text-slate-500">{activity.description}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">{activity.time}</span>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-700">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Belum ada aktivitas</p>
                <p className="mt-1 text-xs text-slate-500">Data akan muncul setelah transaksi</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 shadow-md shadow-slate-200/20 dark:shadow-black/15">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
              <BarChart3 className="h-5 w-5 text-material-600 dark:text-material-400" strokeWidth={2} />
            </span>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Material per kategori</h2>
          </div>
          <div className="space-y-4">
            {stats?.categoryStats?.map((category, index) => {
              const pct = totalM > 0 ? (category.count / totalM) * 100 : 0
              const barColors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500']
              const c = barColors[index % barColors.length]
              return (
                <div key={index}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{category.name}</span>
                    <span className="tabular-nums text-slate-500">
                      {category.count}{' '}
                      <span className="text-slate-400">({pct.toFixed(1)}%)</span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className={`h-full rounded-full ${c}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>
              )
            }) || (
              <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400">Tidak ada data kategori</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default MaterialDashboard
