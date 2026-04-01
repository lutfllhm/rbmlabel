# Desain Integrasi Antar Aplikasi RBM

## Alur Bisnis Terintegrasi

```
Material Management → SPK → LPS Production → Stock Label
```

### 1. Material Management (Bahan Baku)
- Mengelola stok material (roll, meter)
- Membuat SPK (Surat Perintah Kerja) yang menggunakan material
- SPK mencatat material yang digunakan untuk produksi

### 2. LPS Production (Hasil Produksi)
- Menerima data dari SPK
- Mencatat hasil produksi label
- Status: pending → finish
- Ketika finish, otomatis masuk ke Stock Label

### 3. Stock Label (Inventori Label Jadi)
- Menerima label masuk dari LPS yang sudah finish
- Mengelola label keluar ke customer
- Membuat surat jalan

## Relasi Database

### Existing Relations
```sql
material_spk.material_id → material_stock.id
material_spk.label_id → material_label_list.id
lps.no_spk → material_spk.no_spk (string reference)
stok_label_masuk.no_spk → material_spk.no_spk (string reference)
stok_label_masuk.no_lps → lps.no_lps (string reference)
```

### New Integration Points

#### 1. SPK → LPS (Material ke Produksi)
- Ketika SPK dibuat di Material, bisa langsung create LPS draft
- LPS mengambil data: no_spk, part_number, nama_item, customer, jumlah_order_pcs

#### 2. LPS → Stock Label (Produksi ke Inventori)
- Ketika LPS status = 'finish', otomatis create stok_label_masuk
- Data yang dikirim: no_lps, no_spk, part_number, nama_item, jumlah_pcs, customer

#### 3. Cross-App Data Access
- Material dapat melihat status LPS dari SPK
- LPS dapat melihat detail SPK dan material
- Stock Label dapat melihat history dari LPS

## API Endpoints Baru

### Material Module
```
GET /api/material/spk/:id/lps-status
  → Mendapatkan status LPS dari SPK

POST /api/material/spk/:id/create-lps
  → Membuat LPS dari SPK
```

### LPS Module
```
GET /api/lps/:id/spk-details
  → Mendapatkan detail SPK dari LPS

POST /api/lps/:id/finish
  → Finish LPS dan auto-create stok_label_masuk
  
GET /api/lps/:id/stock-status
  → Cek apakah sudah masuk ke stock label
```

### Stock Label Module
```
GET /api/stoklabel/masuk/:id/lps-details
  → Mendapatkan detail LPS dari label masuk

GET /api/stoklabel/masuk/:id/spk-details
  → Mendapatkan detail SPK dari label masuk
```

### Cross-App Endpoints (Shared)
```
GET /api/integration/flow/:spk_no
  → Mendapatkan full flow: SPK → LPS → Stock Label

GET /api/integration/material/:material_id/usage
  → Tracking penggunaan material di SPK dan LPS

GET /api/integration/dashboard
  → Dashboard terintegrasi untuk semua modul
```

## UI Changes

### Material SPK List
- Tambah kolom "Status LPS"
- Button "Buat LPS" untuk SPK yang belum punya LPS
- Link ke detail LPS

### LPS List
- Tambah kolom "No SPK" (clickable)
- Tampilkan material yang digunakan
- Button "Finish & Kirim ke Stock" (auto-create stok_label_masuk)

### Stock Label Masuk
- Tampilkan link ke LPS source
- Tampilkan link ke SPK source
- Badge status dari LPS

### Dashboard Terintegrasi (New Page)
- Overview semua modul
- Flow visualization
- Material usage tracking
- Production pipeline status

## Implementation Steps

1. ✅ Database schema sudah support (via string references)
2. ⏳ Buat API endpoints integrasi
3. ⏳ Update UI untuk menampilkan data cross-app
4. ⏳ Buat dashboard terintegrasi
5. ⏳ Auto-trigger: LPS finish → Stock Label masuk
6. ⏳ Notification system untuk flow updates

## Security & Access Control

- User dengan app='material' hanya bisa akses Material API
- User dengan app='lps' hanya bisa akses LPS API
- User dengan app='stoklabel' hanya bisa akses Stock Label API
- Admin bisa akses semua
- Integration endpoints memerlukan special permission atau admin role

## Benefits

1. **Traceability**: Track material dari bahan baku sampai pengiriman
2. **Automation**: Reduce manual data entry
3. **Real-time Status**: Lihat status produksi dari modul manapun
4. **Data Consistency**: Single source of truth
5. **Better Planning**: Material planning based on production pipeline
