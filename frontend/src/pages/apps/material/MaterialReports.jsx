import Card from '../../../components/ui/Card'
import AppPageHero from '../../../components/layout/AppPageHero'
import { BarChart3 } from 'lucide-react'

const MaterialReports = () => {
  return (
    <div className="space-y-8">
      <AppPageHero
        app="material"
        eyebrow="Analitik"
        title="Laporan material"
        description="Ringkasan dan export laporan akan tersedia di sini."
      />

      <Card className="p-12 text-center shadow-md shadow-slate-200/25 ring-1 ring-slate-100/80 dark:shadow-black/20 dark:ring-white/[0.04]">
        <div className="mx-auto max-w-md">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-material-100 to-material-200/50 dark:from-material-950/50 dark:to-material-900/30">
            <BarChart3 className="h-10 w-10 text-material-600 dark:text-material-400" strokeWidth={1.75} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Laporan & analitik</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Fitur laporan dan analitik akan segera hadir.
          </p>
        </div>
      </Card>
    </div>
  )
}

export default MaterialReports
