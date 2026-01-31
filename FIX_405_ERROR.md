# 🔧 Fix Error 405 - Method Not Allowed

## Masalah
Login gagal dengan error **405 (Method Not Allowed)** di endpoint `/api/auth/login`

## Penyebab
Static file middleware mengintercept API requests sebelum sampai ke route handler.

## ✅ Solusi Sudah Diterapkan

Saya sudah memperbaiki kode dengan:
1. Memindahkan API routes ke atas static files
2. Menambahkan middleware yang skip static serving untuk `/api/*`
3. Menambahkan logging untuk debug
4. Menambahkan test endpoints

## 🚀 Langkah Deploy ke Railway

### 1. Commit & Push Perubahan

```bash
git add .
git commit -m "Fix 405 error - API routes priority over static files"
git push origin main
```

### 2. Tunggu Railway Auto-Deploy
- Railway akan otomatis detect push dan deploy
- Tunggu 2-3 menit sampai deployment selesai
- Cek status di Railway Dashboard

### 3. Test API Endpoints

Setelah deployment selesai, buka:
```
https://labelrbm.up.railway.app/test-api.html
```

Test semua endpoint:
1. ✅ Health Check
2. ✅ Test Endpoint
3. ✅ List Routes
4. ✅ Login Endpoint (dengan username: admin, password: iware123)
5. ✅ Reset Admin Password

### 4. Jika Login Masih Gagal

Jalankan reset password terlebih dahulu:

**Opsi A: Via Web Interface**
1. Set `ENABLE_DEBUG=true` di Railway Variables
2. Buka: https://labelrbm.up.railway.app/reset-admin.html
3. Klik "Reset Password Admin"
4. Coba login lagi

**Opsi B: Via Railway Shell**
```bash
railway shell
cd server
node scripts/resetAdminPassword.js
```

### 5. Login

Setelah API berfungsi:
- Buka: https://labelrbm.up.railway.app/login
- Username: `admin`
- Password: `iware123`
- App: `material` / `stoklabel` / `lps`

---

## 🔍 Debug Checklist

Jika masih error, cek:

### 1. Cek Logs di Railway
```
Railway Dashboard → Deployments → Latest → View Logs
```

Cari log:
```
✅ API routes registered
   - POST /api/auth/login
   - GET  /api/auth/me
```

### 2. Test Endpoint Satu Per Satu

Gunakan test-api.html untuk test:
- `/api/health` - harus return status OK
- `/api/test` - harus return "API is working!"
- `/api/routes` - harus list semua routes
- `/api/auth/login` - harus accept POST request

### 3. Cek Environment Variables

Pastikan ada:
- `MYSQLHOST` atau `DB_HOST`
- `MYSQLPORT` atau `DB_PORT`
- `MYSQLUSER` atau `DB_USER`
- `MYSQLPASSWORD` atau `DB_PASSWORD`
- `MYSQLDATABASE` atau `DB_NAME`
- `JWT_SECRET`

### 4. Cek Database

Test koneksi database:
```bash
railway shell
cd server
node scripts/checkDatabase.js
```

---

## 📝 Perubahan yang Dilakukan

### File: `server/index.js`
- ✅ Pindahkan API routes sebelum static files
- ✅ Tambahkan middleware skip static untuk `/api/*`
- ✅ Tambahkan logging untuk debug
- ✅ Tambahkan test endpoint `/api/test-login`

### File: `server/public/test-api.html`
- ✅ Halaman test untuk semua API endpoints
- ✅ Test login dengan form interaktif
- ✅ Test reset admin password

### File: `server/routes/debug.js`
- ✅ Endpoint `/api/debug/reset-admin-password`
- ✅ Endpoint untuk test password

---

## ✅ Hasil yang Diharapkan

Setelah deploy:
1. ✅ `/api/health` return status OK
2. ✅ `/api/test` return "API is working!"
3. ✅ `/api/auth/login` accept POST dan return token
4. ✅ Login berhasil dengan admin/iware123

---

## 🆘 Jika Masih Bermasalah

1. Screenshot error di browser console
2. Screenshot Railway logs
3. Test dengan test-api.html dan screenshot hasilnya
4. Hubungi developer dengan informasi di atas
