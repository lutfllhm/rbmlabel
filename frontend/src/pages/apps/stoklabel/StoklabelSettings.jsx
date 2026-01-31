import { useState, useEffect } from 'react'
import { 
  Save, 
  Settings as SettingsIcon,
  Bell,
  Database,
  Shield,
  Mail,
  CheckCircle
} from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import api from '../../../services/api'
import toast from 'react-hot-toast'

const StoklabelSettings = () => {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    // General Settings
    app_name: 'Stoklabel Management',
    items_per_page: 10,
    date_format: 'dd/MM/yyyy',
    
    // Notification Settings
    email_notifications: true,
    low_stock_alert: true,
    delivery_alert: true,
    
    // Security Settings
    session_timeout: 30,
    password_min_length: 8,
    require_strong_password: true,
    
    // Database Settings
    auto_backup: true,
    backup_frequency: 'daily',
    retention_days: 30
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await api.get('/stoklabel/settings')
      if (response.data) {
        setSettings(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      await api.put('/stoklabel/settings', settings)
      toast.success('Pengaturan berhasil disimpan')
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast.error('Gagal menyimpan pengaturan')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pengaturan</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">Konfigurasi aplikasi Stoklabel Management</p>
        </div>
        <Button
          app="stoklabel"
          variant="primary"
          onClick={handleSave}
          disabled={loading}
          className="flex items-center"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </Button>
      </div>

      {/* General Settings */}
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <SettingsIcon className="w-5 h-5 text-gray-500 dark:text-slate-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Pengaturan Umum</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <Input
            label="Nama Aplikasi"
            type="text"
            value={settings.app_name}
            onChange={(e) => handleChange('app_name', e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Item per Halaman
              </label>
              <select
                value={settings.items_per_page}
                onChange={(e) => handleChange('items_per_page', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-stoklabel-500 dark:focus:ring-stoklabel-400 focus:border-transparent transition-all duration-200"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Format Tanggal
              </label>
              <select
                value={settings.date_format}
                onChange={(e) => handleChange('date_format', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-stoklabel-500 dark:focus:ring-stoklabel-400 focus:border-transparent transition-all duration-200"
              >
                <option value="dd/MM/yyyy">DD/MM/YYYY</option>
                <option value="MM/dd/yyyy">MM/DD/YYYY</option>
                <option value="yyyy-MM-dd">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <Bell className="w-5 h-5 text-gray-500 dark:text-slate-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notifikasi</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Notifikasi Email</p>
              <p className="text-sm text-gray-500 dark:text-slate-400">Kirim notifikasi melalui email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.email_notifications}
                onChange={(e) => handleChange('email_notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-stoklabel-300 dark:peer-focus:ring-stoklabel-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stoklabel-600 dark:peer-checked:bg-stoklabel-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Alert Stok Rendah</p>
              <p className="text-sm text-gray-500 dark:text-slate-400">Notifikasi saat stok label rendah</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.low_stock_alert}
                onChange={(e) => handleChange('low_stock_alert', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-stoklabel-300 dark:peer-focus:ring-stoklabel-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stoklabel-600 dark:peer-checked:bg-stoklabel-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Alert Pengiriman</p>
              <p className="text-sm text-gray-500 dark:text-slate-400">Notifikasi saat ada pengiriman baru</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.delivery_alert}
                onChange={(e) => handleChange('delivery_alert', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-stoklabel-300 dark:peer-focus:ring-stoklabel-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stoklabel-600 dark:peer-checked:bg-stoklabel-500"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-gray-500 dark:text-slate-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Keamanan</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <Input
            label="Session Timeout (menit)"
            type="number"
            value={settings.session_timeout}
            onChange={(e) => handleChange('session_timeout', parseInt(e.target.value))}
            min="5"
            max="120"
          />

          <Input
            label="Panjang Minimum Password"
            type="number"
            value={settings.password_min_length}
            onChange={(e) => handleChange('password_min_length', parseInt(e.target.value))}
            min="6"
            max="20"
          />

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Require Strong Password</p>
              <p className="text-sm text-gray-500 dark:text-slate-400">Password harus mengandung huruf besar, kecil, dan angka</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.require_strong_password}
                onChange={(e) => handleChange('require_strong_password', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-stoklabel-300 dark:peer-focus:ring-stoklabel-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stoklabel-600 dark:peer-checked:bg-stoklabel-500"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Database Settings */}
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <Database className="w-5 h-5 text-gray-500 dark:text-slate-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Database</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Auto Backup</p>
              <p className="text-sm text-gray-500 dark:text-slate-400">Backup database secara otomatis</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.auto_backup}
                onChange={(e) => handleChange('auto_backup', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-stoklabel-300 dark:peer-focus:ring-stoklabel-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stoklabel-600 dark:peer-checked:bg-stoklabel-500"></div>
            </label>
          </div>

          {settings.auto_backup && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Frekuensi Backup
                </label>
                <select
                  value={settings.backup_frequency}
                  onChange={(e) => handleChange('backup_frequency', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-stoklabel-500 dark:focus:ring-stoklabel-400 focus:border-transparent transition-all duration-200"
                >
                  <option value="hourly">Setiap Jam</option>
                  <option value="daily">Harian</option>
                  <option value="weekly">Mingguan</option>
                  <option value="monthly">Bulanan</option>
                </select>
              </div>

              <Input
                label="Retention Days"
                type="number"
                value={settings.retention_days}
                onChange={(e) => handleChange('retention_days', parseInt(e.target.value))}
                min="7"
                max="365"
                helperText={`Backup akan dihapus otomatis setelah ${settings.retention_days} hari`}
              />
            </>
          )}
        </div>
      </Card>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">Informasi</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
              <li>• Perubahan pengaturan akan diterapkan segera setelah disimpan</li>
              <li>• Beberapa pengaturan mungkin memerlukan refresh halaman</li>
              <li>• Backup database disimpan di server secara otomatis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoklabelSettings
