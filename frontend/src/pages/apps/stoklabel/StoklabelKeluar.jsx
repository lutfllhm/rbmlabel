import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Package,
  Calendar,
  User,
  Truck,
  FileText
} from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import api from '../../../services/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const StoklabelKeluar = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [labelKeluar, setLabelKeluar] = useState([])
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    tanggal: '',
    part_number: '',
    nama_item: '',
    customer: '',
    jumlah: '',
    keterangan: ''
  })

  useEffect(() => {
    fetchLabelKeluar()
    fetchStocks()
    if (searchParams.get('action') === 'create') {
      setShowAddModal(true)
      setSearchParams({})
    }
  }, [searchParams, setSearchParams])

  const fetchLabelKeluar = async () => {
    try {
      const response = await api.get('/stoklabel/keluar')
      setLabelKeluar(response.data)
    } catch (error) {
      console.error('Failed to fetch label keluar:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const fetchStocks = async () => {
    try {
      const response = await api.get('/stoklabel/stock')
      setStocks(response.data)
    } catch (error) {
      console.error('Failed to fetch stocks:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await api.put(`/stoklabel/keluar/${editingItem.id}`, formData)
        toast.success('Label keluar updated successfully')
      } else {
        await api.post('/stoklabel/keluar', formData)
        toast.success('Label keluar added successfully')
      }
      
      setShowAddModal(false)
      setEditingItem(null)
      resetForm()
      fetchLabelKeluar()
      fetchStocks() // Refresh stock data
    } catch (error) {
      console.error('Failed to save label keluar:', error)
      toast.error(error.response?.data?.message || 'Failed to save data')
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      tanggal: format(new Date(item.tanggal), 'yyyy-MM-dd'),
      part_number: item.part_number,
      nama_item: item.nama_item,
      customer: item.customer || '',
      jumlah: item.jumlah,
      keterangan: item.keterangan || ''
    })
    setShowAddModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      await api.delete(`/stoklabel/keluar/${id}`)
      toast.success('Label keluar deleted successfully')
      fetchLabelKeluar()
      fetchStocks() // Refresh stock data
    } catch (error) {
      console.error('Failed to delete label keluar:', error)
      toast.error('Failed to delete item')
    }
  }

  const handlePartNumberChange = (partNumber) => {
    const selectedStock = stocks.find(stock => stock.part_number === partNumber)
    if (selectedStock) {
      setFormData({
        ...formData,
        part_number: partNumber,
        nama_item: selectedStock.nama_item
      })
    } else {
      setFormData({
        ...formData,
        part_number: partNumber,
        nama_item: ''
      })
    }
  }

  const resetForm = () => {
    setFormData({
      tanggal: '',
      part_number: '',
      nama_item: '',
      customer: '',
      jumlah: '',
      keterangan: ''
    })
  }

  const filteredItems = labelKeluar.filter(item =>
    item.part_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nama_item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.customer && item.customer.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-stoklabel-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Label Keluar</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">Kelola data label yang keluar</p>
        </div>
        <Button
          app="stoklabel"
          variant="primary"
          onClick={() => setShowAddModal(true)}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Label Keluar
        </Button>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Cari part number, nama item, atau customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-stoklabel-500 dark:focus:ring-stoklabel-400 focus:border-transparent transition-all duration-200"
            />
          </div>
          <Button app="stoklabel" variant="secondary" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Part Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Keterangan
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 dark:text-slate-500 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {format(new Date(item.tanggal), 'dd/MM/yyyy')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{item.part_number}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-white">{item.nama_item}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 dark:text-slate-500 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">{item.customer || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-gray-400 dark:text-slate-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{item.jumlah}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 dark:text-slate-400">{item.keterangan || '-'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-stoklabel-600 dark:text-stoklabel-400 hover:text-stoklabel-700 dark:hover:text-stoklabel-300 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Truck className="h-16 w-16 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-slate-400">Tidak ada label keluar ditemukan</p>
          </div>
        )}
      </Card>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingItem ? 'Edit Label Keluar' : 'Tambah Label Keluar Baru'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingItem(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Tanggal"
                  type="date"
                  required
                  value={formData.tanggal}
                  onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Part Number <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.part_number}
                    onChange={(e) => handlePartNumberChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-stoklabel-500 dark:focus:ring-stoklabel-400 focus:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-slate-500"
                    required
                  >
                    <option value="">Pilih Part Number</option>
                    {stocks.map((stock) => (
                      <option key={stock.id} value={stock.part_number}>
                        {stock.part_number} - {stock.nama_item} (Stock: {stock.jumlah_roll})
                      </option>
                    ))}
                  </select>
                  <p className="mt-1.5 text-sm text-gray-500 dark:text-slate-400">Pilih dari stok yang tersedia</p>
                </div>
                
                <Input
                  label="Nama Item"
                  type="text"
                  required
                  value={formData.nama_item}
                  onChange={(e) => setFormData({...formData, nama_item: e.target.value})}
                  readOnly={!!formData.part_number}
                  helperText={formData.part_number ? "Otomatis terisi dari part number" : ""}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Customer"
                    type="text"
                    value={formData.customer}
                    onChange={(e) => setFormData({...formData, customer: e.target.value})}
                    placeholder="Nama customer"
                  />
                  
                  <Input
                    label="Jumlah"
                    type="text"
                    required
                    value={formData.jumlah}
                    onChange={(e) => setFormData({...formData, jumlah: e.target.value})}
                    placeholder="Contoh: 100 pcs"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Keterangan
                  </label>
                  <textarea
                    value={formData.keterangan}
                    onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                    rows={3}
                    placeholder="Tambahkan keterangan jika diperlukan"
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-stoklabel-500 dark:focus:ring-stoklabel-400 focus:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-slate-500"
                    rows="3"
                    placeholder="Catatan opsional..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    app="stoklabel"
                    variant="secondary"
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingItem(null)
                      resetForm()
                    }}
                  >
                    Batal
                  </Button>
                  <Button type="submit" app="stoklabel" variant="primary">
                    {editingItem ? 'Update' : 'Tambah'} Label Keluar
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

export default StoklabelKeluar