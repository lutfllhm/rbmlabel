# Implementasi Notifikasi Realtime dengan Socket.io

## Overview
Sistem notifikasi sekarang menggunakan WebSocket (Socket.io) untuk menerima notifikasi secara realtime tanpa perlu polling.

## Arsitektur

### Frontend
- **Socket Service** (`frontend/src/services/socket.js`): Mengelola koneksi WebSocket
- **Notification Store** (`frontend/src/stores/notificationStore.js`): State management dengan Zustand + Socket.io integration
- **App.jsx**: Inisialisasi socket saat user login

### Backend
- **Socket.io Server** (`server/index.js`): WebSocket server yang sudah terintegrasi
- **Room-based Broadcasting**: Notifikasi dikirim ke room spesifik (per user atau per app)

## Cara Kerja

### 1. Koneksi Socket
Saat user login, socket akan otomatis terkoneksi:
```javascript
// Di App.jsx
useEffect(() => {
  if (user?.id && user?.app) {
    initializeSocket(user.id, user.app)
  }
  return () => disconnectSocket()
}, [user?.id, user?.app])
```

### 2. Room System
User akan join ke 2 room:
- `user:{userId}` - Notifikasi personal untuk user tertentu
- `app:{appName}` - Notifikasi untuk semua user di app tertentu (material/stoklabel/lps)

### 3. Event Listeners
Socket mendengarkan 3 event:
- `notification:new` - Notifikasi baru masuk
- `notification:update` - Notifikasi diupdate (misal: dibaca)
- `notification:delete` - Notifikasi dihapus

## Cara Mengirim Notifikasi dari Backend

### Contoh 1: Kirim ke User Spesifik
```javascript
// Di route handler (misal: saat ada PO baru)
router.post('/material/po', authenticateToken, async (req, res) => {
  // ... create PO logic ...
  
  // Kirim notifikasi realtime
  req.io.to(`user:${userId}`).emit('notification:new', {
    id: notificationId,
    title: 'PO Baru Ditambahkan',
    message: `PO #${poNumber} telah ditambahkan ke sistem`,
    type: 'info',
    read: false,
    created_at: new Date().toISOString()
  })
  
  res.json({ success: true })
})
```

### Contoh 2: Kirim ke Semua User di App
```javascript
// Broadcast ke semua user Material app
req.io.to('app:material').emit('notification:new', {
  id: notificationId,
  title: 'Stok Rendah',
  message: 'Material ABC mencapai batas minimum',
  type: 'warning',
  read: false,
  created_at: new Date().toISOString()
})
```

### Contoh 3: Kirim ke Multiple Users
```javascript
// Kirim ke beberapa user sekaligus
const userIds = [1, 2, 3]
userIds.forEach(userId => {
  req.io.to(`user:${userId}`).emit('notification:new', {
    id: notificationId,
    title: 'Approval Diperlukan',
    message: 'SPK #123 menunggu approval Anda',
    type: 'info',
    read: false,
    created_at: new Date().toISOString()
  })
})
```

## Implementasi di Backend Routes

### 1. Buat Notification Helper
```javascript
// server/utils/notificationHelper.js
const sendNotification = (io, userId, notification) => {
  io.to(`user:${userId}`).emit('notification:new', {
    id: notification.id || Date.now(),
    title: notification.title,
    message: notification.message,
    type: notification.type || 'info', // info, success, warning, error
    read: false,
    created_at: new Date().toISOString(),
    ...notification
  })
}

const broadcastToApp = (io, appName, notification) => {
  io.to(`app:${appName}`).emit('notification:new', {
    id: notification.id || Date.now(),
    title: notification.title,
    message: notification.message,
    type: notification.type || 'info',
    read: false,
    created_at: new Date().toISOString(),
    ...notification
  })
}

module.exports = { sendNotification, broadcastToApp }
```

### 2. Gunakan di Routes
```javascript
const { sendNotification } = require('../utils/notificationHelper')

// Contoh: Material Stock Route
router.post('/stock', authenticateToken, async (req, res) => {
  try {
    // ... create stock logic ...
    
    // Kirim notifikasi ke admin
    const [admins] = await pool.execute(
      'SELECT id FROM users WHERE role = ? AND app = ?',
      ['admin', 'material']
    )
    
    admins.forEach(admin => {
      sendNotification(req.io, admin.id, {
        title: 'Stok Baru Ditambahkan',
        message: `${req.body.material_name} - ${req.body.quantity} roll`,
        type: 'success'
      })
    })
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
```

## Testing

### 1. Test dari Browser Console
```javascript
// Cek status koneksi
console.log('Socket connected:', socketService.isConnected())

// Manual emit (untuk testing)
socketService.emit('test-notification', { message: 'Hello' })
```

### 2. Test dari Backend
```javascript
// Di server console atau route handler
io.to('user:1').emit('notification:new', {
  id: Date.now(),
  title: 'Test Notification',
  message: 'This is a test',
  type: 'info',
  read: false,
  created_at: new Date().toISOString()
})
```

## Troubleshooting

### Socket tidak terkoneksi
1. Pastikan `socket.io-client` sudah terinstall di frontend
2. Cek console browser untuk error
3. Pastikan CORS sudah dikonfigurasi dengan benar di backend
4. Cek environment variable `VITE_API_URL`

### Notifikasi tidak muncul
1. Cek apakah user sudah join room dengan benar
2. Cek console untuk log "New notification received"
3. Pastikan event name sama persis (`notification:new`)
4. Cek apakah `req.io` tersedia di route handler

### Koneksi terputus
Socket.io akan otomatis reconnect dengan konfigurasi:
- Reconnection delay: 1 detik
- Max attempts: 5 kali
- Transports: WebSocket (primary), Polling (fallback)

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

### Backend (.env)
```env
CLIENT_URL=http://localhost:3000
PORT=5000
```

## Keuntungan Realtime Notifications

1. ✅ **Instant Updates**: Notifikasi muncul langsung tanpa delay
2. ✅ **Efisien**: Tidak perlu polling yang membebani server
3. ✅ **Scalable**: Bisa handle banyak user dengan room system
4. ✅ **Reliable**: Auto-reconnect jika koneksi terputus
5. ✅ **User Experience**: Toast notification otomatis muncul

## Next Steps

1. Implementasikan notifikasi di semua route yang relevan:
   - Material: PO baru, stok rendah, SPK dibuat
   - Stoklabel: Label masuk, label keluar, surat jalan
   - LPS: LPS baru, LPS selesai, approval

2. Tambahkan notifikasi database table (opsional):
   ```sql
   CREATE TABLE notifications (
     id INT PRIMARY KEY AUTO_INCREMENT,
     user_id INT NOT NULL,
     title VARCHAR(255) NOT NULL,
     message TEXT,
     type ENUM('info', 'success', 'warning', 'error'),
     read BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id)
   );
   ```

3. Buat API endpoints untuk notifikasi:
   - GET `/api/notifications` - List notifikasi
   - PUT `/api/notifications/:id/read` - Mark as read
   - DELETE `/api/notifications/:id` - Delete notifikasi

## Status Implementasi

- ✅ Socket.io service (frontend)
- ✅ Socket.io server (backend)
- ✅ Notification store integration
- ✅ Auto-connect on login
- ✅ Room-based broadcasting
- ✅ Toast notifications
- ⏳ Backend route integration (perlu implementasi per route)
- ⏳ Database persistence (opsional)

---

**Dibuat**: March 28, 2026  
**Status**: Ready for Implementation  
**Version**: 1.0
