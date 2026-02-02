import { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  Clock, 
  Search,
  Calendar,
  User,
  Package
} from 'lucide-react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import api from '../../../services/api'
import toast from 'react-hot-toast'

const LpsFinish = () => {
  const [pendingLps, setPendingLps] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFinishModal, setShowFinishModal] = useState(false)
  const [selectedLps, setSelectedLps] = useState(null)
  const [finishData, setFinishData] = useState({
    tanggal_finish: new Date().toISOString().split('T')[0],
    keterangan: '',
    finished_by: ''
  })

  useEffect(() => {
    fetchPendingLps()
  }, [])

  const fetchPendingLps = async () => {
    try {
      setLoading(true)
      const response = await api.get('/lps/pending')
      
      // Ensure data is always an array
      if (response.data) {
        if (Array.isArray(response.data)) {
          setPendingLps(response.data)
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setPendingLps(response.data.data)
        } else if (response.data.lps && Array.isArray(response.data.lps)) {
          setPendingLps(response.data.lps)
        } else {
          console.warn('Unexpected response structure:', response.data)
          setPendingLps([])
        }
      } else {
        setPendingLps([])
      }
    } catch (error) {
      console.error('Failed to fetch pending LPS:', error)
      // Always set empty array on error
      setPendingLps([])
      // Don't show toast on initial load, only log error
    } finally {
      setLoading(false)
    }
  }

  const handleFinish = async () => {
    if (!finishData.finished_by) {
      toast.error('Mohon isi nama petugas yang menyelesaikan')
      return
    }

    const loadingToast = toast.loading('Menyelesaikan LPS...')
    try {
      await api.post(`/lps/${selectedLps.id}/finish`, finishData)
      toast.success('LPS berhasil ditandai selesai', { id: loadingToast })
      setShowFinishModal(false)
      setSelectedLps(null)
      setFinishData({
        tanggal_finish: new Date().toISOString().split('T')[0],
        keterangan: '',
        finished_by: ''
      })
      fetchPendingLps()
    } catch (error) {
      console.error('Failed to finish LPS:', error)
      toast.error(error.response?.data?.error || 'Gagal menyelesaikan LPS', { id: loadingToast })
    }
  }

  // Ensure pendingLps is always an array before filtering
  const safeData = Array.isArray(pendingLps) ? pendingLps : []
  
  const filteredLps = safeData.filter(lps => {
    if (!lps) return false
    
    return lps.no_lps?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           lps.nama_item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           lps.customer?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lps-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Finish LPS</h1>
          <p className="text-gray-600 dark:text-slate-400">Tandai LPS sebagai selesai produksi</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-slate-400">
          <Clock className="w-4 h-4" />
          <span>{filteredLps.length} LPS menunggu penyelesaian</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-gray-200 dark:border-slate-700">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari berdasarkan No LPS, Item, atau Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lps-500 dark:focus:ring-lps-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* LPS Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLps.length > 0 ? (
          filteredLps.map((lps) => (
            <div key={lps.id} className="bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 dark:border-slate-700">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{lps.no_lps}</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400">{lps.nama_item}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    lps.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {lps.status === 'pending' ? 'Pending' : 'Progress'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                    <User className="w-4 h-4 mr-2" />
                    <span>{lps.customer}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                    <Package className="w-4 h-4 mr-2" />
                    <span>{lps.jumlah_pcs?.toLocaleString()} PCS</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Dibuat: {new Date(lps.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>

                {lps.keterangan && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      <span className="font-medium">Keterangan:</span> {lps.keterangan}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => {
                    setSelectedLps(lps)
                    setShowFinishModal(true)
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Tandai Selesai
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-400 dark:text-slate-600" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Tidak ada LPS pending</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                Semua LPS sudah selesai atau belum ada LPS yang dibuat.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Finish Modal */}
      {showFinishModal && selectedLps && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Selesaikan LPS
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowFinishModal(false)
                  setSelectedLps(null)
                  setFinishData({
                    tanggal_finish: new Date().toISOString().split('T')[0],
                    keterangan: '',
                    finished_by: ''
                  })
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
              
            <div className="space-y-5">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Detail LPS:</p>
                <div className="space-y-1">
                  <p className="text-sm text-gray-700 dark:text-slate-300"><span className="font-medium">No LPS:</span> {selectedLps.no_lps}</p>
                  <p className="text-sm text-gray-700 dark:text-slate-300"><span className="font-medium">Item:</span> {selectedLps.nama_item}</p>
                  <p className="text-sm text-gray-700 dark:text-slate-300"><span className="font-medium">Customer:</span> {selectedLps.customer}</p>
                  <p className="text-sm text-gray-700 dark:text-slate-300"><span className="font-medium">Jumlah:</span> {selectedLps.jumlah_pcs?.toLocaleString()} PCS</p>
                </div>
              </div>

              <Input
                label="Tanggal Selesai"
                type="date"
                required
                value={finishData.tanggal_finish}
                onChange={(e) => setFinishData(prev => ({ ...prev, tanggal_finish: e.target.value }))}
              />

              <Input
                label="Diselesaikan oleh"
                type="text"
                required
                value={finishData.finished_by}
                onChange={(e) => setFinishData(prev => ({ ...prev, finished_by: e.target.value }))}
                placeholder="Nama petugas"
                helperText="Masukkan nama petugas yang menyelesaikan"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Keterangan
                </label>
                <textarea
                  value={finishData.keterangan}
                  onChange={(e) => setFinishData(prev => ({ ...prev, keterangan: e.target.value }))}
                  placeholder="Tambahkan keterangan jika diperlukan"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lps-500 dark:focus:ring-lps-400 focus:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-slate-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowFinishModal(false)
                  setSelectedLps(null)
                  setFinishData({
                    tanggal_finish: new Date().toISOString().split('T')[0],
                    keterangan: '',
                    finished_by: ''
                  })
                }}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                type="button"
                app="lps"
                variant="primary"
                onClick={handleFinish}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2 inline" />
                Selesaikan LPS
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LpsFinish