import { ArrowRight, Package, FileText, Tags, CheckCircle2, Clock } from 'lucide-react'
import Card from './ui/Card'
import Badge from './ui/Badge'

const IntegrationFlowCard = ({ flowData }) => {
  if (!flowData) return null

  const { spk, lps = [], stock_masuk = [], stock_keluar = [], flow_status } = flowData

  const steps = [
    {
      id: 'spk',
      label: 'SPK Created',
      icon: Package,
      completed: flow_status?.spk_created,
      data: spk,
      color: 'blue'
    },
    {
      id: 'lps',
      label: 'LPS Production',
      icon: FileText,
      completed: flow_status?.lps_created,
      data: lps[0],
      color: 'purple',
      subStatus: flow_status?.lps_finished ? 'Finished' : 'Pending'
    },
    {
      id: 'stock',
      label: 'Stock Received',
      icon: Tags,
      completed: flow_status?.stock_received,
      data: stock_masuk[0],
      color: 'green'
    },
    {
      id: 'shipped',
      label: 'Shipped',
      icon: CheckCircle2,
      completed: flow_status?.stock_shipped,
      data: stock_keluar[0],
      color: 'emerald'
    }
  ]

  return (
    <Card className="p-6">
      <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
        Production Flow
      </h3>

      <div className="relative">
        {/* Flow line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-gray-700" />

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isLast = index === steps.length - 1

            return (
              <div key={step.id} className="relative flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full ${
                    step.completed
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {step.label}
                    </h4>
                    {step.completed && (
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    )}
                    {!step.completed && index > 0 && (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                  </div>

                  {step.data && (
                    <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {step.id === 'spk' && (
                        <>
                          <p>No: {step.data.no_spk}</p>
                          <p>Item: {step.data.nama_item}</p>
                          <p>Qty: {step.data.jumlah_cetak_pcs} pcs</p>
                        </>
                      )}
                      {step.id === 'lps' && (
                        <>
                          <p>No: {step.data.no_lps}</p>
                          <p>Status: {step.data.status}</p>
                          {step.subStatus && (
                            <Badge
                              variant={step.subStatus === 'Finished' ? 'success' : 'warning'}
                              className="mt-1"
                            >
                              {step.subStatus}
                            </Badge>
                          )}
                        </>
                      )}
                      {step.id === 'stock' && (
                        <>
                          <p>Received: {step.data.tanggal}</p>
                          <p>Qty: {step.data.jumlah_order}</p>
                        </>
                      )}
                      {step.id === 'shipped' && (
                        <>
                          <p>Shipped: {step.data.tanggal}</p>
                          <p>Customer: {step.data.customer}</p>
                        </>
                      )}
                    </div>
                  )}

                  {!step.completed && index > 0 && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                      Waiting for previous step...
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {steps.filter(s => s.completed).length} / {steps.length} completed
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-green-600 transition-all dark:bg-green-500"
            style={{
              width: `${(steps.filter(s => s.completed).length / steps.length) * 100}%`
            }}
          />
        </div>
      </div>
    </Card>
  )
}

export default IntegrationFlowCard
