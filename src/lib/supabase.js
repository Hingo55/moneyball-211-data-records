import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
})

// Database service for 211 Moneyball statistics operations
export const statisticsDatabase = {
  // Service Statistics
  async getServiceStatistics() {
    const { data, error } = await supabase
      .from('service_statistics')
      .select('*')
      .order('created_at')
    
    if (error) {
      console.error('Error fetching service statistics:', error)
      throw error
    }
    return data
  },

  async updateStatisticScore(id, dimension, score) {
    const updateData = {}
    updateData[`${dimension}_score`] = parseInt(score)
    
    const { data, error } = await supabase
      .from('service_statistics')
      .update(updateData)
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('Error updating statistic score:', error)
      throw error
    }
    return data[0]
  },

  // Strategy Weights
  async getStrategyWeights() {
    const { data, error } = await supabase
      .from('strategy_weights')
      .select('*')
      .order('strategy_name')
    
    if (error) {
      console.error('Error fetching strategy weights:', error)
      throw error
    }
    return data
  },

  async getActiveStrategy() {
    const { data, error } = await supabase
      .from('strategy_weights')
      .select('*')
      .eq('is_active', true)
      .single()
    
    if (error) {
      console.error('Error fetching active strategy:', error)
      throw error
    }
    return data
  },

  async setActiveStrategy(strategyName) {
    // First, set all strategies to inactive
    await supabase
      .from('strategy_weights')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000') // Update all rows
    
    // Then, set the selected strategy to active
    const { data, error } = await supabase
      .from('strategy_weights')
      .update({ is_active: true })
      .eq('strategy_name', strategyName)
      .select()
    
    if (error) {
      console.error('Error setting active strategy:', error)
      throw error
    }
    return data[0]
  },

  async updateCustomWeights(validityWeight, relevanceWeight, actionabilityWeight) {
    // Create or update a custom strategy
    const { data, error } = await supabase
      .from('strategy_weights')
      .upsert({
        strategy_name: 'Custom Strategy',
        description: 'User-defined custom weighting strategy',
        validity_weight: parseFloat(validityWeight),
        relevance_weight: parseFloat(relevanceWeight),
        actionability_weight: parseFloat(actionabilityWeight),
        is_active: true
      })
      .select()
    
    if (error) {
      console.error('Error updating custom weights:', error)
      throw error
    }
    
    // Set all other strategies to inactive
    await supabase
      .from('strategy_weights')
      .update({ is_active: false })
      .neq('strategy_name', 'Custom Strategy')
    
    return data[0]
  },

  // Get calculated statistics with weighted scores
  async getCalculatedStatistics(strategyName = null) {
    let query = supabase
      .from('calculated_statistics')
      .select('*')
    
    if (strategyName) {
      query = query.eq('strategy_name', strategyName)
    }
    
    const { data, error } = await query.order('weighted_score', { ascending: false })
    
    if (error) {
      console.error('Error fetching calculated statistics:', error)
      throw error
    }
    return data
  },

  // Sync local data to database
  async syncStatisticsToDatabase(statisticsArray) {
    const updates = statisticsArray.map(stat => ({
      id: stat.id,
      validity_score: stat.validity,
      relevance_score: stat.relevance,
      actionability_score: stat.actionability
    }))

    const { data, error } = await supabase
      .from('service_statistics')
      .upsert(updates, { onConflict: 'id' })
      .select()
    
    if (error) {
      console.error('Error syncing statistics to database:', error)
      throw error
    }
    return data
  }
}