import { Link } from 'react-router-dom'
import { FileText, Package, Tags, ExternalLink } from 'lucide-react'
import Badge from './ui/Badge'

const IntegrationBadge = ({ type, data, showLink = true }) => {
  const configs = {
    spk: {
      icon: Package,
      label: 'SPK',
      color: 'blue',
      getLink: (no) => `/apps/material/spk?search=${no}`,
      getValue: () => data?.no_spk || data?.spk?.no_spk
    },
    lps: {
      icon: FileText,
      label: 'LPS',
      color: 'purple',
      getLink: (no) => `/apps/lps/list?search=${no}`,
      getValue: () => data?.no_lps || data?.lps?.no_lps
    },
    stock: {
      icon: Tags,
      label: 'Stock',
      color: 'green',
      getLink: (part) => `/apps/stoklabel/stock?search=${part}`,
      getValue: () => data?.part_number
    }
  }

  const config = configs[type]
  if (!config) return null

  const value = config.getValue()
  if (!value) return null

  const Icon = config.icon

  if (!showLink) {
    return (
      <Badge variant={config.color} className="inline-flex items-center gap-1.5">
        <Icon className="h-3 w-3" />
        <span className="text-xs">{value}</span>
      </Badge>
    )
  }

  return (
    <Link
      to={config.getLink(value)}
      className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
    >
      <Icon className="h-3 w-3" />
      <span>{value}</span>
      <ExternalLink className="h-3 w-3 opacity-50" />
    </Link>
  )
}

export default IntegrationBadge
