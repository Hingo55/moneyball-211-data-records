import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, Target, AlertCircle } from 'lucide-react'
import { moneyballDatabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    organizations: [],
    metrics: [],
    strategies: [],
    summary: {
      totalOrganizations: 0,
      totalMetrics: 0,
      totalStrategies: 0,
      lastUpdated: new Date().toISOString()
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await moneyballDatabase.getDashboardData()
      setDashboardData(data)
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
      setError('Failed to load dashboard data. Please check your Supabase connection.')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Connection Error</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="btn-primary"
          >
            Try Again
          </button>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Getting Started:</h4>
            <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
              <li>Set up your Supabase project at <a href="https://supabase.com" className="underline">supabase.com</a></li>
              <li>Update the .env file with your Supabase URL and anon key</li>
              <li>Create the database tables using the schema provided</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  const { summary } = dashboardData

  const metricCards = [
    {
      title: 'Organizations',
      value: summary.totalOrganizations,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      description: 'Active organizations tracked'
    },
    {
      title: 'Metrics',
      value: summary.totalMetrics,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      description: 'Performance metrics monitored'
    },
    {
      title: 'Strategies',
      value: summary.totalStrategies,
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      description: 'Strategic initiatives tracked'
    },
    {
      title: 'Data Points',
      value: summary.totalOrganizations + summary.totalMetrics + summary.totalStrategies,
      icon: BarChart3,
      color: 'from-orange-500 to-orange-600',
      description: 'Total data points managed'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Welcome to 211 Moneyball Strategy Platform
          </h2>
          <p className="text-gray-500">
            Transform your Excel-based analysis into an interactive, real-time data management system. 
            Track organizations, analyze metrics, and develop strategic insights with powerful calculations and visualizations.
          </p>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={index} className={`metric-card ${card.color}`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-white truncate">
                      {card.title}
                    </dt>
                    <dd className="text-3xl font-bold text-white">
                      {card.value}
                    </dd>
                    <dd className="text-sm text-white opacity-75">
                      {card.description}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="btn-primary text-left p-4 h-auto">
              <Users className="h-6 w-6 mb-2" />
              <div className="font-medium">Add Organization</div>
              <div className="text-sm opacity-75">Register a new organization</div>
            </button>
            <button className="btn-primary text-left p-4 h-auto">
              <TrendingUp className="h-6 w-6 mb-2" />
              <div className="font-medium">Record Metric</div>
              <div className="text-sm opacity-75">Track performance data</div>
            </button>
            <button className="btn-primary text-left p-4 h-auto">
              <Target className="h-6 w-6 mb-2" />
              <div className="font-medium">Create Strategy</div>
              <div className="text-sm opacity-75">Develop new strategic initiative</div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          {dashboardData.organizations.length === 0 && dashboardData.metrics.length === 0 && dashboardData.strategies.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Get Started</h4>
              <p className="text-gray-500 mb-4">
                Start by adding your organizations, metrics, and strategies to see them here.
              </p>
              <div className="flex justify-center space-x-4">
                <button className="btn-primary">Add Organization</button>
                <button className="btn-secondary">Import Data</button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {dashboardData.organizations.slice(0, 3).map((org, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">{org.name}</div>
                    <div className="text-sm text-gray-500">Organization</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard