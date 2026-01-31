# Changelog

All notable changes to RBM System will be documented in this file.

## [1.0.1] - 2026-01-29

### 🐛 Bug Fixes

#### Backend Crash - Database Auto-Import Fixed

**Issue:** Backend crashed during Railway deployment with error "Cannot find module '../scripts/initDatabase'" and database tables were not created automatically.

**Root Cause:** Incorrect relative path in `server/config/database.js` when requiring the initDatabase script.

**Changes:**
- Fixed path from `./scripts/initDatabase` to `../scripts/initDatabase` in `server/config/database.js`
- Backend now correctly auto-imports database schema on first run
- Databases are automatically created if they don't exist
- Schema is imported only if database is empty (safe to run multiple times)

**Files Modified:**
- `server/config/database.js` - Fixed require path

**Impact:**
- ✅ Backend no longer crashes on Railway deployment
- ✅ Databases are automatically created and populated
- ✅ No manual intervention needed for database setup

### ✨ New Features

#### Database Management Scripts

Added comprehensive database management and troubleshooting tools:

**New Scripts:**
1. `npm run check-db` - Check database configuration and status
   - Verifies environment variables
   - Tests MySQL connection
   - Lists all databases and tables
   - Provides diagnostic information

2. `npm run init-db` - Initialize databases (already existed, now documented)
   - Creates databases if not exist
   - Imports schema from SQL files
   - Safe to run multiple times

**New Files:**
- `server/scripts/checkDatabase.js` - Database diagnostic tool
- `server/scripts/README.md` - Complete scripts documentation

**Updated Files:**
- `server/package.json` - Added `check-db` script

### 📚 Documentation

#### New Documentation Files

1. **RAILWAY-DATABASE-FIX.md**
   - Complete troubleshooting guide for database issues
   - Step-by-step solutions for common problems
   - Railway-specific deployment fixes
   - Error diagnosis and resolution

2. **server/scripts/README.md**
   - Database scripts usage guide
   - Troubleshooting scenarios
   - Best practices
   - Environment variables reference

3. **README.md** (Complete Rewrite)
   - Project overview and features
   - Quick start guide
   - Railway deployment instructions
   - Troubleshooting section
   - Project structure
   - Tech stack documentation

#### Updated Documentation

1. **RAILWAY-DEPLOYMENT.md**
   - Added troubleshooting section for database issues
   - Added manual database import instructions
   - Added verification steps

2. **DEPLOYMENT-STATUS.md**
   - Added fix status and date
   - Added reference to troubleshooting guide
   - Updated troubleshooting section

### 🔧 Improvements

#### Error Handling
- Better error messages in database initialization
- Detailed logging for database operations
- Connection diagnostics in check script

#### Developer Experience
- Easy-to-use diagnostic tools
- Clear error messages with solutions
- Comprehensive documentation
- Step-by-step troubleshooting guides

### 📋 Checklist for Users

If you're experiencing database issues:

- [ ] Pull latest changes: `git pull origin main`
- [ ] Check database: `npm run check-db --prefix server`
- [ ] Initialize if needed: `npm run init-db --prefix server`
- [ ] Redeploy to Railway: `railway up`
- [ ] Verify deployment: Check Railway logs

### 🚀 Deployment Notes

**For Railway Users:**

If your deployment is currently failing:

```bash
# 1. Pull latest fixes
git pull origin main

# 2. Push to Railway (auto-deploy)
git push origin main

# Or manual deploy:
railway up

# 3. If database still empty, run:
railway run npm run init-db --prefix server

# 4. Verify:
railway logs
```

**For Local Development:**

```bash
# 1. Pull latest changes
git pull origin main

# 2. Check database
cd server
npm run check-db

# 3. Initialize if needed
npm run init-db

# 4. Start server
npm start
```

### 🔗 Related Issues

- Backend crash on Railway deployment
- Database tables not created automatically
- "Cannot find module" error
- Empty database after deployment

### 📊 Testing

**Tested Scenarios:**
- ✅ Fresh Railway deployment
- ✅ Local development setup
- ✅ Database already exists (skip import)
- ✅ Empty database (auto import)
- ✅ Missing environment variables (error handling)
- ✅ Connection failures (error messages)

### 🎯 Migration Guide

No migration needed. Changes are backward compatible.

**For existing deployments:**
1. Pull latest code
2. Redeploy
3. Database will auto-initialize if empty

**For new deployments:**
1. Follow RAILWAY-QUICKSTART.md
2. Database will auto-initialize on first run

---

## [1.0.0] - 2026-01-29

### 🎉 Initial Release

#### Features
- ✅ Complete dark mode support (all 23 pages)
- ✅ 3 integrated applications (Material, Stoklabel, LPS)
- ✅ Modern UI with Tailwind CSS
- ✅ Responsive design
- ✅ JWT authentication
- ✅ Real-time notifications (Socket.io)
- ✅ API rate limiting
- ✅ Security headers (Helmet.js)
- ✅ Compression & optimization

#### Applications

**Material Management:**
- Material stock tracking
- Category management
- SPK (Work Order) management
- Material labels printing
- Reports and analytics

**Stock Label Management:**
- Stock in/out tracking
- Delivery notes (Surat Jalan)
- Stock monitoring
- Label printing
- Reports

**LPS (Production Sheet) Management:**
- Production sheet creation
- Production tracking
- Finishing management
- Production reports
- User management

#### Tech Stack
- Frontend: React 18 + Vite + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MySQL 8.0
- Hosting: Railway
- Authentication: JWT

#### Documentation
- RAILWAY-QUICKSTART.md
- RAILWAY-DEPLOYMENT.md
- RAILWAY-ENV-SETUP.md
- RAILWAY-MYSQL-SETUP.md
- RAILWAY-VARIABLES-SETUP.md

---

## Version Format

[MAJOR.MINOR.PATCH]

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## Links

- Repository: https://github.com/lutfllhm/labelrbm
- Issues: https://github.com/lutfllhm/labelrbm/issues
- Railway: https://railway.app

---

**Last Updated:** January 29, 2026
