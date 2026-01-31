import Card from '../../../components/ui/Card'
import { BarChart3 } from 'lucide-react'

const MaterialReports = () => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Laporan Material</h1>
        <p className="text-gray-600 dark:text-slate-400 mt-1">Laporan material dan produksi</p>
      </div>
      
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-material-100 dark:bg-material-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-10 w-10 text-material-600 dark:text-material-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Laporan & Analitik
          </h3>
          <p className="text-gray-500 dark:text-slate-400">
            Fitur laporan dan analitik akan segera hadir...
          </p>
        </div>
      </Card>
    </div>
  )
}

export default MaterialReports