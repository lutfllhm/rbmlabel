# Panduan Integrasi Antar Aplikasi RBM

## 🎯 Overview

Ketiga aplikasi RBM (Material Management, LPS Production, dan Stock Label) kini telah terintegrasi dengan alur bisnis yang otomatis:

```
Material → SPK → LPS → Stock Label → Pengiriman
```

## 🔄 Alur Integrasi

### 1. Material Management → LPS Production

**Fitur:**
- Buat LPS langsung dari SPK yang sudah ada
- Tracking status LPS dari halaman SPK
- Material otomatis ter-link ke produksi

**Cara Menggunakan:**
1. Buka Material Management → SPK List
2. Pilih SPK yang ingin dibuat LPS-nya
3. Klik tombol "Create LPS" (jika tersedia)
4. LPS akan otomatis dibuat dengan data dari SPK

**API Endpoint:**
```
POST /api/material/spk/:id/create-lps
GET /api/material/spk/:id/lps-status
GET /api/material/spk/:id/full
```

### 2. LPS Production → Stock Label (OTOMATIS!)

**Fitur:**
- Ketika LPS di-finish, otomatis membuat entry di Stock Label Masuk
- Stock label otomatis bertambah
- Tracking lengkap dari produksi ke inventori

**Cara Kerja:**
1. Buka LPS Production → Finish
2. Pilih LPS yang sudah selesai produksi
3. Klik "Mark as Finished"
4. **OTOMATIS**: System akan:
   - Update status LPS menjadi "finish"
   - Create entry baru di Stock Label Masuk
   - Update jumlah stock label

**API Endpoint:**
```
POST /api/lps/finish (dengan auto-create stock)
GET /api/lps/:id/spk-details
GET /api/lps/:id/stock-status
GET /api/lps/:id/full
```

### 3. Stock Label → Tracking

**Fitur:**
- Lihat asal label dari LPS mana
- Tracking ke SPK original
- History lengkap masuk/keluar

**API Endpoint:**
```
GET /api/stoklabel/masuk/:id/lps-details
GET /api/stoklabel/masuk/:id/spk-details
GET /api/stoklabel/masuk/:id/full
GET /api/stoklabel/part/:part_number/history
```

## 📊 Dashboard Terintegrasi

**Akses:** `/api/integration/dashboard`

Menampilkan:
- Total materials, SPK, LPS, dan stock labels
- Integration status (berapa SPK yang sudah jadi LPS, dll)
- Recent activities dari semua modul

**Frontend Component:**
```jsx
import IntegratedDashboard from './pages/IntegratedDashboard'
```

## 🔗 Cross-App Endpoints

### Get Full Flow
```
GET /api/integration/flow/:spk_no
```

Response:
```json
{
  "spk": { ... },
  "lps": [ ... ],
  "stock_masuk": [ ... ],
  "stock_keluar": [ ... ],
  "flow_status": {
    "spk_created": true,
    "lps_created": true,
    "lps_finished": true,
    "stock_received": true,
    "stock_shipped": false
  }
}
```

### Material Usage Tracking
```
GET /api/integration/material/:material_id/usage
```

Menampilkan:
- Material details
- Semua SPK yang menggunakan material ini
- Semua LPS dari SPK tersebut
- Statistics produksi

### Recent Activities
```
GET /api/integration/activities?limit=20
```

Menampilkan aktivitas terbaru dari semua modul.

## 🎨 UI Components

### IntegrationBadge
Menampilkan badge dengan link ke modul lain:

```jsx
import IntegrationBadge from './components/IntegrationBadge'

// Tampilkan SPK badge
<IntegrationBadge type="spk" data={{ no_spk: "SPK-001" }} />

// Tampilkan LPS badge
<IntegrationBadge type="lps" data={{ no_lps: "LPS-001" }} />

// Tampilkan Stock badge
<IntegrationBadge type="stock" data={{ part_number: "P-001" }} />
```

### IntegrationFlowCard
Menampilkan visual flow dari SPK sampai pengiriman:

```jsx
import IntegrationFlowCard from './components/IntegrationFlowCard'

<IntegrationFlowCard flowData={flowData} />
```

## 🔔 Real-time Notifications

System akan mengirim notifikasi Socket.io untuk:

1. **SPK Created**
   - Event: `spk_created`
   - Data: `{ id, no_spk, part_number, nama_item, customer }`

2. **LPS Created from SPK**
   - Event: `lps_created_from_spk`
   - Data: `{ lps_id, no_lps, no_spk, nama_item }`

3. **LPS Finished**
   - Event: `lps_finished`
   - Data: `{ lps_id, finish_id, tanggal_finish, verified_by }`

4. **Stock Label Auto-Created**
   - Event: `stock_label_auto_created`
   - Data: `{ stock_masuk_id, no_lps, part_number, nama_item, source }`

## 📝 Contoh Use Case

### Scenario: Produksi Label Baru

1. **Material Team** membuat SPK baru:
   ```
   POST /api/material/spk
   {
     "no_spk": "SPK-12345",
     "part_number": "P-001",
     "nama_item": "Label A",
     "jumlah_cetak_pcs": 10000,
     "material_id": 5
   }
   ```

2. **Production Team** membuat LPS dari SPK:
   ```
   POST /api/material/spk/123/create-lps
   {
     "tanggal": "2026-03-30",
     "papercore_pcs": 10,
     "papercore_size": "3\""
   }
   ```

3. **Production Team** finish LPS:
   ```
   POST /api/lps/finish
   {
     "lps_id": 456,
     "tanggal_finish": "2026-03-31"
   }
   ```
   
   **OTOMATIS**: Stock Label Masuk dibuat!

4. **Warehouse Team** lihat stock yang baru masuk:
   ```
   GET /api/stoklabel/masuk
   ```
   
   Akan muncul entry baru dengan `no_lps` dan `no_spk` ter-link.

5. **Warehouse Team** kirim ke customer:
   ```
   POST /api/stoklabel/keluar
   {
     "part_number": "P-001",
     "customer": "Customer A",
     "jumlah": "5 ROLL"
   }
   ```

6. **Management** cek full flow:
   ```
   GET /api/integration/flow/SPK-12345
   ```
   
   Melihat complete journey dari material sampai pengiriman.

## 🔐 Security & Access Control

- User dengan `app='material'` hanya bisa akses Material API
- User dengan `app='lps'` hanya bisa akses LPS API
- User dengan `app='stoklabel'` hanya bisa akses Stock Label API
- **Integration endpoints** bisa diakses oleh semua authenticated users
- Admin bisa akses semua

## 🚀 Benefits

1. **Automation**: Reduce manual data entry
2. **Traceability**: Track dari bahan baku sampai pengiriman
3. **Real-time**: Status update otomatis
4. **Data Consistency**: Single source of truth
5. **Better Planning**: Material planning based on production pipeline
6. **Audit Trail**: Complete history tracking

## 📈 Monitoring

### Dashboard Metrics
- SPK with LPS: Berapa SPK yang sudah dibuat LPS-nya
- LPS in Stock: Berapa LPS yang sudah masuk ke stock
- SPK without LPS: SPK yang belum dibuat LPS (perlu action)

### Integration Health
```
GET /api/integration/dashboard
```

Cek:
- Total items di setiap modul
- Integration completion rate
- Bottlenecks (SPK tanpa LPS, LPS tanpa stock, dll)

## 🛠️ Troubleshooting

### LPS tidak otomatis create stock
- Pastikan LPS memiliki `part_number` yang valid
- Cek apakah LPS sudah di-finish dengan benar
- Lihat server logs untuk error

### Badge tidak muncul
- Pastikan data memiliki field yang diperlukan (`no_spk`, `no_lps`, `part_number`)
- Cek console browser untuk error

### Flow tracking tidak lengkap
- Pastikan `no_spk` konsisten di semua modul
- Cek apakah ada typo di nomor SPK/LPS

## 📞 Support

Jika ada masalah dengan integrasi, hubungi tim development atau cek:
- Server logs: `server/logs/`
- Database: Cek foreign key dan references
- API response: Gunakan browser DevTools Network tab
