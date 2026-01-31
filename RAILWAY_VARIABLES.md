# Railway Environment Variables - Complete Guide

## 📋 Copy Paste untuk Railway Raw Editor

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database Configuration - Railway MySQL
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=railway
SQL_FILE_PATH=/app/server/database/rbm_combined.sql
FORCE_DB_INIT=true

# JWT Configuration
JWT_SECRET=09ee1f18127fcb5ef381397098c5a2c768a37ee6ab6186b063aa54f352dc42e7bcf4eb96598e53a5e1ea800cc8f64052439f5c048221d4393d8035c2ee8f9c5e
JWT_EXPIRE=7d
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=*
CLIENT_URL=${{RAILWAY_PUBLIC_DOMAIN}}

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Editor Configuration
EDITOR_MAX_SIZE=100000
EDITOR_ALLOWED_FORMATS=json,xml,html,txt,markdown
EDITOR_AUTOSAVE_INTERVAL=30000
EDITOR_VERSION_LIMIT=50

# Webhook Security (Optional)
WEBHOOK_SECRET_MATERIAL=rbm-material-webhook-2024
WEBHOOK_SECRET_STOKLABEL=rbm-stoklabel-webhook-2024
WEBHOOK_SECRET_LPS=rbm-lps-webhook-2024
```

---

## 🚀 Cara Deploy di Railway

### 1. Setup MySQL Service
1. Buka Railway Dashboard
2. Klik "New" → "Database" → "Add MySQL"
3. Pastikan nama service adalah **"MySQL"** (case-sensitive)
4. Tunggu hingga MySQL service running

### 2. Setup Backend Service
1. Klik "New" → "GitHub Repo"
2. Pilih repository Anda
3. Railway akan auto-detect dan deploy

### 3. Tambahkan Environment Variables
1. Buka Backend Service → "Variables"
2. Klik "Raw Editor"
3. **Copy paste semua variabel di atas**
4. Klik "Add" atau "Update"
5. Service akan auto-redeploy

### 4. Verifikasi Deployment
1. Buka "Deployments" tab
2. Lihat logs untuk memastikan:
   - ✅ Database connected
   - ✅ Tables created (termasuk editor_documents, editor_history, editor_shares)
   - ✅ Admin user created
   - ✅ Server running

---

## 📝 Penjelasan Variabel Editor

### EDITOR_MAX_SIZE
- **Default**: 100000 (100KB)
- **Fungsi**: Maksimal ukuran file yang bisa disimpan di editor
- **Satuan**: Bytes
- **Contoh**: 
  - 100000 = 100KB
  - 1000000 = 1MB
  - 5000000 = 5MB

### EDITOR_ALLOWED_FORMATS
- **Default**: json,xml,html,txt,markdown
- **Fungsi**: Format file yang diizinkan di editor
- **Format**: Comma-separated list
- **Contoh**: `json,xml,html,txt,markdown,css,js`

### EDITOR_AUTOSAVE_INTERVAL
- **Default**: 30000 (30 detik)
- **Fungsi**: Interval autosave di frontend
- **Satuan**: Milliseconds
- **Contoh**:
  - 30000 = 30 detik
  - 60000 = 1 menit
  - 300000 = 5 menit

### EDITOR_VERSION_LIMIT
- **Default**: 50
- **Fungsi**: Maksimal jumlah version history yang disimpan per dokumen
- **Contoh**: 50 = menyimpan 50 versi terakhir

---

## 🗄️ Tabel Database yang Dibuat Otomatis

### 1. editor_documents
Menyimpan dokumen utama yang dibuat user
```sql
- id (Primary Key)
- user_id (Foreign Key → users)
- title (VARCHAR 255)
- content (LONGTEXT)
- format (ENUM: json, xml, html, txt, markdown)
- is_public (BOOLEAN)
- file_size (INT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 2. editor_history
Menyimpan version history dokumen
```sql
- id (Primary Key)
- document_id (Foreign Key → editor_documents)
- content (LONGTEXT)
- version (INT)
- file_size (INT)
- created_by (Foreign Key → users)
- created_at (TIMESTAMP)
```

### 3. editor_shares
Menyimpan sharing permissions
```sql
- id (Primary Key)
- document_id (Foreign Key → editor_documents)
- shared_by (Foreign Key → users)
- shared_with (Foreign Key → users)
- share_token (VARCHAR 64, UNIQUE)
- permission (ENUM: view, edit)
- expires_at (TIMESTAMP)
- created_at (TIMESTAMP)
```

---

## 🔧 Troubleshooting

### Error: Cannot connect to MySQL
**Solusi:**
1. Pastikan MySQL service sudah running
2. Cek nama service adalah "MySQL" (case-sensitive)
3. Verifikasi variabel `${{MySQL.MYSQLHOST}}` dll sudah benar

### Error: Tables not created
**Solusi:**
1. Set `FORCE_DB_INIT=true` di variables
2. Redeploy service
3. Cek logs untuk error SQL

### Error: Admin user not created
**Solusi:**
1. Pastikan tabel `users` sudah dibuat
2. Cek logs untuk error bcrypt
3. Manual create via Railway MySQL console

### Database sudah ada tapi mau reset
**Solusi:**
1. Set `FORCE_DB_INIT=true`
2. Redeploy
3. Semua tabel akan di-drop dan dibuat ulang

---

## 🔐 Default Login Credentials

Setelah deployment berhasil:

```
Username: admin
Password: iware123
```

**⚠️ PENTING**: Ganti password setelah login pertama kali!

---

## 📊 Monitoring

### Cek Database Tables
1. Buka Railway Dashboard
2. Klik MySQL service
3. Klik "Data" tab
4. Lihat semua tabel yang dibuat

### Cek Logs
1. Buka Backend service
2. Klik "Deployments"
3. Klik deployment terakhir
4. Lihat logs untuk:
   - Database connection
   - Table creation
   - Admin user creation
   - Server startup

---

## 🎯 Next Steps

Setelah deployment berhasil:

1. **Test Login**
   - Buka `https://your-app.railway.app`
   - Login dengan admin/iware123

2. **Test Editor API**
   - POST `/api/editor/documents` - Create document
   - GET `/api/editor/documents` - List documents
   - GET `/api/editor/documents/:id` - Get document
   - PUT `/api/editor/documents/:id` - Update document
   - DELETE `/api/editor/documents/:id` - Delete document

3. **Setup Frontend**
   - Add `VITE_API_URL` di frontend service
   - Point ke backend Railway URL

4. **Security**
   - Ganti JWT_SECRET
   - Update CORS_ORIGIN ke domain spesifik
   - Ganti admin password

---

## 📞 Support

Jika ada masalah:
1. Cek logs di Railway Dashboard
2. Verifikasi semua environment variables
3. Pastikan MySQL service running
4. Cek SQL file ada di `/app/server/database/rbm_combined.sql`
