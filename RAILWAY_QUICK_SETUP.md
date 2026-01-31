# ⚡ Railway Quick Setup - Copy Paste Ready

## 🎯 Backend Variables (Server Service)

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

CORS_ORIGIN=*
CLIENT_URL=${{RAILWAY_PUBLIC_DOMAIN}}

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

EDITOR_MAX_SIZE=100000
EDITOR_ALLOWED_FORMATS=json,xml,html,txt,markdown
EDITOR_AUTOSAVE_INTERVAL=30000
EDITOR_VERSION_LIMIT=50

WEBHOOK_SECRET_MATERIAL=rbm-material-webhook-2024
WEBHOOK_SECRET_STOKLABEL=rbm-stoklabel-webhook-2024
WEBHOOK_SECRET_LPS=rbm-lps-webhook-2024
```

---

## 🎨 Frontend Variables (Frontend Service)

**Railway Dashboard → Frontend Service → Variables → Raw Editor**

```env
VITE_API_URL=https://GANTI-DENGAN-BACKEND-URL.railway.app/api
VITE_APP_NAME=RBM System
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=production
NODE_ENV=production
```

⚠️ **PENTING:** Ganti `GANTI-DENGAN-BACKEND-URL` dengan URL backend Railway Anda!

**Cara dapat URL Backend:**
1. Buka Backend Service → Settings → Networking
2. Copy domain (contoh: `rbm-backend-production.up.railway.app`)
3. Ganti di `VITE_API_URL`: `https://rbm-backend-production.up.railway.app/api`

---

## 📋 Deployment Checklist

### 1. Setup MySQL Service
- [ ] Add MySQL service di Railway
- [ ] Pastikan nama service: **"MySQL"** (case-sensitive)
- [ ] Tunggu hingga status: Running

### 2. Setup Backend Service
- [ ] Connect GitHub repo
- [ ] Copy paste backend variables di atas
- [ ] Tunggu deployment selesai
- [ ] Cek logs: Database connected ✅
- [ ] Cek logs: Admin user created ✅
- [ ] Copy backend URL dari Settings → Networking

### 3. Setup Frontend Service
- [ ] Connect GitHub repo (atau same repo, different root path)
- [ ] Copy paste frontend variables
- [ ] **Ganti VITE_API_URL dengan backend URL**
- [ ] Tunggu deployment selesai
- [ ] Buka frontend URL
- [ ] Test login: admin / iware123

---

## 🔍 Quick Test

### Test Backend
```bash
curl https://your-backend.railway.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-31T..."
}
```

### Test Frontend
1. Buka frontend URL
2. Tekan F12 (Developer Tools)
3. Cek Console log:
   ```
   API Base URL: https://your-backend.railway.app/api
   Environment: production
   ```
4. Login dengan: `admin` / `iware123`

---

## 🚨 Common Issues

### Backend: Cannot connect to MySQL
**Fix:** Pastikan MySQL service nama nya "MySQL" (case-sensitive)

### Frontend: Network Error
**Fix:** Cek `VITE_API_URL` sudah benar dan diakhiri `/api`

### Frontend: CORS Error
**Fix:** Set `CORS_ORIGIN=*` di backend variables

### Database empty
**Fix:** Set `FORCE_DB_INIT=true` dan redeploy backend

---

## 📞 Default Login

```
Username: admin
Password: iware123
Apps: material, stoklabel, lps
```

⚠️ Ganti password setelah login pertama!

---

## 🎉 Done!

Jika semua checklist ✅, aplikasi Anda sudah live di Railway!

**URLs:**
- Frontend: `https://your-frontend.railway.app`
- Backend: `https://your-backend.railway.app`
- API: `https://your-backend.railway.app/api`
