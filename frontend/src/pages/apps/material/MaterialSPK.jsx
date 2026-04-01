import { useState, useEffect, useMemo } from 'react'
import { Plus, Search, FileText, Package, RefreshCw } from 'lucide-react'
import AppPageHero from '../../../components/layout/AppPageHero'
import Card from '../../../components/ui/Card'
import PageLoading from '../../../components/ui/PageLoading'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import api from '../../../services/api'
import toast from 'react-hot-toast'

const emptyForm = () => ({
  no_spk: '',
  part_number: '',
  nama_item: '',
  ukuran: '',
  finishing: '',
  isi: '',
  warna: '',
  customer: '',
  jumlah_order_pcs: '',
  jumlah_order_roll: '',
  jumlah_cetak_pcs: '',
  jumlah_kebutuhan: '',
  diameter_core: '',
  material_id: ''
})

const MaterialSPK = () => {
  const [spkList, setSpkList] = useState([])
  const [materials, setMaterials] = useState([])
  const [labels, setLabels] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState(emptyForm)
  const [selectedLabelId, setSelectedLabelId] = useState('')

  const loadData = async () => {
    try {
      const [spkRes, stockRes, labelsRes] = await Promise.all([
        api.get('/material/spk'),
        api.get('/material/stock'),
        api.get('/material/labels')
      ])
      const spkPayload = spkRes.data
      setSpkList(Array.isArray(spkPayload) ? spkPayload : [])
      setMaterials(Array.isArray(stockRes.data) ? stockRes.data : [])
      setLabels(Array.isArray(labelsRes.data) ? labelsRes.data : [])
    } catch (error) {
      console.error('Failed to load SPK data:', error)
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          'Gagal memuat data SPK'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const suggestNoSpk = () => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
    setFormData((prev) => ({ ...prev, no_spk: `SPK-${y}${m}${day}-${rand}` }))
  }

  const onPickLabel = (labelId) => {
    setSelectedLabelId(labelId)
    if (!labelId) return
    const label = labels.find((l) => String(l.id) === String(labelId))
    if (!label) return
    setFormData((prev) => ({
      ...prev,
      part_number: label.part_number || '',
      nama_item: label.nama_item || '',
      ukuran: label.ukuran || '',
      finishing: label.finishing || '',
      isi: label.isi != null ? String(label.isi) : ''
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.material_id) {
      toast.error('Pilih material (stok) yang akan dipakai')
      return
    }
    if (!/\d+(?:\.\d+)?\s*ROLL/i.test(formData.jumlah_kebutuhan.trim())) {
      toast.error('Jumlah kebutuhan harus memuat satuan ROLL, contoh: 5 ROLL')
      return
    }
    try {
      const payload = {
        no_spk: formData.no_spk.trim(),
        part_number: formData.part_number.trim(),
        nama_item: formData.nama_item.trim(),
        ukuran: formData.ukuran.trim(),
        finishing: formData.finishing.trim(),
        isi: parseInt(formData.isi, 10) || 0,
        warna: formData.warna.trim(),
        customer: formData.customer.trim(),
        jumlah_order_pcs: parseInt(formData.jumlah_order_pcs, 10) || 0,
        jumlah_order_roll: formData.jumlah_order_roll === '' ? null : parseFloat(formData.jumlah_order_roll),
        jumlah_cetak_pcs: parseInt(formData.jumlah_cetak_pcs, 10) || 0,
        jumlah_kebutuhan: formData.jumlah_kebutuhan.trim(),
        diameter_core: formData.diameter_core.trim(),
        material_id: parseInt(formData.material_id, 10)
      }
      await api.post('/material/spk', payload)
      toast.success('SPK berhasil dibuat')
      setShowModal(false)
      setFormData(emptyForm())
      setSelectedLabelId('')
      loadData()
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Gagal menyimpan SPK'
      toast.error(msg)
    }
  }

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return spkList
    return spkList.filter(
      (row) =>
        (row.no_spk && String(row.no_spk).toLowerCase().includes(q)) ||
        (row.part_number && String(row.part_number).toLowerCase().includes(q)) ||
        (row.nama_item && String(row.nama_item).toLowerCase().includes(q)) ||
        (row.customer && String(row.customer).toLowerCase().includes(q))
    )
  }, [spkList, searchTerm])

  const materialById = useMemo(() => {
    const m = {}
    materials.forEach((mat) => {
      m[mat.id] = mat
    })
    return m
  }, [materials])

  if (loading) {
    return <PageLoading app="material" />
  }

  return (
    <div className="space-y-8">
      <AppPageHero
        app="material"
        eyebrow="Produksi"
        title="SPK — Surat Perintah Kerja"
        description="Kelola SPK, hubungkan ke stok material, dan pantau order per customer."
      >
        <Button app="material" variant="secondary" type="button" onClick={() => loadData()} className="gap-2 rounded-xl">
          <RefreshCw className="h-4 w-4" strokeWidth={2} />
          Muat ulang
        </Button>
        <Button
          app="material"
          variant="primary"
          type="button"
          onClick={() => {
            setFormData(emptyForm())
            setSelectedLabelId('')
            suggestNoSpk()
            setShowModal(true)
          }}
          className="gap-2 rounded-xl shadow-lg shadow-material-600/15"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Buat SPK
        </Button>
      </AppPageHero>

      <Card className="p-5 shadow-md shadow-slate-200/25 ring-1 ring-slate-100/80 dark:shadow-black/20 dark:ring-white/[0.04] sm:p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 h-4 w-4" />
          <input
            type="text"
            placeholder="Cari no SPK, part number, item, atau customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-material-500"
          />
        </div>
      </Card>

      <Card className="overflow-hidden shadow-md shadow-slate-200/25 ring-1 ring-slate-100/80 dark:shadow-black/25 dark:ring-white/[0.04]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100/90 dark:from-slate-800 dark:to-slate-800/95">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">
                  No SPK
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">
                  Part / Item
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">
                  Customer
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">
                  Order (pcs)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">
                  Kebutuhan
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">
                  Material
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">
                  Tanggal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900/50">
              {filtered.map((row) => {
                const mat = row.material_id != null ? materialById[row.material_id] : null
                return (
                  <tr key={row.id} className="hover:bg-slate-50/90 dark:hover:bg-slate-800/60">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {row.no_spk}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      <div className="font-medium">{row.part_number}</div>
                      <div className="text-gray-500 dark:text-slate-400 text-xs">{row.nama_item}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-slate-300">
                      {row.customer || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                      {row.jumlah_order_pcs ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-slate-300 whitespace-nowrap">
                      {row.jumlah_kebutuhan || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-slate-300">
                      {mat ? (
                        <span title={mat.nama_material}>
                          {mat.no_po} · {mat.nama_material?.slice(0, 24)}
                          {mat.nama_material?.length > 24 ? '…' : ''}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-slate-400 whitespace-nowrap">
                      {row.created_at
                        ? new Date(row.created_at).toLocaleString('id-ID', {
                            dateStyle: 'short',
                            timeStyle: 'short'
                          })
                        : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-14 w-14 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-slate-400">Belum ada SPK. Buat SPK baru untuk memulai.</p>
          </div>
        )}
      </Card>

      {showModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="spk-modal-title"
        >
          {/* Sama lebar dengan area main: max-w-7xl + padding seperti ModernLayout */}
          <div className="flex min-h-full w-full items-start justify-center px-4 py-8 md:px-6 md:py-10 lg:px-8">
            <div className="w-full max-w-7xl">
            <Card className="relative my-auto flex w-full flex-col shadow-xl dark:shadow-black/20">
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-slate-50/80 px-5 pt-5 pb-4 dark:border-slate-800 dark:bg-slate-800/50 sm:px-6 sm:pt-6">
                <h3
                  id="spk-modal-title"
                  className="pr-2 text-lg font-semibold tracking-tight text-slate-900 dark:text-white sm:text-xl"
                >
                  Buat SPK baru
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setFormData(emptyForm())
                    setSelectedLabelId('')
                  }}
                  className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  aria-label="Tutup"
                >
                  Tutup
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
                <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                  <div className="flex-1">
                    <Input
                      label="No SPK"
                      required
                      value={formData.no_spk}
                      onChange={(e) => setFormData({ ...formData, no_spk: e.target.value })}
                      placeholder="Contoh: SPK-20260328-AB12"
                    />
                  </div>
                  <Button type="button" app="material" variant="secondary" onClick={suggestNoSpk}>
                    Generate
                  </Button>
                </div>

                {labels.length > 0 && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Isi dari daftar label (opsional)
                    </label>
                    <select
                      value={selectedLabelId}
                      onChange={(e) => onPickLabel(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-material-500 focus:outline-none focus:ring-2 focus:ring-material-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                    >
                      <option value="">— manual —</option>
                      {labels.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.part_number} — {l.nama_item}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 [&>*]:min-w-0">
                  <Input
                    label="Part number"
                    required
                    value={formData.part_number}
                    onChange={(e) => setFormData({ ...formData, part_number: e.target.value })}
                  />
                  <Input
                    label="Nama item"
                    required
                    value={formData.nama_item}
                    onChange={(e) => setFormData({ ...formData, nama_item: e.target.value })}
                  />
                  <Input
                    label="Ukuran"
                    required
                    value={formData.ukuran}
                    onChange={(e) => setFormData({ ...formData, ukuran: e.target.value })}
                  />
                  <Input
                    label="Finishing"
                    required
                    value={formData.finishing}
                    onChange={(e) => setFormData({ ...formData, finishing: e.target.value })}
                  />
                  <Input
                    label="Isi"
                    type="number"
                    required
                    value={formData.isi}
                    onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
                  />
                  <Input
                    label="Warna"
                    required
                    value={formData.warna}
                    onChange={(e) => setFormData({ ...formData, warna: e.target.value })}
                  />
                  <Input
                    label="Customer"
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  />
                  <Input
                    label="Diameter core"
                    value={formData.diameter_core}
                    onChange={(e) => setFormData({ ...formData, diameter_core: e.target.value })}
                    placeholder="mm"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 [&>*]:min-w-0">
                  <Input
                    label="Jumlah order (pcs)"
                    type="number"
                    required
                    min={0}
                    value={formData.jumlah_order_pcs}
                    onChange={(e) => setFormData({ ...formData, jumlah_order_pcs: e.target.value })}
                  />
                  <Input
                    label="Jumlah order (roll)"
                    type="number"
                    step="0.01"
                    value={formData.jumlah_order_roll}
                    onChange={(e) => setFormData({ ...formData, jumlah_order_roll: e.target.value })}
                  />
                  <Input
                    label="Jumlah cetak (pcs)"
                    type="number"
                    required
                    min={0}
                    value={formData.jumlah_cetak_pcs}
                    onChange={(e) => setFormData({ ...formData, jumlah_cetak_pcs: e.target.value })}
                  />
                </div>

                <Input
                  label="Jumlah kebutuhan (material)"
                  required
                  value={formData.jumlah_kebutuhan}
                  onChange={(e) => setFormData({ ...formData, jumlah_kebutuhan: e.target.value })}
                  placeholder="Contoh: 10 ROLL"
                  helperText="Harus memuat angka dan kata ROLL — stok material akan dikurangi sesuai ini."
                />

                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Package className="h-4 w-4 shrink-0" strokeWidth={2} />
                    Material (stok) <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.material_id}
                    onChange={(e) => setFormData({ ...formData, material_id: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-material-500 focus:outline-none focus:ring-2 focus:ring-material-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value="">Pilih roll material</option>
                    {materials.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.no_po} · {m.nama_material} — sisa {m.jumlah_roll} roll
                      </option>
                    ))}
                  </select>
                  {materials.length === 0 && (
                    <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                      Belum ada stok material. Tambahkan di menu Stock terlebih dahulu.
                    </p>
                  )}
                </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-slate-200 bg-slate-50/80 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/50 sm:px-6">
                  <Button
                    type="button"
                    app="material"
                    variant="secondary"
                    onClick={() => {
                      setShowModal(false)
                      setFormData(emptyForm())
                      setSelectedLabelId('')
                    }}
                  >
                    Batal
                  </Button>
                  <Button type="submit" app="material" variant="primary">
                    Simpan SPK
                  </Button>
                </div>
              </form>
            </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MaterialSPK
