import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Package, Search } from 'lucide-react'
import AppPageHero from '../../../components/layout/AppPageHero'
import Card from '../../../components/ui/Card'
import PageLoading from '../../../components/ui/PageLoading'
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
    return <PageLoading app="material" />
  }

  return (
    <div className="space-y-8">
      <AppPageHero
        app="material"
        eyebrow="Stok"
        title="Material Stock"
        description="Kelola stok material produksi — cari, filter kategori, dan kelola roll."
      >
        <Button
          app="material"
          variant="primary"
          onClick={() => {
            setEditingMaterial(null)
            resetForm()
            setShowModal(true)
          }}
          className="gap-2 rounded-xl shadow-lg shadow-material-600/15"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Tambah Material
        </Button>
      </AppPageHero>

      <Card className="p-5 shadow-md shadow-slate-200/25 ring-1 ring-slate-100/80 dark:shadow-black/20 dark:ring-white/[0.04] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1 space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Cari Material
            </label>
            <input
              type="text"
              placeholder="Cari material..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-material-500 focus:outline-none focus:ring-2 focus:ring-material-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-500 dark:focus:border-material-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:w-48">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Kategori
            </label>
            <select
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900 shadow-sm transition-all hover:border-slate-300 focus:border-material-500 focus:outline-none focus:ring-2 focus:ring-material-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-500 dark:focus:border-material-400"
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

      <Card className="overflow-hidden shadow-md shadow-slate-200/25 ring-1 ring-slate-100/80 dark:shadow-black/25 dark:ring-white/[0.04]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100/90 dark:from-slate-800 dark:to-slate-800/95">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Material
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  PO / Tanggal
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Kategori
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Supplier
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Stok
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Total Roll
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900/50">
              {filteredMaterials.map((material) => (
                <tr key={material.id} className="transition-colors hover:bg-slate-50/90 dark:hover:bg-slate-800/60">
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-full w-full items-start justify-center px-4 py-8 md:px-6 md:py-10 lg:px-8">
            <div className="w-full max-w-7xl">
            <Card className="relative my-auto flex w-full flex-col shadow-xl dark:shadow-black/20">
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-slate-50/80 px-5 pt-5 pb-4 dark:border-slate-800 dark:bg-slate-800/50 sm:px-6 sm:pt-6">
                <h3 className="pr-2 text-lg font-semibold tracking-tight text-slate-900 dark:text-white sm:text-xl">
                  {editingMaterial ? 'Edit material' : 'Tambah material baru'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Tutup
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 [&>*]:min-w-0">
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

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 [&>*]:min-w-0">
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

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 [&>*]:min-w-0">
                  <div className="min-w-0">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Kategori <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-material-500 focus:outline-none focus:ring-2 focus:ring-material-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
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
                </div>

                <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-slate-200 bg-slate-50/80 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/50 sm:px-6">
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
            </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MaterialStock