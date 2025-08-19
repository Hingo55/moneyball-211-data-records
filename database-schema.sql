-- 211 Moneyball Strategy Database Schema
-- Run this in your Supabase SQL editor to create the necessary tables

-- Organizations table
CREATE TABLE organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  location VARCHAR(255),
  contact_person VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),
  services TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Metrics table
CREATE TABLE metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  metric_name VARCHAR(255) NOT NULL,
  metric_type VARCHAR(100), -- KPI, Performance, Financial, etc.
  value DECIMAL(12,2),
  unit VARCHAR(50), -- percentage, dollars, count, etc.
  period_start DATE,
  period_end DATE,
  baseline_value DECIMAL(12,2),
  target_value DECIMAL(12,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Strategies table
CREATE TABLE strategies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- Operational, Financial, Strategic, etc.
  priority VARCHAR(50), -- High, Medium, Low
  status VARCHAR(50) DEFAULT 'Planning', -- Planning, In Progress, Completed, On Hold
  start_date DATE,
  target_date DATE,
  completion_date DATE,
  budget DECIMAL(12,2),
  expected_roi DECIMAL(5,2),
  responsible_person VARCHAR(255),
  success_metrics TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Strategy-Organization mapping (many-to-many)
CREATE TABLE strategy_organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role VARCHAR(100), -- Lead, Partner, Beneficiary, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data points table (for flexible metric storage)
CREATE TABLE data_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  strategy_id UUID REFERENCES strategies(id) ON DELETE SET NULL,
  category VARCHAR(100) NOT NULL,
  label VARCHAR(255) NOT NULL,
  value_numeric DECIMAL(12,2),
  value_text TEXT,
  value_date DATE,
  value_boolean BOOLEAN,
  tags VARCHAR(255)[],
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calculations table (for storing custom calculations)
CREATE TABLE calculations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  formula TEXT NOT NULL, -- JSON or string representation of formula
  result_type VARCHAR(50), -- number, percentage, currency, etc.
  input_parameters JSONB,
  last_result DECIMAL(12,2),
  last_calculated TIMESTAMP WITH TIME ZONE,
  created_by VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_organizations_name ON organizations(name);
CREATE INDEX idx_organizations_type ON organizations(type);
CREATE INDEX idx_metrics_organization_id ON metrics(organization_id);
CREATE INDEX idx_metrics_metric_type ON metrics(metric_type);
CREATE INDEX idx_metrics_period ON metrics(period_start, period_end);
CREATE INDEX idx_strategies_status ON strategies(status);
CREATE INDEX idx_strategies_priority ON strategies(priority);
CREATE INDEX idx_strategies_category ON strategies(category);
CREATE INDEX idx_data_points_organization_id ON data_points(organization_id);
CREATE INDEX idx_data_points_category ON data_points(category);
CREATE INDEX idx_data_points_created_at ON data_points(created_at);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_metrics_updated_at BEFORE UPDATE ON metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_strategies_updated_at BEFORE UPDATE ON strategies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_data_points_updated_at BEFORE UPDATE ON data_points FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calculations_updated_at BEFORE UPDATE ON calculations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) if needed
-- ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE strategy_organizations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE data_points ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;

-- Sample data for testing
INSERT INTO organizations (name, type, location, contact_person, phone, email, services) VALUES
('Community Health Center', 'Healthcare', 'Downtown', 'Dr. Sarah Johnson', '555-0101', 'sarah@chc.org', 'Primary care, mental health services, substance abuse treatment'),
('Food Bank Network', 'Nonprofit', 'Central District', 'Mike Rodriguez', '555-0102', 'mike@foodbank.org', 'Emergency food assistance, nutrition education, community gardens'),
('Housing Authority', 'Government', 'Multiple Locations', 'Lisa Chen', '555-0103', 'lisa@housing.gov', 'Affordable housing, rental assistance, homelessness prevention');

INSERT INTO strategies (title, description, category, priority, status, budget, expected_roi) VALUES
('Integrated Service Delivery', 'Develop coordinated service delivery model across partner organizations', 'Operational', 'High', 'Planning', 150000.00, 25.5),
('Data Sharing Platform', 'Implement secure data sharing platform for better coordination', 'Strategic', 'High', 'In Progress', 200000.00, 40.0),
('Community Outreach Enhancement', 'Expand outreach programs to underserved populations', 'Strategic', 'Medium', 'Planning', 75000.00, 15.8);