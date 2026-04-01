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
  Activity,
} from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
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
          api.get('/stoklabel/dashboard/activities'),
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
        <div className="h-16 w-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
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
      title: 'Total labels',
      value: stats?.totalLabels || 0,
      icon: Tags,
      tone: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
      glow: 'bg-emerald-400 dark:bg-emerald-500',
    },
    {
      title: 'Total rolls',
      value: stats?.totalRolls || 0,
      icon: Activity,
      tone: 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300',
      glow: 'bg-sky-400 dark:bg-sky-500',
    },
    {
      title: 'Masuk (30 hari)',
      value: stats?.masukThisMonth || 0,
      icon: Plus,
      tone: 'bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300',
      glow: 'bg-violet-400 dark:bg-violet-500',
    },
    {
      title: 'Low stock',
      value: stats?.lowStockItems || 0,
      icon: AlertTriangle,
      tone: 'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200',
      glow: 'bg-amber-400 dark:bg-amber-500',
    },
  ]

  const quickActions = [
    { title: 'Tambah stok label', description: 'SKU & roll', icon: Plus, href: '/apps/stoklabel/stock?action=add' },
    { title: 'Label keluar', description: 'Pengiriman', icon: Truck, href: '/apps/stoklabel/keluar?action=create' },
    { title: 'Surat jalan', description: 'Dokumen pengiriman', icon: ClipboardList, href: '/apps/stoklabel/surat-jalan?action=create' },
    { title: 'Laporan', description: 'Ringkasan stok', icon: BarChart3, href: '/apps/stoklabel/reports' },
  ]

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-emerald-50/40 to-sky-50/30 p-6 shadow-md shadow-slate-200/30 dark:border-slate-700/80 dark:from-slate-900 dark:via-slate-900 dark:to-stoklabel-950/35 dark:shadow-black/20 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-stoklabel-500/15 blur-3xl dark:bg-stoklabel-500/20" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-28 w-52 rounded-full bg-sky-400/10 blur-2xl dark:bg-sky-500/10" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stoklabel-600 dark:text-stoklabel-400">Stock label</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Alur label masuk & keluar
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Pantau roll, pengiriman, dan stok rendah dari satu layar ringkas.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link to="/apps/stoklabel/stock?action=add">
              <Button app="stoklabel" variant="primary" className="gap-2 rounded-xl shadow-lg shadow-stoklabel-600/20">
                <Plus className="h-4 w-4" strokeWidth={2} />
                Tambah stok
              </Button>
            </Link>
            <Link to="/apps/stoklabel/keluar?action=create">
              <Button app="stoklabel" variant="outline" className="gap-2 rounded-xl">
                <Truck className="h-4 w-4" strokeWidth={2} />
                Label keluar
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
                  <span>Ringkasan operasional</span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="overflow-hidden p-0 shadow-md shadow-slate-200/25 dark:shadow-black/20">
        <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50/50 to-white px-6 py-4 dark:border-slate-800 dark:from-stoklabel-950/20 dark:to-slate-900/40">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Aksi cepat</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Langsung ke form yang paling sering dipakai</p>
        </div>
        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link
                  key={index}
                  to={action.href}
                  className="group rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 transition-all hover:border-stoklabel-300/80 hover:bg-white hover:shadow-lg hover:shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-stoklabel-600/50 dark:hover:bg-slate-800 dark:hover:shadow-black/20"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-stoklabel-600 shadow-md shadow-slate-200/30 ring-1 ring-slate-100 transition group-hover:scale-105 dark:bg-slate-900 dark:text-stoklabel-400 dark:ring-slate-700">
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
              <Activity className="h-5 w-5 text-stoklabel-600 dark:text-stoklabel-400" strokeWidth={2} />
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
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-slate-900">
                    <Plus className="h-4 w-4 text-stoklabel-600" strokeWidth={2} />
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
                <p className="text-sm text-slate-600 dark:text-slate-400">Belum ada aktivitas</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 shadow-md shadow-slate-200/20 dark:shadow-black/15">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
              <BarChart3 className="h-5 w-5 text-stoklabel-600 dark:text-stoklabel-400" strokeWidth={2} />
            </span>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Status stok (estimasi)</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Stok tinggi', sub: 'Di atas minimum', n: stats?.totalLabels ? Math.floor(stats.totalLabels * 0.6) : 0, c: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' },
              { label: 'Stok sedang', sub: 'Perhatikan reorder', n: stats?.totalLabels ? Math.floor(stats.totalLabels * 0.3) : 0, c: 'bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200' },
              { label: 'Stok rendah', sub: 'Segera restock', n: stats?.lowStockItems || 0, c: 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300' },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 dark:border-slate-800"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{row.label}</p>
                  <p className="text-xs text-slate-500">{row.sub}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold tabular-nums ${row.c}`}>{row.n}</span>
              </div>
            ))}
          </div>
          <Link
            to="/apps/stoklabel/stock"
            className="mt-4 block rounded-xl bg-stoklabel-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-stoklabel-700"
          >
            Lihat detail stok
          </Link>
        </Card>
      </div>
    </div>
  )
}

export default StoklabelDashboard
