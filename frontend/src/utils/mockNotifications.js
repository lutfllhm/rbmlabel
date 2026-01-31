// Mock notifications untuk development
// Hapus file ini jika backend sudah siap

export const mockNotifications = [
  {
    id: 1,
    title: 'Stok Material Rendah',
    message: 'Material ABC123 stok tersisa 5 roll',
    type: 'warning',
    read: false,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString() // 5 minutes ago
  },
  {
    id: 2,
    title: 'SPK Baru Dibuat',
    message: 'SPK-20240128-001 telah dibuat untuk customer XYZ',
    type: 'success',
    read: false,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
  },
  {
    id: 3,
    title: 'Label Keluar',
    message: '100 roll label telah keluar untuk pengiriman',
    type: 'info',
    read: true,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    id: 4,
    title: 'LPS Selesai',
    message: 'LPS-20240128-001 telah selesai diproduksi',
    type: 'success',
    read: true,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  }
]

// Fungsi untuk generate mock notification baru
export const generateMockNotification = () => {
  const types = ['success', 'warning', 'error', 'info']
  const titles = [
    'Stok Material Rendah',
    'SPK Baru Dibuat',
    'Label Masuk',
    'Label Keluar',
    'LPS Selesai',
    'Surat Jalan Dibuat'
  ]
  const messages = [
    'Material stok tersisa sedikit',
    'SPK baru telah dibuat',
    'Label baru telah masuk',
    'Label telah keluar',
    'LPS telah selesai',
    'Surat jalan telah dibuat'
  ]

  return {
    id: Date.now(),
    title: titles[Math.floor(Math.random() * titles.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    type: types[Math.floor(Math.random() * types.length)],
    read: false,
    created_at: new Date().toISOString()
  }
}
