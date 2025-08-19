import { Target } from 'lucide-react'

const Strategies = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Strategies</h1>
          <p className="text-sm text-gray-500">Develop and track strategic initiatives</p>
        </div>
      </div>

      <div className="text-center py-12">
        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Strategic Planning</h3>
        <p className="text-gray-500 mb-4">
          This section will help you develop and track strategic initiatives based on your data analysis.
        </p>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Features coming soon:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Strategy creation and management</li>
            <li>Goal setting and tracking</li>
            <li>Initiative prioritization</li>
            <li>Progress monitoring</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Strategies