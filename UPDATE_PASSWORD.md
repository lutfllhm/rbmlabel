# Update Admin Password

Panduan untuk mengubah password admin di RBM System.

## Password Default

```
Username: admin
Password: admin123
```

## Cara Update Password

### Metode 1: Menggunakan Script (Recommended)

Jika database sudah berjalan, gunakan script untuk update password:

```bash
cd server
npm run update-admin-password
```

Script ini akan:
1. Connect ke database
2. Update password admin menjadi `admin123`
3. Verify password baru

### Metode 2: Re-initialize Database

Jika ingin reset seluruh database:

```bash
npm run init-db
```

Ini akan:
1. Drop database yang ada (jika ada)
2. Buat database baru
3. Import schema dari `database/rbm_combined.sql`
4. Buat user admin dengan password `admin123`

### Metode 3: Manual via MySQL

Jika ingin mengubah password secara manual:

1. **Generate password hash**
```bash
cd server
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('password_baru', 10).then(hash => console.log(hash));"
```

2. **Update di database**
```sql
USE rbm_combined;
UPDATE users 
SET password = 'hash_dari_step_1' 
WHERE username = 'admin';
```

## Verify Password

Untuk memastikan password sudah benar:

```bash
cd server
npm run check-users
```

Atau test login via API:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## Troubleshooting

### Password tidak berubah
- Pastikan MySQL server berjalan
- Cek koneksi database di `.env`
- Lihat error message di console

### Tidak bisa login
- Pastikan username benar: `admin` (lowercase)
- Pastikan password benar: `admin123`
- Clear browser cache/cookies
- Cek network tab di browser DevTools

### Database tidak ada
- Run `npm run init-db` untuk membuat database
- Pastikan MySQL server berjalan
- Cek credentials di `.env`

## Security Notes

⚠️ **PENTING untuk Production:**

1. **Ganti password default** setelah deployment pertama
2. **Gunakan password yang kuat** (minimal 12 karakter, kombinasi huruf, angka, simbol)
3. **Jangan commit** file `.env` ke git
4. **Gunakan environment variables** untuk production
5. **Enable 2FA** jika memungkinkan (future feature)

## Password Requirements (Future)

Untuk keamanan yang lebih baik, pertimbangkan untuk menambahkan:
- Minimal 8 karakter
- Kombinasi huruf besar dan kecil
- Minimal 1 angka
- Minimal 1 karakter spesial
- Password expiry (90 hari)
- Password history (tidak boleh sama dengan 5 password terakhir)

---

**Last Updated:** January 31, 2026
