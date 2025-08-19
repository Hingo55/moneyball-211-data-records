import { useState, useMemo, useEffect } from 'react'
import { statisticsDatabase } from './lib/supabase'

const serviceRecordStatistics = [
  {
    id: 1,
    statistic: "Verification Date",
    whyItMatters: "Ensures data accuracy and currency for decision-making",
    underlyingAssumptions: "Recent verification indicates higher data reliability and relevance",
    potentialFlaws: "Verification frequency may not reflect actual data quality; some stable data doesn't need frequent updates",
    validity: 5,
    relevance: 4,
    actionability: 3
  },
  {
    id: 2,
    statistic: "Referral Count",
    whyItMatters: "Indicates service utilization and community demand patterns",
    underlyingAssumptions: "Higher referral counts suggest greater service relevance and effectiveness",
    potentialFlaws: "May reflect marketing success rather than service quality; doesn't account for referral success rates",
    validity: 4,
    relevance: 5,
    actionability: 4
  },
  {
    id: 3,
    statistic: "Record Completeness Score",
    whyItMatters: "Complete records enable better matching and comprehensive service delivery",
    underlyingAssumptions: "More complete data leads to better service outcomes and decision-making",
    potentialFlaws: "Completeness doesn't guarantee accuracy; some fields may be irrelevant for certain services",
    validity: 5,
    relevance: 4,
    actionability: 5
  },
  {
    id: 4,
    statistic: "Response Time Metrics",
    whyItMatters: "Critical for emergency services and client satisfaction",
    underlyingAssumptions: "Faster response times correlate with better client outcomes and service effectiveness",
    potentialFlaws: "Quality may be sacrificed for speed; some services benefit from thoughtful, slower approaches",
    validity: 4,
    relevance: 5,
    actionability: 4
  },
  {
    id: 5,
    statistic: "Success Rate Percentage",
    whyItMatters: "Direct measure of service effectiveness and client outcomes",
    underlyingAssumptions: "Higher success rates indicate better service quality and resource allocation efficiency",
    potentialFlaws: "Success definitions vary; cherry-picking easier cases; external factors influence outcomes",
    validity: 5,
    relevance: 5,
    actionability: 3
  },
  {
    id: 6,
    statistic: "Geographic Coverage Area",
    whyItMatters: "Determines service accessibility and equity across communities",
    underlyingAssumptions: "Broader coverage ensures more equitable access to services",
    potentialFlaws: "Coverage breadth may dilute service quality; travel distances may still create barriers",
    validity: 4,
    relevance: 4,
    actionability: 3
  },
  {
    id: 7,
    statistic: "Funding Stability Index",
    whyItMatters: "Predicts service continuity and long-term planning capability",
    underlyingAssumptions: "Stable funding leads to consistent service delivery and better outcomes",
    potentialFlaws: "Funding stability doesn't guarantee service quality; may encourage complacency",
    validity: 3,
    relevance: 4,
    actionability: 2
  },
  {
    id: 8,
    statistic: "Wait Time Duration",
    whyItMatters: "Impacts client satisfaction and service accessibility",
    underlyingAssumptions: "Shorter wait times improve client experience and service effectiveness",
    potentialFlaws: "Rush processing may reduce quality; some services require time for proper assessment",
    validity: 4,
    relevance: 4,
    actionability: 4
  },
  {
    id: 9,
    statistic: "Staff Certification Level",
    whyItMatters: "Indicates service quality and professional competency",
    underlyingAssumptions: "Higher certification levels correlate with better service delivery and outcomes",
    potentialFlaws: "Certifications may not reflect practical skills; over-qualification may increase costs unnecessarily",
    validity: 3,
    relevance: 3,
    actionability: 3
  },
  {
    id: 10,
    statistic: "Client Satisfaction Rating",
    whyItMatters: "Direct feedback on service quality and client experience",
    underlyingAssumptions: "Higher satisfaction indicates better service quality and client-centered approach",
    potentialFlaws: "Response bias; satisfied clients more likely to respond; satisfaction doesn't always equal effectiveness",
    validity: 4,
    relevance: 4,
    actionability: 4
  }
]

const strategies = {
  'impact-first': {
    name: 'Impact-First Strategy',
    description: 'Prioritizes services with highest overall scores and success rates',
    weights: { validity: 0.4, relevance: 0.4, actionability: 0.2 }
  },
  'balanced': {
    name: 'Balanced Strategy',
    description: 'Equal weighting across all three scoring dimensions',
    weights: { validity: 0.33, relevance: 0.33, actionability: 0.34 }
  },
  'maintenance-first': {
    name: 'Maintenance-First Strategy',
    description: 'Focuses on actionable, reliable services with quick response times',
    weights: { validity: 0.2, relevance: 0.3, actionability: 0.5 }
  }
}

function StatisticsTable({ statistics, strategy, onScoreChange }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statistic
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Why It Matters
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Underlying Assumptions
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Potential Flaws / Blind Spots
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Validity
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Relevance
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actionability
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Weighted Score
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {statistics.map((stat, index) => {
              return (
                <tr key={stat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-gray-900 text-white px-2 py-1 rounded-full text-sm font-bold">
                        #{index + 1}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{stat.statistic}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 max-w-xs">{stat.whyItMatters}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 max-w-xs">{stat.underlyingAssumptions}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 max-w-xs">{stat.potentialFlaws}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={stat.currentScores.validity}
                      onChange={(e) => onScoreChange(stat.id, 'validity', e.target.value)}
                      className="w-16 px-2 py-1 text-center text-lg font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map(score => (
                        <option key={score} value={score}>{score}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={stat.currentScores.relevance}
                      onChange={(e) => onScoreChange(stat.id, 'relevance', e.target.value)}
                      className="w-16 px-2 py-1 text-center text-lg font-bold text-green-600 bg-green-50 border border-green-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {[1, 2, 3, 4, 5].map(score => (
                        <option key={score} value={score}>{score}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={stat.currentScores.actionability}
                      onChange={(e) => onScoreChange(stat.id, 'actionability', e.target.value)}
                      className="w-16 px-2 py-1 text-center text-lg font-bold text-purple-600 bg-purple-50 border border-purple-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {[1, 2, 3, 4, 5].map(score => (
                        <option key={score} value={score}>{score}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-lg font-bold text-gray-900">{stat.weightedScore.toFixed(2)}</div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function App() {
  const [selectedStrategy, setSelectedStrategy] = useState('balanced')
  const [weights, setWeights] = useState({
    validity: 0.33,
    relevance: 0.33,
    actionability: 0.34
  })
  const [statisticScores, setStatisticScores] = useState(() => {
    // Initialize with default scores from serviceRecordStatistics
    const scores = {}
    serviceRecordStatistics.forEach(stat => {
      scores[stat.id] = {
        validity: stat.validity,
        relevance: stat.relevance,
        actionability: stat.actionability
      }
    })
    return scores
  })
  const [isLoading, setIsLoading] = useState(true)
  const [dbStatistics, setDbStatistics] = useState([])
  const [availableStrategies, setAvailableStrategies] = useState([])
  const [isSorted, setIsSorted] = useState(false)

  // Load data from Supabase on component mount
  useEffect(() => {
    loadDataFromDatabase()
  }, [])

  const loadDataFromDatabase = async () => {
    try {
      setIsLoading(true)
      
      // Load statistics and strategy weights from database
      const [statistics, strategies] = await Promise.all([
        statisticsDatabase.getServiceStatistics(),
        statisticsDatabase.getStrategyWeights()
      ])

      if (statistics && statistics.length > 0) {
        setDbStatistics(statistics)
        
        // Update statisticScores with database values using UUID IDs
        const scores = {}
        statistics.forEach(stat => {
          scores[stat.id] = {
            validity: stat.validity_score,
            relevance: stat.relevance_score,
            actionability: stat.actionability_score
          }
        })
        setStatisticScores(scores)
      } else {
        // If no database data, ensure local data scores are properly set
        const scores = {}
        serviceRecordStatistics.forEach(stat => {
          scores[stat.id] = {
            validity: stat.validity,
            relevance: stat.relevance,
            actionability: stat.actionability
          }
        })
        setStatisticScores(scores)
      }

      if (strategies && strategies.length > 0) {
        setAvailableStrategies(strategies)
        
        // Find active strategy and set weights
        const activeStrategy = strategies.find(s => s.is_active)
        if (activeStrategy) {
          setWeights({
            validity: activeStrategy.validity_weight,
            relevance: activeStrategy.relevance_weight,
            actionability: activeStrategy.actionability_weight
          })
          setSelectedStrategy(activeStrategy.strategy_name.toLowerCase().replace(/[^a-z]/g, ''))
        }
      }
    } catch (error) {
      console.error('Error loading data from database:', error)
      // Continue with local data if database fails
      console.log('Using local data as fallback')
      
      // Ensure local data scores are properly set
      const scores = {}
      serviceRecordStatistics.forEach(stat => {
        scores[stat.id] = {
          validity: stat.validity,
          relevance: stat.relevance,
          actionability: stat.actionability
        }
      })
      setStatisticScores(scores)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStrategyChange = (strategyKey) => {
    setSelectedStrategy(strategyKey)
    setWeights(strategies[strategyKey].weights)
  }

  const handleSliderChange = (dimension, value) => {
    const newValue = parseFloat(value)
    const otherDimensions = Object.keys(weights).filter(key => key !== dimension)
    const remainingWeight = 1 - newValue
    
    // Distribute remaining weight proportionally among other dimensions
    const currentOtherTotal = otherDimensions.reduce((sum, key) => sum + weights[key], 0)
    
    const newWeights = { ...weights, [dimension]: newValue }
    
    if (currentOtherTotal > 0) {
      otherDimensions.forEach(key => {
        newWeights[key] = (weights[key] / currentOtherTotal) * remainingWeight
      })
    } else {
      // If other dimensions are 0, distribute equally
      const equalShare = remainingWeight / otherDimensions.length
      otherDimensions.forEach(key => {
        newWeights[key] = equalShare
      })
    }
    
    setWeights(newWeights)
    setSelectedStrategy('') // Clear radio selection when manually adjusting
  }

  const handleScoreChange = async (statisticId, dimension, score) => {
    console.log('Score change:', { statisticId, dimension, score })
    
    // Reset sorting when scores change so user can edit freely
    setIsSorted(false)
    
    // Update local state immediately for responsive UI
    setStatisticScores(prev => {
      const newScores = {
        ...prev,
        [statisticId]: {
          ...prev[statisticId],
          [dimension]: parseInt(score)
        }
      }
      console.log('Updated scores:', newScores)
      return newScores
    })

    // Save to database only if we have database data
    if (dbStatistics.length > 0) {
      try {
        await statisticsDatabase.updateStatisticScore(statisticId, dimension, score)
        console.log('Saved to database successfully')
      } catch (error) {
        console.error('Error saving score to database:', error)
        // Could show a toast notification here
      }
    }
  }

  const rankedStatistics = useMemo(() => {
    // Use database statistics if available, otherwise fall back to local data
    const statisticsToUse = dbStatistics.length > 0 ? dbStatistics : serviceRecordStatistics
    
    const statisticsWithScores = [...statisticsToUse]
      .map(stat => {
        const scores = statisticScores[stat.id] || {
          validity: stat.validity_score || stat.validity || 3,
          relevance: stat.relevance_score || stat.relevance || 3,
          actionability: stat.actionability_score || stat.actionability || 3
        }
        return {
          ...stat,
          // Ensure we have the right field names for display
          statistic: stat.statistic || stat.name,
          whyItMatters: stat.why_it_matters || stat.whyItMatters,
          underlyingAssumptions: stat.underlying_assumptions || stat.underlyingAssumptions,
          potentialFlaws: stat.potential_flaws || stat.potentialFlaws,
          currentScores: scores,
          weightedScore: (
            scores.validity * weights.validity +
            scores.relevance * weights.relevance +
            scores.actionability * weights.actionability
          )
        }
      })

    // Only sort if isSorted is true, otherwise maintain original order
    if (isSorted) {
      return statisticsWithScores.sort((a, b) => b.weightedScore - a.weightedScore)
    } else {
      return statisticsWithScores
    }
  }, [weights, statisticScores, dbStatistics, isSorted])

  const handleSortByPriority = () => {
    setIsSorted(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Loading MoneyBall Data...</h2>
          <p className="text-gray-600">Connecting to Supabase database</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            MoneyBall for 211 Data Records
          </h1>
          <p className="text-gray-600 text-lg">
            Strategic analysis and prioritization of service record statistics
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Strategy Configuration</h2>
          
          {/* Radio Button Strategy Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preset Strategies</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(strategies).map(([key, strategy]) => (
                <label key={key} className="cursor-pointer">
                  <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedStrategy === key
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                    <div className="flex items-center mb-3">
                      <input
                        type="radio"
                        name="strategy"
                        value={key}
                        checked={selectedStrategy === key}
                        onChange={() => handleStrategyChange(key)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <h4 className="ml-2 font-semibold text-gray-900">{strategy.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Validity: {(strategy.weights.validity * 100).toFixed(0)}%</div>
                      <div>Relevance: {(strategy.weights.relevance * 100).toFixed(0)}%</div>
                      <div>Actionability: {(strategy.weights.actionability * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Interactive Sliders */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Custom Weight Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Validity Slider */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Validity Weight: {(weights.validity * 100).toFixed(1)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.validity}
                  onChange={(e) => handleSliderChange('validity', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-blue"
                />
                <div className="text-xs text-gray-500">Data accuracy and trustworthiness</div>
              </div>

              {/* Relevance Slider */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Relevance Weight: {(weights.relevance * 100).toFixed(1)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.relevance}
                  onChange={(e) => handleSliderChange('relevance', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
                />
                <div className="text-xs text-gray-500">Importance to organizational goals</div>
              </div>

              {/* Actionability Slider */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Actionability Weight: {(weights.actionability * 100).toFixed(1)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.actionability}
                  onChange={(e) => handleSliderChange('actionability', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-purple"
                />
                <div className="text-xs text-gray-500">Ability to take action on the data</div>
              </div>
            </div>

            {/* Total Weight Indicator */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total Weight:</span>
                <span className={`text-lg font-bold ${
                  Math.abs((weights.validity + weights.relevance + weights.actionability) - 1) < 0.01 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {((weights.validity + weights.relevance + weights.actionability) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                Service Record Statistic Priority
              </h2>
              <button
                onClick={handleSortByPriority}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isSorted 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isSorted ? '✓ Sorted by Priority' : 'List in Priority Order'}
              </button>
              <button
                onClick={loadDataFromDatabase}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg font-medium bg-gray-600 hover:bg-gray-700 text-white transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? '🔄 Loading...' : '🔄 Refresh Data'}
              </button>
            </div>
            <div className="text-sm text-gray-500">
              {rankedStatistics.length} statistics {isSorted ? 'ranked' : 'listed'}
            </div>
          </div>
        </div>

        <StatisticsTable 
          statistics={rankedStatistics} 
          strategy={{ weights }}
          onScoreChange={handleScoreChange}
        />

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategy Impact Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {(rankedStatistics.slice(0, 3).reduce((sum, r) => sum + r.currentScores.validity, 0) / 3).toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">Avg Top 3 Validity</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {(rankedStatistics.slice(0, 3).reduce((sum, r) => sum + r.currentScores.relevance, 0) / 3).toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">Avg Top 3 Relevance</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {(rankedStatistics.slice(0, 3).reduce((sum, r) => sum + r.currentScores.actionability, 0) / 3).toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">Avg Top 3 Actionability</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
