# 🚀 Frontend Railway Setup Guide

## 📋 Variables untuk Railway Raw Editor

Copy paste ini ke **Frontend Service → Variables → Raw Editor**:

```env
VITE_API_URL=https://your-backend-service.up.railway.app/api
VITE_APP_NAME=RBM System
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=production
NODE_ENV=production
```

---

## ⚙️ Step-by-Step Setup

### 1. Dapatkan URL Backend Railway

1. Buka Railway Dashboard
2. Klik **Backend Service** (server)
3. Klik tab **"Settings"**
4. Scroll ke **"Networking"** → **"Public Networking"**
5. Copy domain yang muncul, contoh:
   ```
   rbm-backend-production.up.railway.app
   ```
6. Tambahkan `https://` di depan dan `/api` di belakang:
   ```
   https://rbm-backend-production.up.railway.app/api
   ```

### 2. Setup Frontend Service Variables

1. Buka Railway Dashboard
2. Klik **Frontend Service**
3. Klik tab **"Variables"**
4. Klik **"Raw Editor"**
5. Paste variabel berikut (ganti URL backend):

```env
VITE_API_URL=https://rbm-backend-production.up.railway.app/api
VITE_APP_NAME=RBM System
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=production
NODE_ENV=production
```

6. Klik **"Add"** atau **"Update"**
7. Frontend akan **auto-redeploy**

### 3. Verifikasi Deployment

1. Tunggu deployment selesai (2-5 menit)
2. Buka Frontend URL Railway
3. Buka **Browser Console** (F12)
4. Cek log:
   ```
   API Base URL: https://rbm-backend-production.up.railway.app/api
   Environment: production
   Is Development: false
   ```
5. Jika benar, frontend sudah tersambung ke backend!

---

## 🔍 Cara Kerja Koneksi Frontend-Backend

### Development (Local)
```javascript
// frontend/src/services/api.js
const isDevelopment = import.meta.env.MODE === 'development'
const baseURL = import.meta.env.VITE_API_URL || 
  (isDevelopment ? 'http://localhost:5000/api' : '/api')
```

**Local Development:**
- `VITE_API_URL` tidak diset
- `isDevelopment = true`
- `baseURL = 'http://localhost:5000/api'`
- Frontend connect ke backend local

### Production (Railway)
**Railway Production:**
- `VITE_API_URL = 'https://rbm-backend-production.up.railway.app/api'`
- `isDevelopment = false`
- `baseURL = 'https://rbm-backend-production.up.railway.app/api'`
- Frontend connect ke backend Railway

---

## 📦 Build Configuration

File `frontend/vite.config.js` sudah benar:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', '@headlessui/react', 'framer-motion']
        }
      }
    }
  }
})
```

✅ Tidak perlu diubah!

---

## 🔧 Troubleshooting

### ❌ Error: Network Error / CORS Error

**Penyebab:**
- URL backend salah
- Backend belum running
- CORS tidak dikonfigurasi

**Solusi:**
1. Cek `VITE_API_URL` di Railway variables
2. Pastikan backend service running
3. Cek backend logs untuk CORS errors
4. Pastikan backend `.env` punya:
   ```env
   CORS_ORIGIN=*
   # atau
   CORS_ORIGIN=https://your-frontend.railway.app
   ```

### ❌ Error: 404 Not Found

**Penyebab:**
- URL backend tidak lengkap (kurang `/api`)
- Backend route tidak ada

**Solusi:**
1. Pastikan `VITE_API_URL` diakhiri dengan `/api`
2. Test backend endpoint manual:
   ```bash
   curl https://your-backend.railway.app/api/health
   ```

### ❌ Frontend tidak update setelah ganti variables

**Solusi:**
1. Klik **"Redeploy"** di Railway
2. Atau push commit baru ke GitHub
3. Tunggu build selesai
4. Hard refresh browser (Ctrl+Shift+R)

### ❌ Console log masih menunjukkan localhost

**Penyebab:**
- Browser cache
- Build lama

**Solusi:**
1. Hard refresh (Ctrl+Shift+R)
2. Clear browser cache
3. Buka incognito/private window
4. Cek Railway deployment logs

---

## 🎯 Testing Koneksi

### 1. Test dari Browser Console

Buka frontend Railway, tekan F12, paste di console:

```javascript
// Test API connection
fetch('https://your-backend.railway.app/api/health')
  .then(r => r.json())
  .then(d => console.log('Backend Response:', d))
  .catch(e => console.error('Backend Error:', e))
```

### 2. Test Login

1. Buka frontend Railway
2. Login dengan:
   ```
   Username: admin
   Password: iware123
   ```
3. Jika berhasil login, koneksi sudah OK!

### 3. Test dari Network Tab

1. Buka frontend Railway
2. Tekan F12 → Tab "Network"
3. Refresh halaman
4. Cek request ke `/api/*`
5. Pastikan:
   - Status: 200 OK
   - Response: JSON data
   - Request URL: `https://your-backend.railway.app/api/...`

---

## 📊 Railway Service Structure

```
Railway Project
├── MySQL Service
│   └── Database: railway
│
├── Backend Service (server)
│   ├── URL: https://rbm-backend-production.up.railway.app
│   ├── Variables:
│   │   ├── DB_HOST=${{MySQL.MYSQLHOST}}
│   │   ├── JWT_SECRET=...
│   │   └── CORS_ORIGIN=*
│   └── Endpoints:
│       ├── /api/auth/login
│       ├── /api/auth/me
│       └── /api/...
│
└── Frontend Service
    ├── URL: https://rbm-frontend-production.up.railway.app
    ├── Variables:
    │   └── VITE_API_URL=https://rbm-backend-production.up.railway.app/api
    └── Connects to: Backend Service
```

---

## 🔐 Security Notes

### Development
```env
VITE_API_URL=http://localhost:5000/api  # OK untuk local
```

### Production
```env
VITE_API_URL=https://your-backend.railway.app/api  # Harus HTTPS!
```

⚠️ **PENTING:**
- Jangan hardcode API URL di code
- Selalu gunakan `import.meta.env.VITE_API_URL`
- Jangan commit `.env` ke Git
- Gunakan `.env.example` untuk template

---

## 📝 Checklist Deployment

- [ ] Backend service running di Railway
- [ ] Backend punya public domain
- [ ] Frontend variables sudah diset
- [ ] `VITE_API_URL` benar (https + /api)
- [ ] Frontend sudah redeploy
- [ ] Browser console tidak ada error
- [ ] Login berhasil
- [ ] API calls berhasil

---

## 🎉 Selesai!

Jika semua checklist ✅, frontend Anda sudah tersambung dengan backend Railway!

**Test dengan:**
1. Buka frontend Railway URL
2. Login dengan admin/iware123
3. Cek data muncul
4. Cek browser console tidak ada error

**Jika ada masalah:**
1. Cek Railway logs (Backend & Frontend)
2. Cek browser console
3. Cek Network tab
4. Verifikasi semua environment variables
