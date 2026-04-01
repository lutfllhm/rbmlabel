import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  FileText,
  Calendar,
  User,
  Package,
  Eye,
  Printer,
} from 'lucide-react'
import AppPageHero from '../../../components/layout/AppPageHero'
import Card from '../../../components/ui/Card'
import PageLoading from '../../../components/ui/PageLoading'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import api from '../../../services/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const StoklabelSuratJalan = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [suratJalan, setSuratJalan] = useState([])
  const [labelKeluar, setLabelKeluar] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedSuratJalan, setSelectedSuratJalan] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    no_delivery: '',
    customer: '',
    tanggal: '',
    selectedItems: []
  })

  useEffect(() => {
    fetchSuratJalan()
    fetchLabelKeluar()
    if (searchParams.get('action') === 'create') {
      setShowAddModal(true)
      setSearchParams({})
    }
  }, [searchParams, setSearchParams])

  const fetchSuratJalan = async () => {
    try {
      const response = await api.get('/stoklabel/surat-jalan')
      setSuratJalan(response.data)
    } catch (error) {
      console.error('Failed to fetch surat jalan:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const fetchLabelKeluar = async () => {
    try {
      const response = await api.get('/stoklabel/keluar?available=true')
      setLabelKeluar(response.data)
    } catch (error) {
      console.error('Failed to fetch label keluar:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.selectedItems.length === 0) {
      toast.error('Please select at least one item')
      return
    }
    
    try {
      const payload = {
        ...formData,
        items: formData.selectedItems
      }
      
      if (editingItem) {
        await api.put(`/stoklabel/surat-jalan/${editingItem.id}`, payload)
        toast.success('Surat jalan updated successfully')
      } else {
        await api.post('/stoklabel/surat-jalan', payload)
        toast.success('Surat jalan created successfully')
      }
      
      setShowAddModal(false)
      setEditingItem(null)
      resetForm()
      fetchSuratJalan()
      fetchLabelKeluar()
    } catch (error) {
      console.error('Failed to save surat jalan:', error)
      toast.error(error.response?.data?.message || 'Failed to save data')
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      no_delivery: item.no_delivery,
      customer: item.customer,
      tanggal: format(new Date(item.tanggal), 'yyyy-MM-dd'),
      selectedItems: item.items || []
    })
    setShowAddModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this surat jalan?')) return
    
    try {
      await api.delete(`/stoklabel/surat-jalan/${id}`)
      toast.success('Surat jalan deleted successfully')
      fetchSuratJalan()
      fetchLabelKeluar()
    } catch (error) {
      console.error('Failed to delete surat jalan:', error)
      toast.error('Failed to delete item')
    }
  }

  const handleViewDetail = async (suratJalanId) => {
    try {
      const response = await api.get(`/stoklabel/surat-jalan/${suratJalanId}`)
      setSelectedSuratJalan(response.data)
      setShowDetailModal(true)
    } catch (error) {
      console.error('Failed to fetch surat jalan detail:', error)
      toast.error('Failed to load detail')
    }
  }

  const handlePrint = (suratJalanId) => {
    // Open print view in new window
    window.open(`/print/surat-jalan/${suratJalanId}`, '_blank')
  }

  const toggleItemSelection = (itemId) => {
    const isSelected = formData.selectedItems.includes(itemId)
    if (isSelected) {
      setFormData({
        ...formData,
        selectedItems: formData.selectedItems.filter(id => id !== itemId)
      })
    } else {
      setFormData({
        ...formData,
        selectedItems: [...formData.selectedItems, itemId]
      })
    }
  }

  const resetForm = () => {
    setFormData({
      no_delivery: '',
      customer: '',
      tanggal: '',
      selectedItems: []
    })
  }

  const filteredItems = suratJalan.filter(item =>
    item.no_delivery.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.customer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <PageLoading app="stoklabel" />
  }

  return (
    <div className="space-y-8">
      <AppPageHero
        app="stoklabel"
        eyebrow="Dokumen"
        title="Surat jalan"
        description="Gabungkan label keluar ke satu surat jalan — siap cetak dan lacak."
      >
        <Button
          app="stoklabel"
          variant="primary"
          onClick={() => setShowAddModal(true)}
          className="gap-2 rounded-xl shadow-lg shadow-stoklabel-600/20"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Buat surat jalan
        </Button>
      </AppPageHero>

      <Card className="p-5 shadow-md shadow-slate-200/25 ring-1 ring-slate-100/80 dark:shadow-black/20 dark:ring-white/[0.04] sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Cari nomor delivery atau customer..."
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
                  No Delivery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Items Count
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900/50">
              {filteredItems.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-slate-50/90 dark:hover:bg-slate-800/60">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-400 dark:text-slate-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{item.no_delivery}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 dark:text-slate-500 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">{item.customer}</span>
                    </div>
                  </td>
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
                      <Package className="h-4 w-4 text-gray-400 dark:text-slate-500 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">{item.items_count || 0} items</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetail(item.id)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handlePrint(item.id)}
                        className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                        title="Print"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-stoklabel-600 dark:text-stoklabel-400 hover:text-stoklabel-700 dark:hover:text-stoklabel-300 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                        title="Hapus"
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
            <FileText className="h-16 w-16 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-slate-400">Tidak ada surat jalan ditemukan</p>
          </div>
        )}
      </Card>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {editingItem ? 'Edit Surat Jalan' : 'Buat Surat Jalan Baru'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="No Delivery"
                    type="text"
                    required
                    value={formData.no_delivery}
                    onChange={(e) => setFormData({...formData, no_delivery: e.target.value})}
                  />
                  
                  <Input
                    label="Customer"
                    type="text"
                    required
                    value={formData.customer}
                    onChange={(e) => setFormData({...formData, customer: e.target.value})}
                  />
                  
                  <Input
                    label="Tanggal"
                    type="date"
                    required
                    value={formData.tanggal}
                    onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                    Pilih Items untuk Disertakan
                  </label>
                  <div className="border border-gray-300 dark:border-slate-600 rounded-lg max-h-64 overflow-y-auto bg-white dark:bg-slate-800">
                    {labelKeluar.length > 0 ? (
                      <div className="divide-y divide-gray-200 dark:divide-slate-700">
                        {labelKeluar.map((item) => (
                          <div key={item.id} className="p-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.selectedItems.includes(item.id)}
                                onChange={() => toggleItemSelection(item.id)}
                                className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-stoklabel-600 focus:ring-stoklabel-500 dark:focus:ring-stoklabel-400"
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                      {item.part_number} - {item.nama_item}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">
                                      Customer: {item.customer || 'N/A'} | Qty: {item.jumlah}
                                    </p>
                                  </div>
                                  <span className="text-xs text-gray-400 dark:text-slate-500">
                                    {format(new Date(item.tanggal), 'dd/MM/yyyy')}
                                  </span>
                                </div>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500 dark:text-slate-400">
                        <Package className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-slate-600" />
                        <p>Tidak ada label keluar tersedia</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-slate-700">
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
                    {editingItem ? 'Update' : 'Buat'} Surat Jalan
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedSuratJalan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Detail Surat Jalan
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-slate-400">No Delivery</label>
                    <p className="text-gray-900 dark:text-white font-semibold">{selectedSuratJalan.no_delivery}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-slate-400">Customer</label>
                    <p className="text-gray-900 dark:text-white font-semibold">{selectedSuratJalan.customer}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-slate-400">Tanggal</label>
                    <p className="text-gray-900 dark:text-white font-semibold">
                      {format(new Date(selectedSuratJalan.tanggal), 'dd/MM/yyyy')}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2 block">Items</label>
                  <div className="border border-gray-200 dark:border-slate-700 rounded-lg divide-y divide-gray-200 dark:divide-slate-700">
                    {selectedSuratJalan.items?.map((item, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-slate-800">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {item.part_number} - {item.nama_item}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-slate-400">Qty: {item.jumlah}</p>
                          </div>
                        </div>
                      </div>
                    )) || (
                      <div className="p-4 text-center text-gray-500 dark:text-slate-400">
                        Tidak ada items
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-slate-700 mt-6">
                <Button
                  app="stoklabel"
                  variant="primary"
                  onClick={() => handlePrint(selectedSuratJalan.id)}
                  className="flex items-center"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button
                  app="stoklabel"
                  variant="secondary"
                  onClick={() => setShowDetailModal(false)}
                >
                  Tutup
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default StoklabelSuratJalan