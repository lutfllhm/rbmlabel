import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Download, 
  TrendingUp,
  TrendingDown,
  Package,
  CheckCircle,
  FileText,
  Filter,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import api from '../../../services/api'
import toast from 'react-hot-toast'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const LpsReports = () => {
  const [reports, setReports] = useState([])
  const [chartData, setChartData] = useState([])
  const [trendData, setTrendData] = useState([])
  const [pieData, setPieData] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  })
  const [reportType, setReportType] = useState('monthly')
  const [refreshing, setRefreshing] = useState(false)

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  useEffect(() => {
    fetchReports()
  }, [dateRange, reportType])

  const fetchReports = async (showToast = false) => {
    try {
      setLoading(true)
      const response = await api.get('/lps/reports', {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          type: reportType
        }
      })
      
      // Pastikan data selalu dalam format yang benar
      setReports(response.data?.reports || {})
      setChartData(Array.isArray(response.data?.chartData) ? response.data.chartData : [])
      setTrendData(Array.isArray(response.data?.trendData) ? response.data.trendData : [])
      setPieData(Array.isArray(response.data?.pieData) ? response.data.pieData : [])
    } catch (error) {
      console.error('Failed to fetch reports:', error)
      // Hanya tampilkan toast error jika diminta (saat user action)
      if (showToast) {
        toast.error('Gagal memuat laporan')
      }
      // Set default values untuk mencegah error
      setReports({})
      setChartData([])
      setTrendData([])
      setPieData([])
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchReports(true) // Pass true untuk menampilkan toast
    setRefreshing(false)
    toast.success('Data berhasil diperbarui')
  }

  const handleExport = async (type) => {
    const loadingToast = toast.loading(`Mengexport laporan ke ${type.toUpperCase()}...`)
    try {
      const response = await api.get(`/lps/reports/export/${type}`, {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        },
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `lps-report-${format(new Date(), 'yyyy-MM-dd')}.${type}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      toast.success(`Laporan berhasil diexport ke ${type.toUpperCase()}`, { id: loadingToast })
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Gagal export laporan', { id: loadingToast })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lps-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Laporan LPS</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">Analisis dan laporan produksi selesai</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            app="lps"
            variant="secondary"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Memperbarui...' : 'Refresh'}
          </Button>
          <Button
            app="lps"
            variant="primary"
            onClick={() => handleExport('excel')}
            className="flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleExport('pdf')}
            className="flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500 dark:text-slate-400" />
            <span className="font-medium text-gray-900 dark:text-white">Filter:</span>
          </div>
          
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Periode:</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lps-500 dark:focus:ring-lps-400 focus:border-transparent transition-all duration-200"
            >
              <option value="daily">Harian</option>
              <option value="weekly">Mingguan</option>
              <option value="monthly">Bulanan</option>
              <option value="yearly">Tahunan</option>
            </select>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Rentang Tanggal:</label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lps-500 dark:focus:ring-lps-400 focus:border-transparent transition-all duration-200"
              />
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lps-500 dark:focus:ring-lps-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Alert untuk LPS Pending */}
      {reports.pendingCount > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0" />
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
              Peringatan: {reports.pendingCount} LPS masih dalam status pending
            </h3>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card hover className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Total LPS</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reports.totalLps?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card hover className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">LPS Selesai</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reports.finishedLps?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card hover className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
              <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Total PCS</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reports.totalPcs?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card hover className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-lps-100 dark:bg-lps-900/30 rounded-xl">
              <TrendingDown className="w-6 h-6 text-lps-600 dark:text-lps-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Rata-rata PCS</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reports.avgPcs?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - LPS per Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">LPS per Status</h3>
            <BarChart3 className="w-5 h-5 text-gray-500 dark:text-slate-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#7C3AED" name="Jumlah LPS" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Line Chart - Trend LPS */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trend LPS</h3>
            <TrendingUp className="w-5 h-5 text-gray-500 dark:text-slate-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#7C3AED" name="Jumlah LPS" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Pie Chart & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Distribusi per Customer */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Distribusi per Customer</h3>
            <FileText className="w-5 h-5 text-gray-500 dark:text-slate-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Items Table */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top 10 Item Terbanyak</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Nama Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Jumlah LPS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Total PCS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
                {reports.topItems?.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {item.nama_item}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                      {item.count?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                      {item.total_pcs?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LpsReports
