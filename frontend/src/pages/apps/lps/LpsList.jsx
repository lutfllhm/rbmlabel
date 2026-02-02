import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import api from '../../../services/api'
import toast from 'react-hot-toast'

const LpsList = () => {
  const [lpsData, setLpsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedLps, setSelectedLps] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchLpsData()
  }, [currentPage, searchTerm, statusFilter])

  const fetchLpsData = async () => {
    try {
      setLoading(true)
      const response = await api.get('/lps/list', {
        params: {
          page: currentPage,
          search: searchTerm,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          limit: 10
        }
      })
      
      // Handle different response structures
      if (response.data) {
        if (Array.isArray(response.data)) {
          // If response.data is directly an array
          setLpsData(response.data)
          setTotalPages(1)
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // If response has data property
          setLpsData(response.data.data)
          setTotalPages(response.data.totalPages || 1)
        } else {
          // Fallback
          setLpsData([])
          setTotalPages(1)
        }
      }
    } catch (error) {
      console.error('Failed to fetch LPS data:', error)
      toast.error(error.response?.data?.error || 'Gagal memuat data LPS')
      setLpsData([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/lps/${selectedLps.id}`)
      toast.success('LPS berhasil dihapus')
      setShowDeleteModal(false)
      setSelectedLps(null)
      fetchLpsData()
    } catch (error) {
      console.error('Failed to delete LPS:', error)
      toast.error('Gagal menghapus LPS')
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
        text: 'Pending'
      },
      progress: {
        color: 'bg-blue-100 text-blue-800',
        icon: AlertCircle,
        text: 'Progress'
      },
      finish: {
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        text: 'Selesai'
      }
    }

    const config = statusConfig[status] || statusConfig.pending
    const IconComponent = config.icon

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    )
  }

  const filteredData = Array.isArray(lpsData) ? lpsData.filter(lps => {
    const matchesSearch = lps.no_lps?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lps.nama_item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lps.customer?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || lps.status === statusFilter
    
    return matchesSearch && matchesStatus
  }) : []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lps-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daftar LPS</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">Kelola laporan produksi selesai</p>
        </div>
        <Link to="/apps/lps/create">
          <Button app="lps" variant="primary" className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Tambah LPS
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari berdasarkan No LPS, Item, atau Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lps-500 dark:focus:ring-lps-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500 dark:text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lps-500 dark:focus:ring-lps-400 focus:border-transparent transition-all duration-200"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="progress">Progress</option>
              <option value="finish">Selesai</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  No LPS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Jumlah PCS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
              {filteredData.length > 0 ? (
                filteredData.map((lps) => (
                  <tr key={lps.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {lps.no_lps}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                      {lps.nama_item}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                      {lps.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                      {lps.jumlah_pcs?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(lps.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                      {new Date(lps.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {/* Handle view */}}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-150"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {/* Handle edit */}}
                          className="text-lps-600 dark:text-lps-400 hover:text-lps-900 dark:hover:text-lps-300 transition-colors duration-150"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedLps(lps)
                            setShowDeleteModal(true)
                          }}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-150"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <AlertCircle className="h-12 w-12 text-gray-300 dark:text-slate-600 mb-3" />
                      <p className="text-gray-500 dark:text-slate-400">Tidak ada data LPS</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white dark:bg-slate-900 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-slate-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                app="lps"
                variant="secondary"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                app="lps"
                variant="secondary"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-slate-300">
                  Halaman <span className="font-medium">{currentPage}</span> dari{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <Button
                    app="lps"
                    variant="secondary"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    app="lps"
                    variant="secondary"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="ml-2"
                  >
                    Next
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="ml-4 text-xl font-bold text-gray-900 dark:text-white">
                  Hapus LPS
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-6">
                Apakah Anda yakin ingin menghapus LPS "<strong className="text-gray-900 dark:text-white">{selectedLps?.no_lps}</strong>"? 
                Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedLps(null)
                  }}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  className="flex-1"
                >
                  Hapus LPS
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default LpsList