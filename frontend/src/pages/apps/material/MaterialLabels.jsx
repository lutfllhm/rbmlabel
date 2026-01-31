import Card from '../../../components/ui/Card'
import { Tags } from 'lucide-react'

const MaterialLabels = () => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daftar Label</h1>
        <p className="text-gray-600 dark:text-slate-400 mt-1">Kelola daftar label produksi</p>
      </div>
      
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-material-100 dark:bg-material-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tags className="h-10 w-10 text-material-600 dark:text-material-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Manajemen Label
          </h3>
          <p className="text-gray-500 dark:text-slate-400">
            Fitur manajemen label akan segera hadir...
          </p>
        </div>
      </Card>
    </div>
  )
}

export default MaterialLabels