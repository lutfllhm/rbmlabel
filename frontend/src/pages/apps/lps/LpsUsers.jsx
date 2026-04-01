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
  XCircle
} from 'lucide-react'
import AppPageHero from '../../../components/layout/AppPageHero'
import Card from '../../../components/ui/Card'
import PageLoading from '../../../components/ui/PageLoading'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Input from '../../../components/ui/Input'
import Modal from '../../../components/ui/Modal'
import api from '../../../services/api'
import toast from 'react-hot-toast'

const LpsUsers = () => {
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
      const response = await api.get('/lps/users')
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
        await api.post('/lps/users', formData)
        toast.success('Pengguna berhasil ditambahkan')
      } else {
        await api.put(`/lps/users/${selectedUser.id}`, formData)
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
      await api.delete(`/lps/users/${selectedUser.id}`)
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
    return <PageLoading app="lps" />
  }

  return (
    <div className="space-y-8">
      <AppPageHero
        app="lps"
        eyebrow="Tim"
        title="Manajemen pengguna"
        description="Kelola akun untuk modul LPS — peran dan status aktif."
      >
        <Button
          app="lps"
          variant="primary"
          onClick={() => openModal('create')}
          className="gap-2 rounded-xl shadow-lg shadow-lps-600/25"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Tambah pengguna
        </Button>
      </AppPageHero>

      <Card className="p-5 shadow-md shadow-slate-200/25 ring-1 ring-slate-100/80 dark:shadow-black/20 dark:ring-white/[0.04] sm:p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Cari berdasarkan username atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-12 pr-4 text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-lps-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-lps-400"
          />
        </div>
      </Card>

      <Card className="overflow-hidden p-0 shadow-md shadow-slate-200/25 ring-1 ring-slate-100/80 dark:shadow-black/25 dark:ring-white/[0.04]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100/90 dark:from-slate-800 dark:to-slate-800/95">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900/50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="transition-colors duration-150 hover:bg-slate-50/90 dark:hover:bg-slate-800/60">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 dark:text-slate-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 dark:text-slate-500 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-gray-400 dark:text-slate-500 mr-2" />
                      <Badge variant={user.role === 'admin' ? 'warning' : 'info'}>
                        {user.role}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.is_active ? (
                      <Badge variant="success" className="inline-flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Aktif
                      </Badge>
                    ) : (
                      <Badge variant="danger" className="inline-flex items-center">
                        <XCircle className="w-3 h-3 mr-1" />
                        Nonaktif
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openModal('edit', user)}
                        className="text-lps-600 hover:text-lps-900 dark:text-lps-400 dark:hover:text-lps-300 transition-colors duration-150"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setShowDeleteModal(true)
                        }}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-150"
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-slate-400">Tidak ada pengguna ditemukan</p>
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
      >
        <form onSubmit={handleSubmit} className="space-y-5">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lps-500 dark:focus:ring-lps-400 focus:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-slate-500"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center rounded-xl border border-slate-200/80 bg-slate-50/90 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-lps-600 focus:ring-lps-500"
                />
                <label htmlFor="is_active" className="ml-3 text-sm font-medium text-gray-700 dark:text-slate-300">
                  Akun Aktif
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-6 dark:border-slate-700">
                <Button
                  type="button"
                  app="lps"
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
                  app="lps"
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
            app="lps"
            variant="secondary"
            onClick={() => {
              setShowDeleteModal(false)
              setSelectedUser(null)
            }}
          >
            Batal
          </Button>
          <Button app="lps" variant="danger" onClick={handleDelete}>
            Hapus
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default LpsUsers
