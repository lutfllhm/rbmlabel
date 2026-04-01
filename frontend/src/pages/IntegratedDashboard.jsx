import { useState, useEffect } from 'react'
import { Package, FileText, Tags, TrendingUp, Activity, ArrowRight } from 'lucide-react'
import api from '../services/api'
import Card from '../components/ui/Card'
import PageLoading from '../components/ui/PageLoading'
import Badge from '../components/ui/Badge'

const IntegratedDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)
  const [activities, setActivities] = useState([])

  useEffect(() => {
    fetchDashboardData()
    fetchActivities()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/integration/dashboard')
      setDashboardData(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchActivities = async () => {
    try {
      const response = await api.get('/integration/activities?limit=10')
      setActivities(response.data.activities)
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    }
  }

  if (loading) return <PageLoading />

  const stats = [
    {
      label: 'Total Materials',
      value: dashboardData?.material?.total_materials || 0,
      icon: Package,
      color: 'blue',
      subtext: `${dashboardData?.material?.total_rolls || 0} rolls`
    },
    {
      label: 'Active SPK',
      value: dashboardData?.spk?.total_spk || 0,
      icon: FileText,
      color: 'purple',
      subtext: `${dashboardData?.spk?.spk_this_month || 0} this month`
    },
    {
      label: 'LPS Production',
      value: dashboardData?.lps?.total_lps || 0,
      icon: TrendingUp,
      color: 'orange',
      subtext: `${dashboardData?.lps?.finished_lps || 0} finished`
    },
    {
      label: 'Stock Labels',
      value: dashboardData?.stock?.total_labels || 0,
      icon: Tags,
      color: 'green',
      subtext: `${dashboardData?.stock?.total_label_rolls || 0} rolls`
    }
  ]

  const integrationStats = [
    {
      label: 'SPK with LPS',
      value: dashboardData?.integration?.spk_with_lps || 0,
      total: dashboardData?.spk?.total_spk || 0
    },
    {
      label: 'LPS in Stock',
      value: dashboardData?.integration?.lps_in_stock || 0,
      total: dashboardData?.lps?.finished_lps || 0
    },
    {
      label: 'SPK without LPS',
      value: dashboardData?.integration?.spk_without_lps || 0,
      total: dashboardData?.spk?.total_spk || 0,
      warning: true
    }
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'spk':
        return Package
      case 'lps':
        return FileText
      case 'stock_masuk':
      case 'stock_keluar':
        return Tags
      default:
        return Activity
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'spk':
        return 'blue'
      case 'lps':
        return 'purple'
      case 'stock_masuk':
        return 'green'
      case 'stock_keluar':
        return 'orange'
      default:
        return 'gray'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Integrated Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Overview of all modules and their integration status
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    {stat.subtext}
                  </p>
                </div>
                <div
                  className={`rounded-full bg-${stat.color}-100 p-3 dark:bg-${stat.color}-900/30`}
                >
                  <Icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Integration Status */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Integration Status
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {integrationStats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-lg border p-4 ${
                stat.warning
                  ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20'
                  : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
              }`}
            >
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  / {stat.total}
                </p>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={`h-full ${
                    stat.warning
                      ? 'bg-orange-500'
                      : 'bg-green-500'
                  }`}
                  style={{
                    width: `${stat.total > 0 ? (stat.value / stat.total) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activities */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activities
          </h2>
          <Badge variant="gray">{activities.length} activities</Badge>
        </div>

        <div className="space-y-3">
          {activities.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-500">
              No recent activities
            </p>
          ) : (
            activities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type)
              const color = getActivityColor(activity.type)

              return (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
                >
                  <div
                    className={`rounded-full bg-${color}-100 p-2 dark:bg-${color}-900/30`}
                  >
                    <Icon className={`h-4 w-4 text-${color}-600 dark:text-${color}-400`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant={color} className="text-xs">
                        {activity.module}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      {activity.reference}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                      {activity.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              )
            })
          )}
        </div>
      </Card>

      {/* Module Links */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-6 transition hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
              <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Material Management
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Manage materials & SPK
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 transition hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
              <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                LPS Production
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Track production status
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 transition hover:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <Tags className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Stock Label
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Manage label inventory
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default IntegratedDashboard
