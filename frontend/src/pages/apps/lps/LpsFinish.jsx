import { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  Clock, 
  Search, 
  Filter,
  Calendar,
  User,
  Package
} from 'lucide-react'
import Card from '../../../components/ui/Card'
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
      setPendingLps(response.data)
    } catch (error) {
      console.error('Failed to fetch pending LPS:', error)
      toast.error('Gagal memuat data LPS pending')
    } finally {
      setLoading(false)
    }
  }

  const handleFinish = async () => {
    if (!finishData.finished_by) {
      toast.error('Mohon isi nama petugas yang menyelesaikan')
      return
    }

    try {
      await api.post(`/lps/${selectedLps.id}/finish`, finishData)
      toast.success('LPS berhasil ditandai selesai')
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
      toast.error('Gagal menyelesaikan LPS')
    }
  }

  const filteredLps = pendingLps.filter(lps => 
    lps.no_lps?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lps.nama_item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lps.customer?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lps-500 dark:focus:ring-lps-400 focus:border-transparent transition-all duration-200"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border border-gray-200 dark:border-slate-700 w-96 shadow-lg rounded-md bg-white dark:bg-slate-800">
            <div className="mt-3">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-2 text-center">
                Selesaikan LPS
              </h3>
              
              <div className="mt-4 space-y-4">
                <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg border border-gray-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">No LPS: {selectedLps.no_lps}</p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Item: {selectedLps.nama_item}</p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Customer: {selectedLps.customer}</p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Jumlah: {selectedLps.jumlah_pcs?.toLocaleString()} PCS</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Tanggal Selesai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={finishData.tanggal_finish}
                    onChange={(e) => setFinishData(prev => ({ ...prev, tanggal_finish: e.target.value }))}
                    className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lps-500 dark:focus:ring-lps-400 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Diselesaikan oleh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={finishData.finished_by}
                    onChange={(e) => setFinishData(prev => ({ ...prev, finished_by: e.target.value }))}
                    placeholder="Nama petugas"
                    className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lps-500 dark:focus:ring-lps-400 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Keterangan
                  </label>
                  <textarea
                    value={finishData.keterangan}
                    onChange={(e) => setFinishData(prev => ({ ...prev, keterangan: e.target.value }))}
                    placeholder="Keterangan tambahan (opsional)"
                    rows={3}
                    className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lps-500 dark:focus:ring-lps-400 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
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
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-md hover:bg-gray-400 dark:hover:bg-slate-600 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                >
                  Selesaikan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LpsFinish