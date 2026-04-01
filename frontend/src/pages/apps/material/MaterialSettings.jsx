import { useState, useEffect } from 'react'
import { Save, Settings as SettingsIcon, Bell, Database, Shield, CheckCircle } from 'lucide-react'
import AppPageHero from '../../../components/layout/AppPageHero'
import Card from '../../../components/ui/Card'
import PageLoading from '../../../components/ui/PageLoading'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import api from '../../../services/api'
import toast from 'react-hot-toast'

const MaterialSettings = () => {
  const [initialLoad, setInitialLoad] = useState(true)
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    // General Settings
    app_name: 'Material Management',
    items_per_page: 10,
    date_format: 'dd/MM/yyyy',
    
    // Notification Settings
    email_notifications: true,
    low_stock_alert: true,
    spk_completion_alert: true,
    
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
      const response = await api.get('/material/settings')
      if (response.data) {
        setSettings(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setInitialLoad(false)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      await api.put('/material/settings', settings)
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

  const fieldClass =
    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-material-500 focus:outline-none focus:ring-2 focus:ring-material-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100'

  if (initialLoad) {
    return <PageLoading app="material" label="Memuat pengaturan…" />
  }

  return (
    <div className="space-y-8">
      <AppPageHero
        app="material"
        eyebrow="Sistem"
        title="Pengaturan Material"
        description="Konfigurasi umum, notifikasi, keamanan, dan cadangan data untuk modul Material."
      >
        <Button
          app="material"
          variant="primary"
          onClick={handleSave}
          disabled={loading}
          className="gap-2 rounded-xl shadow-lg shadow-material-600/15"
        >
          {loading ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <Save className="h-4 w-4" strokeWidth={2} />
          )}
          {loading ? 'Menyimpan…' : 'Simpan pengaturan'}
        </Button>
      </AppPageHero>

      <Card className="overflow-hidden shadow-md shadow-slate-200/25 ring-1 ring-slate-100/80 dark:shadow-black/20 dark:ring-white/[0.04]">
        <div className="flex items-center gap-3 border-b border-slate-200 bg-gradient-to-r from-slate-50/90 to-white px-6 py-4 dark:border-slate-800 dark:from-slate-800/40 dark:to-slate-900/40">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <SettingsIcon className="h-5 w-5" strokeWidth={2} />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Pengaturan umum</h2>
        </div>
        <div className="space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Nama aplikasi</label>
            <input
              type="text"
              value={settings.app_name}
              onChange={(e) => handleChange('app_name', e.target.value)}
              className={fieldClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Item per halaman</label>
              <select
                value={settings.items_per_page}
                onChange={(e) => handleChange('items_per_page', parseInt(e.target.value))}
                className={fieldClass}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Format tanggal</label>
              <select
                value={settings.date_format}
                onChange={(e) => handleChange('date_format', e.target.value)}
                className={fieldClass}
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
      <Card className="overflow-hidden shadow-md shadow-slate-200/25 ring-1 ring-slate-100/80 dark:shadow-black/20 dark:ring-white/[0.04]">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50/90 to-white p-6 dark:border-slate-700 dark:from-slate-800/40 dark:to-slate-900/40">
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
              <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-material-300 dark:peer-focus:ring-material-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-material-600 dark:peer-checked:bg-material-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Alert Stok Rendah</p>
              <p className="text-sm text-gray-500 dark:text-slate-400">Notifikasi saat stok material rendah</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.low_stock_alert}
                onChange={(e) => handleChange('low_stock_alert', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-material-300 dark:peer-focus:ring-material-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-material-600 dark:peer-checked:bg-material-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Alert SPK Selesai</p>
              <p className="text-sm text-gray-500 dark:text-slate-400">Notifikasi saat SPK selesai</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.spk_completion_alert}
                onChange={(e) => handleChange('spk_completion_alert', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-material-300 dark:peer-focus:ring-material-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-material-600 dark:peer-checked:bg-material-500"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="overflow-hidden shadow-md shadow-slate-200/25 ring-1 ring-slate-100/80 dark:shadow-black/20 dark:ring-white/[0.04]">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50/90 to-white p-6 dark:border-slate-700 dark:from-slate-800/40 dark:to-slate-900/40">
          <div className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
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
              <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-material-300 dark:peer-focus:ring-material-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-material-600 dark:peer-checked:bg-material-500"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Database Settings */}
      <Card className="overflow-hidden shadow-md shadow-slate-200/25 ring-1 ring-slate-100/80 dark:shadow-black/20 dark:ring-white/[0.04]">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50/90 to-white p-6 dark:border-slate-700 dark:from-slate-800/40 dark:to-slate-900/40">
          <div className="flex items-center">
            <Database className="mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" />
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
              <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-material-300 dark:peer-focus:ring-material-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-material-600 dark:peer-checked:bg-material-500"></div>
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
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-material-500 dark:focus:ring-material-400 focus:border-transparent transition-all duration-200"
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

export default MaterialSettings
