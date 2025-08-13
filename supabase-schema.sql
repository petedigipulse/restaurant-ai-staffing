-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create organizations table
CREATE TABLE organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    operating_hours JSONB NOT NULL DEFAULT '{}',
    owner_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create staff_members table
CREATE TABLE staff_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    hourly_wage DECIMAL(10,2) NOT NULL,
    guaranteed_hours INTEGER NOT NULL DEFAULT 0,
    employment_type VARCHAR(20) NOT NULL CHECK (employment_type IN ('full-time', 'part-time', 'casual')),
    performance_score INTEGER NOT NULL DEFAULT 80 CHECK (performance_score >= 0 AND performance_score <= 100),
    stations TEXT[] NOT NULL DEFAULT '{}',
    availability JSONB NOT NULL DEFAULT '{}',
    contact_info JSONB NOT NULL DEFAULT '{}',
    start_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on-leave')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create business_rules table
CREATE TABLE business_rules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    min_staffing_requirements JSONB NOT NULL DEFAULT '{}',
    labor_cost_management JSONB NOT NULL DEFAULT '{}',
    break_requirements JSONB NOT NULL DEFAULT '{}',
    shift_constraints JSONB NOT NULL DEFAULT '{}',
    additional_policies JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create schedules table
CREATE TABLE schedules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    shifts JSONB NOT NULL DEFAULT '{}',
    total_labor_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
    total_hours DECIMAL(8,2) NOT NULL DEFAULT 0,
    ai_generated BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create performance_metrics table
CREATE TABLE performance_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    staff_member_id UUID NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    attendance BOOLEAN NOT NULL DEFAULT true,
    performance_score INTEGER NOT NULL DEFAULT 80 CHECK (performance_score >= 0 AND performance_score <= 100),
    hours_worked DECIMAL(5,2) NOT NULL DEFAULT 0,
    overtime_hours DECIMAL(5,2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create integrations table
CREATE TABLE integrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('pos', 'accounting', 'hr', 'weather')),
    name VARCHAR(255) NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_staff_members_organization_id ON staff_members(organization_id);
CREATE INDEX idx_staff_members_email ON staff_members(email);
CREATE INDEX idx_staff_members_status ON staff_members(status);
CREATE INDEX idx_business_rules_organization_id ON business_rules(organization_id);
CREATE INDEX idx_schedules_organization_id ON schedules(organization_id);
CREATE INDEX idx_schedules_week_start_date ON schedules(week_start_date);
CREATE INDEX idx_performance_metrics_organization_id ON performance_metrics(organization_id);
CREATE INDEX idx_performance_metrics_staff_member_id ON performance_metrics(performance_metrics.staff_member_id);
CREATE INDEX idx_performance_metrics_date ON performance_metrics(performance_metrics.date);
CREATE INDEX idx_integrations_organization_id ON integrations(organization_id);
CREATE INDEX idx_integrations_type ON integrations(integrations.type);

-- Historical Sales Data Table
CREATE TABLE historical_sales_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  total_sales DECIMAL(10,2) NOT NULL,
  customer_count INTEGER NOT NULL,
  station_breakdown JSONB NOT NULL DEFAULT '{}',
  weather_conditions JSONB,
  special_events TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for historical data
CREATE INDEX idx_historical_sales_organization_id ON historical_sales_data(organization_id);
CREATE INDEX idx_historical_sales_date ON historical_sales_data(date);
CREATE INDEX idx_historical_sales_date_time ON historical_sales_data(date, time);

-- Create unique constraints
CREATE UNIQUE INDEX idx_organizations_owner_id ON organizations(owner_id);
CREATE UNIQUE INDEX idx_staff_members_organization_email ON staff_members(organization_id, email);
CREATE UNIQUE INDEX idx_business_rules_organization_unique ON business_rules(organization_id);
CREATE INDEX idx_schedules_organization_week ON schedules(organization_id, week_start_date);
CREATE UNIQUE INDEX idx_historical_sales_org_date_time ON historical_sales_data(organization_id, date, time);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_members_updated_at BEFORE UPDATE ON staff_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_rules_updated_at BEFORE UPDATE ON business_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_historical_sales_updated_at BEFORE UPDATE ON historical_sales_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_sales_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Organizations: Users can only access their own organization
CREATE POLICY "Users can view own organization" ON organizations
    FOR SELECT USING (auth.uid()::text = owner_id::text);

CREATE POLICY "Users can insert own organization" ON organizations
    FOR INSERT WITH CHECK (auth.uid()::text = owner_id::text);

CREATE POLICY "Users can update own organization" ON organizations
    FOR UPDATE USING (auth.uid()::text = owner_id::text);

-- Staff members: Users can only access staff in their organization
CREATE POLICY "Users can view staff in own organization" ON staff_members
    FOR SELECT USING (
        organization_id IN (
            SELECT id FROM organizations WHERE owner_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can insert staff in own organization" ON staff_members
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT id FROM organizations WHERE owner_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can update staff in own organization" ON staff_members
    FOR UPDATE USING (
        organization_id IN (
            SELECT id FROM organizations WHERE owner_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can delete staff in own organization" ON staff_members
    FOR DELETE USING (
        organization_id IN (
            SELECT id FROM organizations WHERE owner_id::text = auth.uid()::text
        )
    );

-- Business rules: Users can only access rules in their organization
CREATE POLICY "Users can view business rules in own organization" ON business_rules
    FOR SELECT USING (
        organization_id IN (
            SELECT id FROM organizations WHERE owner_id::text = auth.uid()::text
        )
    );

-- Historical sales data: Users can only access data in their organization
CREATE POLICY "Users can view historical sales in own organization" ON historical_sales_data
    FOR SELECT USING (
        organization_id IN (
            SELECT id FROM organizations WHERE owner_id::text = auth.uid()::text
        )
    );

-- Allow insertion if organization exists (for onboarding process)
CREATE POLICY "Users can insert historical sales in own organization" ON historical_sales_data
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT id FROM organizations
        )
    );

CREATE POLICY "Users can update historical sales in own organization" ON historical_sales_data
    FOR UPDATE USING (
        organization_id IN (
            SELECT id FROM organizations WHERE owner_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can delete historical sales in own organization" ON historical_sales_data
    FOR DELETE USING (
        organization_id IN (
            SELECT id FROM organizations WHERE owner_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can insert business rules in own organization" ON business_rules
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT id FROM organizations WHERE owner_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can update business rules in own organization" ON business_rules
    FOR UPDATE USING (
        organization_id IN (
            SELECT id FROM organizations WHERE owner_id::text = auth.uid()::text
        )
    );

-- Schedules: Users can only access schedules in their organization
CREATE POLICY "Users can view schedules in own organization" ON schedules
    FOR SELECT USING (
        organization_id IN (
            SELECT id FROM organizations WHERE owner_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can insert schedules in own organization" ON schedules
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT id FROM organizations WHERE owner_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can update schedules in own organization" ON schedules
    FOR UPDATE USING (
        organization_id IN (
            SELECT id FROM organizations WHERE owner_id::text = auth.uid()::text
        )
    );

-- Performance metrics: Users can only access metrics in their organization
CREATE POLICY "Users can view performance metrics in own organization" ON performance_metrics
    FOR SELECT USING (
        organization_id IN (
            SELECT id FROM organizations WHERE owner_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can insert performance metrics in own organization" ON performance_metrics
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT id FROM organizations WHERE owner_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can update performance metrics in own organization" ON performance_metrics
    FOR UPDATE USING (
        organization_id IN (
            SELECT id FROM organizations WHERE owner_id::text = auth.uid()::text
        )
    );

-- Integrations: Users can only access integrations in their organization
CREATE POLICY "Users can view integrations in own organization" ON integrations
    FOR SELECT USING (
        organization_id IN (
            SELECT id FROM organizations WHERE owner_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can insert integrations in own organization" ON integrations
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT id FROM organizations WHERE owner_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can update integrations in own organization" ON integrations
    FOR UPDATE USING (
        organization_id IN (
            SELECT id FROM organizations WHERE owner_id::text = auth.uid()::text
        )
    );

-- Insert sample data for testing
INSERT INTO organizations (id, name, type, timezone, operating_hours, owner_id) VALUES
(
    '550e8400-e29b-41d4-a716-446655440000',
    'Sample Restaurant',
    'Restaurant',
    'Pacific/Auckland',
    '{"monday": {"open": "09:00", "close": "22:00"}, "tuesday": {"open": "09:00", "close": "22:00"}, "wednesday": {"open": "09:00", "close": "22:00"}, "thursday": {"open": "09:00", "close": "22:00"}, "friday": {"open": "09:00", "close": "23:00"}, "saturday": {"open": "10:00", "close": "23:00"}, "sunday": {"open": "10:00", "close": "21:00"}}',
    '550e8400-e29b-41d4-a716-446655440001'
);
