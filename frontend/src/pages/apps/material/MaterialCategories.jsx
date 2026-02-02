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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
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
                <Input
                  label="Nama Kategori"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Masukkan nama kategori"
                  helperText="Nama kategori harus unik dan deskriptif"
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
                    {editingCategory ? 'Update Kategori' : 'Tambah Kategori'}
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

export default MaterialCategories