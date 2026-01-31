import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import api from '../../../services/api'
import toast from 'react-hot-toast'

const LpsCreate = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    no_lps: '',
    nama_item: '',
    customer: '',
    jumlah_pcs: '',
    keterangan: '',
    status: 'pending'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.no_lps || !formData.nama_item || !formData.customer || !formData.jumlah_pcs) {
      toast.error('Mohon lengkapi semua field yang wajib diisi')
      return
    }

    try {
      setLoading(true)
      await api.post('/lps', formData)
      toast.success('LPS berhasil dibuat')
      navigate('/apps/lps/list')
    } catch (error) {
      console.error('Failed to create LPS:', error)
      if (error.response?.data?.error) {
        toast.error(error.response.data.error)
      } else {
        toast.error('Gagal membuat LPS')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const generateLpsNumber = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const time = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0')
    
    const lpsNumber = `LPS-${year}${month}${day}-${time}`
    setFormData(prev => ({
      ...prev,
      no_lps: lpsNumber
    }))
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/apps/lps/list')}
            className="flex items-center text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Kembali
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Buat LPS Baru</h1>
            <p className="text-gray-600 dark:text-slate-400 mt-1">Tambah laporan produksi selesai baru</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Informasi Dasar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  No LPS <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="no_lps"
                    value={formData.no_lps}
                    onChange={handleInputChange}
                    placeholder="Masukkan nomor LPS"
                    className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lps-500 dark:focus:ring-lps-400 focus:border-transparent transition-all duration-200"
                    required
                  />
                  <Button
                    type="button"
                    app="lps"
                    variant="secondary"
                    onClick={generateLpsNumber}
                  >
                    Generate
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lps-500 dark:focus:ring-lps-400 focus:border-transparent transition-all duration-200"
                >
                  <option value="pending">Pending</option>
                  <option value="progress">Progress</option>
                  <option value="finish">Selesai</option>
                </select>
              </div>

              <Input
                label="Nama Item *"
                type="text"
                name="nama_item"
                value={formData.nama_item}
                onChange={handleInputChange}
                placeholder="Masukkan nama item"
                required
              />

              <Input
                label="Customer *"
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                placeholder="Masukkan nama customer"
                required
              />

              <Input
                label="Jumlah PCS *"
                type="number"
                name="jumlah_pcs"
                value={formData.jumlah_pcs}
                onChange={handleInputChange}
                placeholder="Masukkan jumlah PCS"
                min="1"
                required
              />
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Informasi Tambahan</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Keterangan
              </label>
              <textarea
                name="keterangan"
                value={formData.keterangan}
                onChange={handleInputChange}
                rows={4}
                placeholder="Masukkan keterangan tambahan (opsional)"
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lps-500 dark:focus:ring-lps-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-slate-700">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/apps/lps/list')}
            >
              Batal
            </Button>
            <Button
              type="submit"
              app="lps"
              variant="primary"
              disabled={loading}
              className="flex items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Menyimpan...' : 'Simpan LPS'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Help Text */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Petunjuk Pengisian:</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <li>• No LPS harus unik dan tidak boleh sama dengan yang sudah ada</li>
          <li>• Gunakan tombol "Generate" untuk membuat nomor LPS otomatis</li>
          <li>• Jumlah PCS harus berupa angka positif</li>
          <li>• Status "Pending" untuk LPS yang baru dibuat</li>
          <li>• Status "Progress" untuk LPS yang sedang dikerjakan</li>
          <li>• Status "Selesai" untuk LPS yang sudah selesai diproduksi</li>
        </ul>
      </div>
    </div>
  )
}

export default LpsCreate