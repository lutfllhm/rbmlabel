import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Package, Search, Filter } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Input from '../../../components/ui/Input'
import api from '../../../services/api'
import toast from 'react-hot-toast'

const MaterialStock = () => {
  const [materials, setMaterials] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const [formData, setFormData] = useState({
    no_po: '',
    tanggal: new Date().toISOString().split('T')[0],
    nama_material: '',
    ukuran: '',
    kategori_id: '',
    supplier: '',
    jumlah_roll: ''
  })

  useEffect(() => {
    fetchMaterials()
    fetchCategories()
  }, [])

  const fetchMaterials = async () => {
    try {
      const response = await api.get('/material/stock')
      setMaterials(response.data)
    } catch (error) {
      console.error('Failed to fetch materials:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/material/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingMaterial) {
        await api.put(`/material/stock/${editingMaterial.id}`, formData)
        toast.success('Material updated successfully')
      } else {
        await api.post('/material/stock', formData)
        toast.success('Material added successfully')
      }
      
      setShowModal(false)
      setEditingMaterial(null)
      resetForm()
      fetchMaterials()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed')
    }
  }

  const handleEdit = (material) => {
    setEditingMaterial(material)
    setFormData({
      no_po: material.no_po,
      tanggal: material.tanggal,
      nama_material: material.nama_material,
      ukuran: material.ukuran,
      kategori_id: material.kategori_id,
      supplier: material.supplier,
      jumlah_roll: material.jumlah_roll
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this material?')) return
    
    try {
      await api.delete(`/material/stock/${id}`)
      toast.success('Material deleted successfully')
      fetchMaterials()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Delete failed')
    }
  }

  const resetForm = () => {
    setFormData({
      no_po: '',
      tanggal: new Date().toISOString().split('T')[0],
      nama_material: '',
      ukuran: '',
      kategori_id: '',
      supplier: '',
      jumlah_roll: ''
    })
  }

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.nama_material.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.no_po.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || material.kategori_id.toString() === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Hitung total roll untuk material yang sama (nama dan kategori sama)
  const calculateTotalRoll = (material) => {
    return materials
      .filter(m => 
        m.nama_material === material.nama_material && 
        m.kategori_id === material.kategori_id
      )
      .reduce((total, m) => total + parseFloat(m.jumlah_roll || 0), 0)
  }

  // Format angka tanpa desimal jika bulat, atau dengan desimal jika ada
  const formatNumber = (num) => {
    const number = parseFloat(num)
    return number % 1 === 0 ? Math.floor(number) : number.toFixed(2).replace(/\.?0+$/, '')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-material-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Material Stock</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">Kelola stok material produksi</p>
        </div>
        <Button
          app="material"
          variant="primary"
          onClick={() => {
            setEditingMaterial(null)
            resetForm()
            setShowModal(true)
          }}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Material
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 h-4 w-4" />
              <input
                type="text"
                placeholder="Cari material..."
                className="w-full pl-12 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-material-500 dark:focus:ring-material-400 focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-material-500 dark:focus:ring-material-400 focus:border-transparent transition-all duration-200"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Materials Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Material
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  PO / Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Stok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Total Roll
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
              {filteredMaterials.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-material-100 dark:bg-material-900/20 rounded-lg flex items-center justify-center mr-3">
                        <Package className="h-5 w-5 text-material-600 dark:text-material-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {material.nama_material}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-slate-400">
                          {material.ukuran}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{material.no_po}</div>
                    <div className="text-sm text-gray-500 dark:text-slate-400">
                      {new Date(material.tanggal).toLocaleDateString('id-ID')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge app="material">
                      {material.kategori_name}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {material.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatNumber(material.jumlah_roll)} Roll
                    </div>
                    <div className="text-sm text-gray-500 dark:text-slate-400">
                      {formatNumber(material.jumlah_meter)} Meter
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-material-600 dark:text-material-400">
                      {formatNumber(calculateTotalRoll(material))} Roll
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">
                      Total {material.nama_material}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(material)}
                        className="text-material-600 dark:text-material-400 hover:text-material-700 dark:hover:text-material-300 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(material.id)}
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

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-slate-400">Tidak ada material ditemukan</p>
          </div>
        )}
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingMaterial ? 'Edit Material' : 'Tambah Material Baru'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
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
                    label="No PO"
                    type="text"
                    required
                    value={formData.no_po}
                    onChange={(e) => setFormData({...formData, no_po: e.target.value})}
                    placeholder="Masukkan nomor PO"
                  />

                  <Input
                    label="Tanggal"
                    type="date"
                    required
                    value={formData.tanggal}
                    onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Nama Material"
                    type="text"
                    required
                    value={formData.nama_material}
                    onChange={(e) => setFormData({...formData, nama_material: e.target.value})}
                    placeholder="Masukkan nama material"
                  />

                  <Input
                    label="Ukuran"
                    type="text"
                    required
                    value={formData.ukuran}
                    onChange={(e) => setFormData({...formData, ukuran: e.target.value})}
                    placeholder="Contoh: 100x200 cm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Kategori <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-material-500 dark:focus:ring-material-400 focus:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-slate-500"
                      value={formData.kategori_id}
                      onChange={(e) => setFormData({...formData, kategori_id: e.target.value})}
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Supplier"
                    type="text"
                    required
                    value={formData.supplier}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    placeholder="Nama supplier"
                  />
                </div>

                <Input
                  label="Jumlah Roll"
                  type="number"
                  min="1"
                  required
                  value={formData.jumlah_roll}
                  onChange={(e) => setFormData({...formData, jumlah_roll: e.target.value})}
                  placeholder="0"
                  helperText="Masukkan jumlah dalam satuan roll"
                />

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-slate-700">
                  <Button
                    type="button"
                    app="material"
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit" app="material" variant="primary">
                    {editingMaterial ? 'Update Material' : 'Tambah Material'}
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

export default MaterialStock