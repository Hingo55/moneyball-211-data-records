import { TrendingUp } from 'lucide-react'

const Metrics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Metrics</h1>
          <p className="text-sm text-gray-500">Track and analyze performance metrics</p>
        </div>
      </div>

      <div className="text-center py-12">
        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Metrics Management</h3>
        <p className="text-gray-500 mb-4">
          This section will allow you to track performance metrics, KPIs, and data points from your Excel analysis.
        </p>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Features coming soon:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Data input forms for metrics</li>
            <li>Trend analysis and visualizations</li>
            <li>Performance benchmarking</li>
            <li>Custom calculations</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Metrics