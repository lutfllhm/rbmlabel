import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Package,
  Tags,
  FileText,
  TrendingUp,
  PackageSearch,
  Globe2,
  BarChart3,
  HeartHandshake,
  LayoutList,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import api from '../services/api'
import DarkModeToggle from '../components/DarkModeToggle'
import Card from '../components/ui/Card'

const dotGridClass =
  'bg-[linear-gradient(to_right,rgb(148_163_184/0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_163_184/0.08)_1px,transparent_1px)] bg-[size:48px_48px] dark:bg-[linear-gradient(to_right,rgb(148_163_184/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_163_184/0.06)_1px,transparent_1px)]'

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
            lps: { total_lps: 0, finished_lps: 0, lps_this_month: 0 },
          },
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
      description: 'Stok material, kategori, dan SPK produksi',
      icon: Package,
      path: '/login?app=material',
      accent: 'text-sky-300',
      iconBg: 'bg-sky-500/20 text-sky-200 ring-1 ring-sky-400/30',
      bar: 'from-sky-400 to-cyan-400',
    },
    {
      name: 'Stock Label',
      description: 'Label masuk, keluar, dan pelacakan',
      icon: Tags,
      path: '/login?app=stoklabel',
      accent: 'text-emerald-300',
      iconBg: 'bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/30',
      bar: 'from-emerald-400 to-teal-400',
    },
    {
      name: 'LPS Production',
      description: 'Laporan produksi selesai & verifikasi',
      icon: FileText,
      path: '/login?app=lps',
      accent: 'text-violet-300',
      iconBg: 'bg-violet-500/20 text-violet-200 ring-1 ring-violet-400/30',
      bar: 'from-violet-400 to-fuchsia-400',
    },
  ]

  const capabilities = [
    {
      icon: PackageSearch,
      title: 'Pelacakan stok cerdas',
      description: 'Pantau ketersediaan material secara real-time dengan notifikasi otomatis untuk stok menipis.',
      iconWrap: 'bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300',
      borderHover: 'hover:border-sky-300/80 dark:hover:border-sky-700/80',
      featuredGradient: 'from-sky-500/15 via-transparent to-violet-500/10',
    },
    {
      icon: Globe2,
      title: 'Manajemen pengiriman',
      description: 'Lacak status pengiriman dan surat jalan dengan sistem terintegrasi.',
      iconWrap: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300',
      borderHover: 'hover:border-indigo-300/80 dark:hover:border-indigo-700/80',
    },
    {
      icon: BarChart3,
      title: 'Analitik produksi',
      description: 'Visualisasi data produksi dan tren penggunaan material untuk optimasi operasional.',
      iconWrap: 'bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300',
      borderHover: 'hover:border-violet-300/80 dark:hover:border-violet-700/80',
    },
    {
      icon: HeartHandshake,
      title: 'Kolaborasi tim',
      description: 'Koordinasi antar departemen dengan sistem notifikasi dan approval terintegrasi.',
      iconWrap: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300',
      borderHover: 'hover:border-rose-300/80 dark:hover:border-rose-700/80',
    },
    {
      icon: LayoutList,
      title: 'Manajemen transaksi',
      description: 'Kelola supplier, kategori, dan status transaksi dalam satu dashboard terpadu.',
      iconWrap: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
      borderHover: 'hover:border-emerald-300/80 dark:hover:border-emerald-700/80',
    },
  ]

  const [featuredCapability, ...restCapabilities] = capabilities
  const FeaturedIcon = featuredCapability.icon

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-slate-300 border-t-material-600 dark:border-slate-600 dark:border-t-material-400" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Memuat…</p>
        </div>
      </div>
    )
  }

  const stats = dashboardData?.stats

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/75 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/75">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md shadow-slate-900/10 sm:h-11 sm:w-11 dark:bg-white dark:shadow-none">
              <img src="/img/rbm.png" alt="RBM" className="h-6 w-6 object-contain sm:h-7 sm:w-7" style={{ filter: 'brightness(0) saturate(100%) invert(17%) sepia(95%) saturate(7471%) hue-rotate(2deg) brightness(98%) contrast(118%)' }} />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg dark:text-white">RBM Inventory</h1>
              <p className="text-[11px] text-slate-500 sm:text-xs dark:text-slate-400">B2B dashboard</p>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <DarkModeToggle />
            <Link
              to="/login"
              className="rounded-full bg-material-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-material-600/25 transition hover:bg-material-700 sm:py-2.5"
            >
              Masuk
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200/60 dark:border-slate-800/80">
        <div className={`pointer-events-none absolute inset-0 ${dotGridClass}`} aria-hidden />
        <div
          className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl dark:bg-sky-500/5"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-violet-500/8 blur-3xl dark:bg-violet-600/5"
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-20 lg:px-8 lg:pb-40 lg:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-4 py-2 text-xs font-semibold tracking-wide text-slate-700 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" strokeWidth={2} />
              Sistem Manajemen Inventori Terintegrasi
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              Platform Terpadu untuk
              <span className="mt-2 block bg-gradient-to-r from-material-600 via-violet-600 to-sky-600 bg-clip-text text-transparent dark:from-material-400 dark:via-violet-400 dark:to-sky-400">
                Manajemen Inventori
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Kelola material, label, dan laporan produksi dalam satu sistem yang terintegrasi. 
              Dirancang untuk efisiensi operasional gudang dan produksi dengan interface yang intuitif.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-material-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-material-600/25 transition hover:bg-material-700 sm:w-auto"
              >
                Masuk ke Sistem
                <ArrowRight className="h-5 w-5" strokeWidth={2} />
              </Link>
              <a
                href="#capabilities"
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white/90 px-8 py-4 text-base font-semibold text-slate-800 shadow-sm backdrop-blur-sm transition hover:border-slate-300 hover:bg-white sm:w-auto dark:border-slate-600 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Pelajari Lebih Lanjut
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                Real-time Updates
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-sky-500" />
                Multi-Module Access
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-violet-500" />
                Role-Based Security
              </span>
            </div>
          </div>

          {/* Stats Preview */}
          {stats && (
            <div className="mx-auto mt-20 max-w-5xl">
              <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Data Terkini
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/80 dark:bg-slate-900/70">
                  <div className="mb-4 inline-flex rounded-xl bg-sky-100 p-3 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
                    <Package className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <p className="text-3xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">
                    {stats?.material?.total_materials ?? 0}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">Material Terdaftar</p>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/80 dark:bg-slate-900/70">
                  <div className="mb-4 inline-flex rounded-xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                    <Tags className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <p className="text-3xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">
                    {stats?.label?.total_labels ?? 0}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">Total Label</p>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/80 dark:bg-slate-900/70">
                  <div className="mb-4 inline-flex rounded-xl bg-violet-100 p-3 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
                    <FileText className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <p className="text-3xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">
                    {stats?.lps?.total_lps ?? 0}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">Laporan LPS</p>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/80 dark:bg-slate-900/70">
                  <div className="mb-4 inline-flex rounded-xl bg-amber-100 p-3 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                    <TrendingUp className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <p className="text-3xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">
                    {stats?.spk?.total_spk ?? 0}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">SPK Aktif</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Capabilities — bento */}
      <section
        id="capabilities"
        className="relative border-b border-slate-200/60 bg-white py-24 dark:border-slate-800 dark:bg-slate-900 sm:py-32"
      >
        <div className={`pointer-events-none absolute inset-0 opacity-40 ${dotGridClass}`} aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-material-600 dark:text-material-400">Kemampuan Platform</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
              Fitur lengkap untuk operasional yang efisien
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Sistem terintegrasi dengan visualisasi data real-time untuk memudahkan pengambilan keputusan dan meningkatkan produktivitas tim.
            </p>
          </div>

          <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item) => {
              const Icon = item.icon
              return (
                <Card
                  key={item.title}
                  hover
                  className={`group relative overflow-hidden rounded-2xl p-8 ${item.borderHover}`}
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-slate-100/60 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-slate-800/40" />
                  <div className="relative flex flex-col gap-5">
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconWrap}`}>
                      <Icon className="h-7 w-7" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold leading-snug text-slate-900 dark:text-white">{item.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.description}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Applications — dark slab */}
      <section id="applications" className="px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-900 px-8 py-20 shadow-2xl shadow-slate-900/20 sm:px-12 sm:py-24 lg:px-16 lg:py-28 dark:bg-slate-950 dark:ring-1 dark:ring-white/10">
          <div
            className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-material-600/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl"
            aria-hidden
          />

          <div className="relative">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Modul Aplikasi</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">Tiga modul terintegrasi</h2>
              <p className="mt-6 text-lg text-slate-300">
                Akses terpisah per modul dengan kontrol hak akses berbasis peran untuk keamanan dan efisiensi maksimal.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {apps.map((app, index) => {
                const Icon = app.icon
                return (
                  <Link
                    key={app.path}
                    to={app.path}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-black/30"
                  >
                    <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${app.bar} opacity-90`} />
                    <div className="mb-6 flex items-center justify-between">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${app.iconBg} transition-transform group-hover:scale-110`}>
                        <Icon className={`h-8 w-8 ${app.accent}`} strokeWidth={2} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-white">{app.name}</h3>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-300">{app.description}</p>
                    <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white/90 transition-transform group-hover:translate-x-1">
                      Buka login
                      <ArrowRight className="h-4 w-4" strokeWidth={2} />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200/60 bg-gradient-to-b from-slate-50 to-white py-24 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-white px-8 py-20 text-center shadow-2xl shadow-slate-200/50 dark:border-slate-700 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:shadow-black/40 sm:px-12 sm:py-24">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.08),transparent_50%)]" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
                Siap mengelola inventori Anda?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-400">
                Gunakan akun yang sudah ditentukan admin untuk mengakses modul yang sesuai dengan peran Anda.
              </p>
              <Link
                to="/login"
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-slate-900 px-10 py-4 text-base font-semibold text-white shadow-xl transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                Masuk ke Portal
                <ArrowRight className="h-5 w-5" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-4 md:gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-white">
                  <img src="/img/rbm.png" alt="RBM" className="h-6 w-6 object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(17%) sepia(95%) saturate(7471%) hue-rotate(2deg) brightness(98%) contrast(118%)' }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">RBM Inventory</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Sistem Manajemen Inventori</p>
                </div>
              </div>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Platform manajemen inventori dan produksi yang terintegrasi untuk operasional B2B yang efisien dan terorganisir.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">Modul</h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link to="/login?app=material" className="text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    Material Management
                  </Link>
                </li>
                <li>
                  <Link to="/login?app=stoklabel" className="text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    Stock Label
                  </Link>
                </li>
                <li>
                  <Link to="/login?app=lps" className="text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    LPS Production
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">Kontak</h4>
              <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li>info@rbm.com</li>
                <li>+62 xxx xxxx</li>
                <li className="leading-relaxed">Pusat Pergudangan Romokalisari D-39, Surabaya</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-sm text-slate-500 md:flex-row dark:border-slate-800 dark:text-slate-400">
            <p>© 2026 RBM. Hak cipta dilindungi.</p>
            <div className="flex gap-6">
              <a href="#" className="transition hover:text-slate-900 dark:hover:text-white">
                Privasi
              </a>
              <a href="#" className="transition hover:text-slate-900 dark:hover:text-white">
                Syarat
              </a>
              <a href="#" className="transition hover:text-slate-900 dark:hover:text-white">
                Kontak
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
