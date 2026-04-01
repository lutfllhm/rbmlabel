import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  CheckCircle,
  Eye,
} from 'lucide-react'
import AppPageHero from '../../../components/layout/AppPageHero'
import Card from '../../../components/ui/Card'
import PageLoading from '../../../components/ui/PageLoading'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Input from '../../../components/ui/Input'
import api from '../../../services/api'
import toast from 'react-hot-toast'

const StoklabelStock = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingStock, setEditingStock] = useState(null)
  const [formData, setFormData] = useState({
    part_number: '',
    nama_item: '',
    ukuran: '',
    finishing: '',
    isi: '',
    jumlah_roll: ''
  })

  useEffect(() => {
    fetchStocks()
  }, [])

  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setShowAddModal(true)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const fetchStocks = async () => {
    try {
      const response = await api.get('/stoklabel/stock')
      const payload = response.data
      const list = Array.isArray(payload) ? payload : payload?.data ?? []
      setStocks(list)
    } catch (error) {
      console.error('Failed to fetch stocks:', error)
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Gagal memuat data stock'
      toast.error(msg, { id: 'stoklabel-stock-fetch' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingStock) {
        await api.put(`/stoklabel/stock/${editingStock.id}`, formData)
        toast.success('Stock updated successfully')
      } else {
        await api.post('/stoklabel/stock', formData)
        toast.success('Stock added successfully')
      }
      
      setShowAddModal(false)
      setEditingStock(null)
      setFormData({
        part_number: '',
        nama_item: '',
        ukuran: '',
        finishing: '',
        isi: '',
        jumlah_roll: ''
      })
      fetchStocks()
    } catch (error) {
      console.error('Failed to save stock:', error)
      toast.error(error.response?.data?.message || 'Failed to save stock')
    }
  }

  const handleEdit = (stock) => {
    setEditingStock(stock)
    setFormData({
      part_number: stock.part_number,
      nama_item: stock.nama_item,
      ukuran: stock.ukuran,
      finishing: stock.finishing,
      isi: stock.isi.toString(),
      jumlah_roll: stock.jumlah_roll.toString()
    })
    setShowAddModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this stock item?')) return
    
    try {
      await api.delete(`/stoklabel/stock/${id}`)
      toast.success('Stock deleted successfully')
      fetchStocks()
    } catch (error) {
      console.error('Failed to delete stock:', error)
      toast.error('Failed to delete stock')
    }
  }

  const getStockStatus = (jumlahRoll) => {
    if (jumlahRoll <= 5) return { status: 'low', color: 'text-red-600 bg-red-50', icon: AlertTriangle }
    if (jumlahRoll <= 20) return { status: 'medium', color: 'text-yellow-600 bg-yellow-50', icon: Package }
    return { status: 'high', color: 'text-green-600 bg-green-50', icon: CheckCircle }
  }

  const filteredStocks = stocks.filter(stock =>
    stock.part_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.nama_item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.ukuran.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <PageLoading app="stoklabel" />
  }

  return (
    <div className="space-y-8">
      <AppPageHero
        app="stoklabel"
        eyebrow="Stok"
        title="Stock label"
        description="Kelola SKU label, roll, dan status stok rendah / aman."
      >
        <Button
          app="stoklabel"
          variant="primary"
          onClick={() => setShowAddModal(true)}
          className="gap-2 rounded-xl shadow-lg shadow-stoklabel-600/20"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Tambah stok
        </Button>
      </AppPageHero>

      <Card className="p-5 shadow-md shadow-slate-200/25 ring-1 ring-slate-100/80 dark:shadow-black/20 dark:ring-white/[0.04] sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Cari part number, nama item, atau ukuran..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-stoklabel-500 dark:focus:ring-stoklabel-400 focus:border-transparent transition-all duration-200"
            />
          </div>
          <Button app="stoklabel" variant="secondary" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden shadow-md shadow-slate-200/25 ring-1 ring-slate-100/80 dark:shadow-black/25 dark:ring-white/[0.04]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100/90 dark:from-slate-800 dark:to-slate-800/95">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Part Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Finishing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Isi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Rolls
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900/50">
              {filteredStocks.map((stock) => {
                const stockStatus = getStockStatus(stock.jumlah_roll)
                const StatusIcon = stockStatus.icon

                return (
                  <tr key={stock.id} className="transition-colors hover:bg-slate-50/90 dark:hover:bg-slate-800/60">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-stoklabel-100 dark:bg-stoklabel-900/20 rounded-lg flex items-center justify-center mr-3">
                          <Package className="h-5 w-5 text-stoklabel-600 dark:text-stoklabel-400" />
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{stock.part_number}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{stock.nama_item}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{stock.ukuran}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{stock.finishing}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{stock.isi}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{stock.jumlah_roll}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={stockStatus.status === 'low' ? 'error' : stockStatus.status === 'medium' ? 'warning' : 'success'}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {stockStatus.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(stock)}
                          className="text-stoklabel-600 dark:text-stoklabel-400 hover:text-stoklabel-700 dark:hover:text-stoklabel-300 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(stock.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredStocks.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-slate-400">Tidak ada stock ditemukan</p>
          </div>
        )}
      </Card>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingStock ? 'Edit Stock' : 'Tambah Stock Baru'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingStock(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Part Number"
                    type="text"
                    required
                    value={formData.part_number}
                    onChange={(e) => setFormData({...formData, part_number: e.target.value})}
                    placeholder="Masukkan part number"
                  />
                  
                  <Input
                    label="Nama Item"
                    type="text"
                    required
                    value={formData.nama_item}
                    onChange={(e) => setFormData({...formData, nama_item: e.target.value})}
                    placeholder="Masukkan nama item"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Ukuran"
                    type="text"
                    required
                    value={formData.ukuran}
                    onChange={(e) => setFormData({...formData, ukuran: e.target.value})}
                    placeholder="Contoh: 100x200 mm"
                  />
                  
                  <Input
                    label="Finishing"
                    type="text"
                    required
                    value={formData.finishing}
                    onChange={(e) => setFormData({...formData, finishing: e.target.value})}
                    placeholder="Jenis finishing"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Isi"
                    type="number"
                    required
                    value={formData.isi}
                    onChange={(e) => setFormData({...formData, isi: e.target.value})}
                    placeholder="0"
                    helperText="Jumlah isi per roll"
                  />
                  
                  <Input
                    label="Jumlah Roll"
                    type="number"
                    step="0.01"
                    required
                    value={formData.jumlah_roll}
                    onChange={(e) => setFormData({...formData, jumlah_roll: e.target.value})}
                    placeholder="0"
                    helperText="Jumlah roll tersedia"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-slate-700">
                  <Button
                    type="button"
                    app="stoklabel"
                    variant="secondary"
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingStock(null)
                      setFormData({
                        part_number: '',
                        nama_item: '',
                        ukuran: '',
                        finishing: '',
                        isi: '',
                        jumlah_roll: ''
                      })
                    }}
                  >
                    Batal
                  </Button>
                  <Button type="submit" app="stoklabel" variant="primary">
                    {editingStock ? 'Update' : 'Tambah'} Stock
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default StoklabelStock