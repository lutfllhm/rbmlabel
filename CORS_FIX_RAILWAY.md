# 🔧 CORS Fix untuk Railway

## ✅ Code Sudah Dipush ke GitHub

Railway akan auto-redeploy backend service.

## 📋 Backend Variables yang HARUS Ada

**Railway Dashboard → Backend Service → Variables → Raw Editor**

```env
NODE_ENV=production
PORT=5000

DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=railway
SQL_FILE_PATH=/app/server/database/rbm_combined.sql
FORCE_DB_INIT=true

JWT_SECRET=09ee1f18127fcb5ef381397098c5a2c768a37ee6ab6186b063aa54f352dc42e7bcf4eb96598e53a5e1ea800cc8f64052439f5c048221d4393d8035c2ee8f9c5e
JWT_EXPIRE=7d
JWT_EXPIRES_IN=24h

CORS_ORIGIN=https://rbmlabel.up.railway.app
CLIENT_URL=https://rbmlabel.up.railway.app

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

EDITOR_MAX_SIZE=100000
EDITOR_ALLOWED_FORMATS=json,xml,html,txt,markdown
EDITOR_AUTOSAVE_INTERVAL=30000
EDITOR_VERSION_LIMIT=50
```

⚠️ **PENTING:** 
- `CORS_ORIGIN` harus URL frontend: `https://rbmlabel.up.railway.app`
- Tanpa trailing slash
- Harus HTTPS

## 📋 Frontend Variables yang HARUS Ada

**Railway Dashboard → Frontend Service → Variables → Raw Editor**

```env
VITE_API_URL=https://rbmlabel-production.up.railway.app/api
VITE_APP_NAME=RBM System
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=production
NODE_ENV=production
```

⚠️ **PENTING:**
- `VITE_API_URL` harus URL backend: `https://rbmlabel-production.up.railway.app/api`
- Harus diakhiri `/api`
- Harus HTTPS

## 🚀 Steps Setelah Push

### 1. Tunggu Auto-Deploy Backend
1. Buka Railway Dashboard
2. Klik Backend Service (rbmlabel-production)
3. Tab "Deployments"
4. Tunggu deployment selesai (2-5 menit)
5. Status harus: "Success"

### 2. Cek Deploy Logs
Setelah deployment selesai, cek logs harusnya muncul:
```
🚀 Server running on port 5000
📱 Client URL: https://rbmlabel.up.railway.app
🌍 Environment: production
🔒 CORS Origins: https://rbmlabel.up.railway.app
```

### 3. Verifikasi CORS_ORIGIN Variable
**Backend Service → Variables**

Pastikan ada:
```
CORS_ORIGIN=https://rbmlabel.up.railway.app
```

Jika belum ada atau salah, tambahkan/edit dan save.

### 4. Test Backend Health
Buka di browser:
```
https://rbmlabel-production.up.railway.app/api/health
```

Harusnya muncul JSON response.

### 5. Test Login
1. Buka: `https://rbmlabel.up.railway.app/`
2. Hard refresh: Ctrl+Shift+R
3. Login: `admin` / `iware123`
4. Harusnya berhasil tanpa CORS error

## 🔍 Troubleshooting

### Masih CORS Error Setelah Deploy?

**Check 1: Verifikasi CORS_ORIGIN**
```
Backend Variables → CORS_ORIGIN = https://rbmlabel.up.railway.app
```
- Harus HTTPS
- Tanpa trailing slash
- Exact match dengan frontend URL

**Check 2: Cek Deploy Logs**
```
🔒 CORS Origins: https://rbmlabel.up.railway.app
```
Jika masih `*` atau URL lain, berarti variable belum apply.

**Check 3: Hard Refresh Browser**
```
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

**Check 4: Clear Browser Cache**
1. F12 → Application → Clear Storage
2. Clear site data
3. Refresh

**Check 5: Test di Incognito**
Buka incognito window dan test login.

### Backend Tidak Auto-Deploy?

**Manual Redeploy:**
1. Backend Service → Deployments
2. Klik "..." pada deployment terakhir
3. Klik "Redeploy"

### Variable Tidak Apply?

**Force Redeploy:**
1. Edit variable (tambah spasi atau apapun)
2. Save
3. Undo edit
4. Save lagi
5. Atau klik "Redeploy"

## ✅ Checklist

- [ ] Code sudah dipush ke GitHub
- [ ] Backend auto-deploy selesai
- [ ] `CORS_ORIGIN=https://rbmlabel.up.railway.app` ada di backend variables
- [ ] `CLIENT_URL=https://rbmlabel.up.railway.app` ada di backend variables
- [ ] `VITE_API_URL=https://rbmlabel-production.up.railway.app/api` ada di frontend variables
- [ ] Deploy logs menunjukkan CORS Origins yang benar
- [ ] Backend health check berhasil
- [ ] Hard refresh browser
- [ ] Login berhasil tanpa CORS error

## 🎉 Selesai!

Jika semua checklist ✅, CORS error sudah fixed dan login harusnya berhasil!
