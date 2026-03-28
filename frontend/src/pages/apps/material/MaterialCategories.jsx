import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Archive } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import api from '../../../services/api'
import toast from 'react-hot-toast'

const MaterialCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({ name: '' })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/material/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingCategory) {
        await api.put(`/material/categories/${editingCategory.id}`, formData)
        toast.success('Kategori berhasil diupdate')
      } else {
        await api.post('/material/categories', formData)
        toast.success('Kategori berhasil ditambahkan')
      }
      
      setShowModal(false)
      setEditingCategory(null)
      setFormData({ name: '' })
      fetchCategories()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operasi gagal')
    }
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
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kategori Material</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">Kelola kategori material</p>
        </div>
        <Button
          app="material"
          variant="primary"
          onClick={() => {
            setEditingCategory(null)
            setFormData({ name: '' })
            setShowModal(true)
          }}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Kategori
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {categories.map((category) => (
            <div key={category.id} className="border-2 border-gray-200 dark:border-slate-700 rounded-xl p-5 hover:border-material-300 dark:hover:border-material-600 hover:shadow-lg transition-all group bg-white dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="w-12 h-12 bg-material-100 dark:bg-material-900/20 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Archive className="h-6 w-6 text-material-600 dark:text-material-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Kategori</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditingCategory(category)
                    setFormData({ name: category.name })
                    setShowModal(true)
                  }}
                  className="text-material-600 dark:text-material-400 hover:text-material-700 dark:hover:text-material-300 transition-colors"
                >
                  <Edit className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <Archive className="h-16 w-16 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-slate-400">Belum ada kategori</p>
          </div>
        )}
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-full w-full items-start justify-center px-4 py-8 md:px-6 md:py-10 lg:px-8">
            <div className="w-full max-w-7xl">
            <Card className="relative my-auto w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between gap-4 border-b-4 border-black bg-white px-5 pt-5 pb-4 dark:bg-slate-800 sm:px-6 sm:pt-6">
                <h3 className="pr-2 text-xl font-black uppercase tracking-tight text-black dark:text-white sm:text-2xl">
                  {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="shrink-0 border-4 border-black bg-yellow-300 px-3 py-1.5 text-sm font-black uppercase text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition hover:translate-x-[-2px] hover:translate-y-[-2px] dark:bg-yellow-400"
                >
                  Tutup
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-5 py-5 sm:px-6 sm:py-6">
                <div className="space-y-5">
                  <Input
                    label="Nama Kategori"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Masukkan nama kategori"
                    helperText="Nama kategori harus unik dan deskriptif"
                  />
                </div>

                <div className="mt-6 flex flex-wrap justify-end gap-3 border-t-4 border-black pt-4">
                  <Button
                    type="button"
                    app="material"
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit" app="material" variant="primary">
                    {editingCategory ? 'Update Kategori' : 'Tambah Kategori'}
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

export default MaterialCategories