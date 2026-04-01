import { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  User,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import AppPageHero from '../../../components/layout/AppPageHero'
import Card from '../../../components/ui/Card'
import PageLoading from '../../../components/ui/PageLoading'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Modal from '../../../components/ui/Modal'
import api from '../../../services/api'
import toast from 'react-hot-toast'

const MaterialUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [modalMode, setModalMode] = useState('create')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    is_active: true
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/material/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('Gagal memuat data pengguna')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (modalMode === 'create') {
        await api.post('/material/users', formData)
        toast.success('Pengguna berhasil ditambahkan')
      } else {
        await api.put(`/material/users/${selectedUser.id}`, formData)
        toast.success('Pengguna berhasil diupdate')
      }
      
      setShowModal(false)
      resetForm()
      fetchUsers()
    } catch (error) {
      console.error('Failed to save user:', error)
      toast.error(error.response?.data?.error || 'Gagal menyimpan pengguna')
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/material/users/${selectedUser.id}`)
      toast.success('Pengguna berhasil dihapus')
      setShowDeleteModal(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (error) {
      console.error('Failed to delete user:', error)
      toast.error('Gagal menghapus pengguna')
    }
  }

  const openModal = (mode, user = null) => {
    setModalMode(mode)
    if (user) {
      setSelectedUser(user)
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
        role: user.role,
        is_active: user.is_active
      })
    } else {
      resetForm()
    }
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user',
      is_active: true
    })
    setSelectedUser(null)
    setModalMode('create')
  }

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <PageLoading app="material" />
  }

  return (
    <div className="space-y-8">
      <AppPageHero
        app="material"
        eyebrow="Tim"
        title="Manajemen pengguna"
        description="Kelola akun, peran, dan status aktif untuk modul Material."
      >
        <Button
          app="material"
          variant="primary"
          onClick={() => openModal('create')}
          className="gap-2 rounded-xl shadow-lg shadow-material-600/15"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Tambah pengguna
        </Button>
      </AppPageHero>

      <Card className="p-5 shadow-md shadow-slate-200/25 ring-1 ring-slate-100/80 dark:shadow-black/20 dark:ring-white/[0.04] sm:p-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Cari Pengguna
          </label>
          <input
            type="text"
            placeholder="Cari berdasarkan username atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-material-500 focus:outline-none focus:ring-2 focus:ring-material-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-500 dark:focus:border-material-400"
          />
        </div>
      </Card>

      <Card className="overflow-hidden p-0 shadow-md shadow-slate-200/25 ring-1 ring-slate-100/80 dark:shadow-black/25 dark:ring-white/[0.04]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100/90 dark:from-slate-800 dark:to-slate-800/95">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Username
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Email
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Role
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Status
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900/50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-slate-50/90 dark:hover:bg-slate-800/60">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-material-100 text-material-600 dark:bg-material-950/50 dark:text-material-400">
                        <User className="h-4 w-4" strokeWidth={2} />
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500" strokeWidth={2} />
                      <span className="text-sm text-slate-600 dark:text-slate-300">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-slate-400 dark:text-slate-500" strokeWidth={2} />
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.role === 'admin' 
                          ? 'bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300' 
                          : 'bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.is_active ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                        <CheckCircle className="h-3 w-3" strokeWidth={2} />
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/50 dark:text-red-300">
                        <XCircle className="h-3 w-3" strokeWidth={2} />
                        Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal('edit', user)}
                        className="rounded-lg p-2 text-material-600 transition hover:bg-material-50 dark:text-material-400 dark:hover:bg-material-950/30"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setShowDeleteModal(true)
                        }}
                        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <User className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
            <p className="text-slate-500 dark:text-slate-400">Tidak ada pengguna ditemukan</p>
          </div>
        )}
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          resetForm()
        }}
        title={modalMode === 'create' ? 'Tambah pengguna baru' : 'Edit pengguna'}
        size="sm"
        icon={modalMode === 'create' ? Plus : Edit}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <Input
              label="Username"
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="Masukkan username"
            />

            <Input
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="email@example.com"
            />

            <Input
              label={modalMode === 'edit' ? 'Password (kosongkan jika tidak ingin mengubah)' : 'Password'}
              type="password"
              required={modalMode === 'create'}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Masukkan password"
              helperText={modalMode === 'edit' ? 'Biarkan kosong untuk mempertahankan password lama' : 'Minimal 6 karakter'}
            />

            <Select
              label="Role"
              required
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Select>

            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:bg-slate-800/60">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-material-600 transition focus:ring-2 focus:ring-material-500/20 dark:border-slate-600"
              />
              <div className="flex-1">
                <label htmlFor="is_active" className="block cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Akun Aktif
                </label>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Pengguna dapat login dan mengakses sistem
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-700">
            <Button
              type="button"
              app="material"
              variant="secondary"
              onClick={() => {
                setShowModal(false)
                resetForm()
              }}
            >
              Batal
            </Button>
            <Button
              type="submit"
              app="material"
              variant="primary"
            >
              {modalMode === 'create' ? 'Tambah pengguna' : 'Perbarui pengguna'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedUser(null)
        }}
        title="Hapus pengguna"
        size="sm"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/35">
            <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" strokeWidth={2} />
          </div>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Hapus <strong className="text-slate-900 dark:text-white">{selectedUser?.username}</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            app="material"
            variant="secondary"
            onClick={() => {
              setShowDeleteModal(false)
              setSelectedUser(null)
            }}
          >
            Batal
          </Button>
          <Button app="material" variant="danger" onClick={handleDelete}>
            Hapus
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default MaterialUsers
