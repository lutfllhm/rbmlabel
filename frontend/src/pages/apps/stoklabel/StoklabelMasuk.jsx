import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Package,
  Calendar,
  FileText,
  User
} from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import api from '../../../services/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const StoklabelMasuk = () => {
  const [labelMasuk, setLabelMasuk] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    tanggal: '',
    no_spk: '',
    no_lps: '',
    part_number: '',
    nama_item: '',
    jumlah_order: '',
    customer: ''
  })

  useEffect(() => {
    fetchLabelMasuk()
  }, [])

  const fetchLabelMasuk = async () => {
    try {
      const response = await api.get('/stoklabel/masuk')
      setLabelMasuk(response.data)
    } catch (error) {
      console.error('Failed to fetch label masuk:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await api.put(`/stoklabel/masuk/${editingItem.id}`, formData)
        toast.success('Label masuk updated successfully')
      } else {
        await api.post('/stoklabel/masuk', formData)
        toast.success('Label masuk added successfully')
      }
      
      setShowAddModal(false)
      setEditingItem(null)
      resetForm()
      fetchLabelMasuk()
    } catch (error) {
      console.error('Failed to save label masuk:', error)
      toast.error(error.response?.data?.message || 'Failed to save data')
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      tanggal: format(new Date(item.tanggal), 'yyyy-MM-dd'),
      no_spk: item.no_spk,
      no_lps: item.no_lps || '',
      part_number: item.part_number,
      nama_item: item.nama_item,
      jumlah_order: item.jumlah_order,
      customer: item.customer || ''
    })
    setShowAddModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      await api.delete(`/stoklabel/masuk/${id}`)
      toast.success('Label masuk deleted successfully')
      fetchLabelMasuk()
    } catch (error) {
      console.error('Failed to delete label masuk:', error)
      toast.error('Failed to delete item')
    }
  }

  const resetForm = () => {
    setFormData({
      tanggal: '',
      no_spk: '',
      no_lps: '',
      part_number: '',
      nama_item: '',
      jumlah_order: '',
      customer: ''
    })
  }

  const filteredItems = labelMasuk.filter(item =>
    item.no_spk.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Label Masuk</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">Kelola data label yang masuk</p>
        </div>
        <Button
          app="stoklabel"
          variant="primary"
          onClick={() => setShowAddModal(true)}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Label Masuk
        </Button>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Cari SPK, part number, nama item, atau customer..."
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
                  No SPK
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  No LPS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Part Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Jumlah Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Customer
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
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-400 dark:text-slate-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{item.no_spk}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">{item.no_lps || '-'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{item.part_number}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-white">{item.nama_item}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">{item.jumlah_order}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 dark:text-slate-500 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">{item.customer || '-'}</span>
                    </div>
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
            <Package className="h-16 w-16 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-slate-400">Tidak ada label masuk ditemukan</p>
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
                  {editingItem ? 'Edit Label Masuk' : 'Tambah Label Masuk Baru'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingItem(null)
                    resetForm()
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
                  label="Tanggal"
                  type="date"
                  required
                  value={formData.tanggal}
                  onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                />
                
                <Input
                  label="No SPK"
                  type="text"
                  required
                  value={formData.no_spk}
                  onChange={(e) => setFormData({...formData, no_spk: e.target.value})}
                  placeholder="Masukkan nomor SPK"
                />
              </div>
              
              <Input
                label="No LPS"
                type="text"
                value={formData.no_lps}
                onChange={(e) => setFormData({...formData, no_lps: e.target.value})}
                placeholder="Opsional"
                helperText="Nomor LPS jika tersedia"
              />
              
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
                  label="Jumlah Order"
                  type="text"
                  required
                  value={formData.jumlah_order}
                  onChange={(e) => setFormData({...formData, jumlah_order: e.target.value})}
                  placeholder="Contoh: 1000 pcs"
                />
                
                <Input
                  label="Customer"
                  type="text"
                  value={formData.customer}
                  onChange={(e) => setFormData({...formData, customer: e.target.value})}
                  placeholder="Opsional"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-slate-700">
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
                  {editingItem ? 'Update Label' : 'Tambah Label Masuk'}
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

export default StoklabelMasuk