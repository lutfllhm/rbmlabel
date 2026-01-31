# RBM System - Railway Deployment

Sistem manajemen RBM dengan React frontend dan Express backend, siap deploy ke Railway.

## 🚀 Quick Deploy ke Railway

### 1. Setup Railway Project
1. Buka [Railway.app](https://railway.app) dan login
2. Klik "New Project" → "Deploy from GitHub repo"
3. Pilih repository ini
4. Railway akan otomatis detect dan mulai build

### 2. Tambah MySQL Database
1. Di Railway dashboard, klik "New Service"
2. Pilih "Database" → "MySQL"
3. Tunggu MySQL service dibuat
4. **Penting**: Pastikan service MySQL bernama "MySQL" (case-sensitive)

### 3. Set Environment Variables
Di service utama → Variables → Raw Editor, paste:

```env
NODE_ENV=production
PORT=5000

# Database Configuration
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=rbm_combined
FORCE_DB_INIT=true

# JWT Configuration
JWT_SECRET=09ee1f18127fcb5ef381397098c5a2c768a37ee6ab6186b063aa54f352dc42e7bcf4eb96598e53a5e1ea800cc8f64052439f5c048221d4393d8035c2ee8f9c5e
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=*
CLIENT_URL=${{RAILWAY_PUBLIC_DOMAIN}}
```

### 4. Deploy & Verify
1. Push code ke GitHub (jika belum)
2. Railway akan auto-deploy
3. Cek logs untuk memastikan tidak ada error
4. Test di URL Railway: `https://your-app.railway.app`

## 📁 Struktur Project

```
rbm-system/
├── frontend/          # React app
├── server/           # Express API
├── database/         # SQL schema
├── build.js         # Build script
├── railway.json     # Railway config
└── nixpacks.toml    # Nixpacks config
```

## 🔧 Development

### Prerequisites
- Node.js 18.x atau lebih tinggi
- MySQL 5.7+ atau MariaDB
- XAMPP (untuk Windows) atau MySQL server

### Setup Local Development

1. **Clone repository**
```bash
git clone <repository-url>
cd rbm-system
```

2. **Install dependencies**
```bash
npm run setup
# atau
npm run install:all
```

3. **Setup database**
   - Start MySQL server (XAMPP untuk Windows)
   - Buat file `.env` di folder `server/`:
   
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=rbm_combined

# JWT Configuration
JWT_SECRET=rbm-secret-key-development-2024
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

4. **Buat file `.env` di folder `frontend/`:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=RBM System
VITE_NODE_ENV=development
```

5. **Initialize database**
```bash
npm run init-db
```

6. **Run development server**
```bash
npm run dev
```

Server akan berjalan di:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Available Scripts

```bash
# Development
npm run dev              # Run server & frontend bersamaan
npm run backend:dev      # Run server saja
npm run frontend:dev     # Run frontend saja

# Database
npm run init-db          # Initialize database
npm run check-db         # Check database status
npm run update-admin-password  # Update password admin ke admin123

# Production
npm run build            # Build frontend
npm start                # Start production server
```

## 🗄️ Database

- **Single Database**: `rbm_combined`
- **Auto-initialization**: Schema dibuat otomatis dari `database/rbm_combined.sql`
- **Modules**: Material, Stoklabel, LPS dalam satu database

### Default Login Credentials
```
Username: admin
Password: admin123
```

**⚠️ PENTING**: Ganti password setelah login pertama kali!

## 🌐 Features

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Express.js + MySQL
- **Auth**: JWT-based authentication
- **Real-time**: Socket.io support
- **Production Ready**: Optimized build, security headers, rate limiting

## 🔍 Troubleshooting

### Database Issues
- Pastikan MySQL service running
- Cek environment variables
- Lihat logs untuk connection errors

### Build Issues
- Pastikan Node.js 18.x
- Cek dependencies di package.json
- Verify file paths

### Runtime Issues
- Cek Railway logs
- Test API endpoints: `/api/health`
- Verify environment variables

## 📞 Support

Jika ada masalah:
1. Cek Railway deployment logs
2. Verify environment variables
3. Test database connection
4. Check file permissions

---

**Ready to deploy!** 🚀

## 🎉 Acknowledgments

- Built with modern web technologies
- Designed for production environments
- Optimized for Railway deployment

---

**RBM System** - Modern Production Management Solution 🚀

**Last Updated:** January 30, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅