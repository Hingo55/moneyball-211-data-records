-- Service Record Statistics Database Schema
-- Run this in your Supabase SQL editor to create the statistics tables

-- Service Record Statistics table
CREATE TABLE service_statistics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  statistic VARCHAR(255) NOT NULL UNIQUE,
  why_it_matters TEXT NOT NULL,
  underlying_assumptions TEXT NOT NULL,
  potential_flaws TEXT NOT NULL,
  validity_score INTEGER CHECK (validity_score >= 1 AND validity_score <= 5) DEFAULT 3,
  relevance_score INTEGER CHECK (relevance_score >= 1 AND relevance_score <= 5) DEFAULT 3,
  actionability_score INTEGER CHECK (actionability_score >= 1 AND actionability_score <= 5) DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Strategy Weights table (to store different weighting strategies)
CREATE TABLE strategy_weights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  strategy_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  validity_weight DECIMAL(3,2) CHECK (validity_weight >= 0 AND validity_weight <= 1) DEFAULT 0.33,
  relevance_weight DECIMAL(3,2) CHECK (relevance_weight >= 0 AND relevance_weight <= 1) DEFAULT 0.33,
  actionability_weight DECIMAL(3,2) CHECK (actionability_weight >= 0 AND actionability_weight <= 1) DEFAULT 0.34,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT weights_sum_equals_one CHECK (validity_weight + relevance_weight + actionability_weight = 1.0)
);

-- Calculated Scores view (for real-time weighted score calculation)
CREATE OR REPLACE VIEW calculated_statistics AS
SELECT 
  ss.id,
  ss.statistic,
  ss.why_it_matters,
  ss.underlying_assumptions,
  ss.potential_flaws,
  ss.validity_score,
  ss.relevance_score,
  ss.actionability_score,
  sw.strategy_name,
  sw.validity_weight,
  sw.relevance_weight,
  sw.actionability_weight,
  ROUND(
    (ss.validity_score * sw.validity_weight + 
     ss.relevance_score * sw.relevance_weight + 
     ss.actionability_score * sw.actionability_weight), 2
  ) AS weighted_score,
  ss.updated_at
FROM service_statistics ss
CROSS JOIN strategy_weights sw
WHERE sw.is_active = true
ORDER BY weighted_score DESC, ss.statistic;

-- Create indexes for better performance
CREATE INDEX idx_service_statistics_statistic ON service_statistics(statistic);
CREATE INDEX idx_service_statistics_scores ON service_statistics(validity_score, relevance_score, actionability_score);
CREATE INDEX idx_strategy_weights_active ON strategy_weights(is_active);
CREATE INDEX idx_strategy_weights_name ON strategy_weights(strategy_name);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create updated_at triggers
CREATE TRIGGER update_service_statistics_updated_at 
  BEFORE UPDATE ON service_statistics 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_strategy_weights_updated_at 
  BEFORE UPDATE ON strategy_weights 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert the default service statistics
INSERT INTO service_statistics (statistic, why_it_matters, underlying_assumptions, potential_flaws, validity_score, relevance_score, actionability_score) VALUES
('Verification Date', 'Ensures data accuracy and currency for decision-making', 'Recent verification indicates higher data reliability and relevance', 'Verification frequency may not reflect actual data quality; some stable data doesn''t need frequent updates', 5, 4, 3),
('Referral Count', 'Indicates service utilization and community demand patterns', 'Higher referral counts suggest greater service relevance and effectiveness', 'May reflect marketing success rather than service quality; doesn''t account for referral success rates', 4, 5, 4),
('Record Completeness Score', 'Complete records enable better matching and comprehensive service delivery', 'More complete data leads to better service outcomes and decision-making', 'Completeness doesn''t guarantee accuracy; some fields may be irrelevant for certain services', 5, 4, 5),
('Response Time Metrics', 'Critical for emergency services and client satisfaction', 'Faster response times correlate with better client outcomes and service effectiveness', 'Quality may be sacrificed for speed; some services benefit from thoughtful, slower approaches', 4, 5, 4),
('Success Rate Percentage', 'Direct measure of service effectiveness and client outcomes', 'Higher success rates indicate better service quality and resource allocation efficiency', 'Success definitions vary; cherry-picking easier cases; external factors influence outcomes', 5, 5, 3),
('Geographic Coverage Area', 'Determines service accessibility and equity across communities', 'Broader coverage ensures more equitable access to services', 'Coverage breadth may dilute service quality; travel distances may still create barriers', 4, 4, 3),
('Funding Stability Index', 'Predicts service continuity and long-term planning capability', 'Stable funding leads to consistent service delivery and better outcomes', 'Funding stability doesn''t guarantee service quality; may encourage complacency', 3, 4, 2),
('Wait Time Duration', 'Impacts client satisfaction and service accessibility', 'Shorter wait times improve client experience and service effectiveness', 'Rush processing may reduce quality; some services require time for proper assessment', 4, 4, 4),
('Staff Certification Level', 'Indicates service quality and professional competency', 'Higher certification levels correlate with better service delivery and outcomes', 'Certifications may not reflect practical skills; over-qualification may increase costs unnecessarily', 3, 3, 3),
('Client Satisfaction Rating', 'Direct feedback on service quality and client experience', 'Higher satisfaction indicates better service quality and client-centered approach', 'Response bias; satisfied clients more likely to respond; satisfaction doesn''t always equal effectiveness', 4, 4, 4);

-- Insert the default strategy weights
INSERT INTO strategy_weights (strategy_name, description, validity_weight, relevance_weight, actionability_weight) VALUES
('Impact-First Strategy', 'Prioritizes services with highest overall scores and success rates', 0.40, 0.40, 0.20),
('Balanced Strategy', 'Equal weighting across all three scoring dimensions', 0.33, 0.33, 0.34),
('Maintenance-First Strategy', 'Focuses on actionable, reliable services with quick response times', 0.20, 0.30, 0.50);

-- Set the Balanced Strategy as the default active strategy
UPDATE strategy_weights SET is_active = false;
UPDATE strategy_weights SET is_active = true WHERE strategy_name = 'Balanced Strategy';