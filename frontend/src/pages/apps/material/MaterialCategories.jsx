import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Archive } from 'lucide-react'
import AppPageHero from '../../../components/layout/AppPageHero'
import Card from '../../../components/ui/Card'
import PageLoading from '../../../components/ui/PageLoading'
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
    return <PageLoading app="material" />
  }

  return (
    <div className="space-y-8">
      <AppPageHero
        app="material"
        eyebrow="Master data"
        title="Kategori material"
        description="Kelompokkan material agar filter dan laporan lebih rapi."
      >
        <Button
          app="material"
          variant="primary"
          onClick={() => {
            setEditingCategory(null)
            setFormData({ name: '' })
            setShowModal(true)
          }}
          className="gap-2 rounded-xl shadow-lg shadow-material-600/15"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Tambah kategori
        </Button>
      </AppPageHero>

      <Card className="overflow-hidden shadow-md shadow-slate-200/25 ring-1 ring-slate-100/80 dark:shadow-black/20 dark:ring-white/[0.04]">
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group rounded-2xl border border-slate-200/90 bg-white p-5 transition-all hover:border-material-300/80 hover:shadow-lg hover:shadow-slate-200/30 dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-material-600/50 dark:hover:shadow-black/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-material-100 transition-transform group-hover:scale-105 dark:bg-material-950/40">
                    <Archive className="h-6 w-6 text-material-600 dark:text-material-400" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{category.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Kategori</p>
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
            <Card className="relative my-auto w-full shadow-xl dark:shadow-black/20">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50/80 px-5 pt-5 pb-4 dark:border-slate-800 dark:bg-slate-800/50 sm:px-6 sm:pt-6">
                <h3 className="pr-2 text-lg font-semibold tracking-tight text-slate-900 dark:text-white sm:text-xl">
                  {editingCategory ? 'Edit kategori' : 'Tambah kategori baru'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
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

                <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
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