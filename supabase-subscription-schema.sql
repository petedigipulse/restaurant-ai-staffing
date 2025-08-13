-- Subscription and Billing Database Schema
-- This file contains all the tables and functions needed for the commercialization service

-- 1. Subscription Plans Table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    price_monthly INTEGER NOT NULL, -- Price in cents
    price_yearly INTEGER NOT NULL, -- Price in cents (with discount)
    max_staff INTEGER NOT NULL,
    features JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, past_due, canceled, etc.
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Billing History Table
CREATE TABLE IF NOT EXISTS billing_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    stripe_invoice_id VARCHAR(255) UNIQUE,
    amount INTEGER NOT NULL, -- Amount in cents
    currency VARCHAR(3) DEFAULT 'usd',
    status VARCHAR(50) NOT NULL, -- paid, pending, failed, etc.
    billing_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Usage Tracking Table
CREATE TABLE IF NOT EXISTS usage_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value INTEGER NOT NULL DEFAULT 0,
    tracking_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, metric_name, tracking_date)
);

-- 5. Insert Default Subscription Plans
INSERT INTO subscription_plans (name, slug, price_monthly, price_yearly, max_staff, features) VALUES
(
    'Starter',
    'starter',
    2900, -- $29.00
    29000, -- $290.00 (no discount for now)
    10,
    '["Basic AI Scheduling", "Staff Management", "CSV Import", "Email Support"]'
),
(
    'Professional',
    'professional',
    7900, -- $79.00
    79000, -- $790.00 (no discount for now)
    25,
    '["Advanced AI Optimization", "Weather Integration", "Analytics Dashboard", "Performance Metrics", "Priority Support"]'
),
(
    'Enterprise',
    'enterprise',
    19900, -- $199.00
    199000, -- $1,990.00 (no discount for now)
    -1, -- Unlimited
    '["Custom Integrations", "API Access", "White-label Options", "Dedicated Support", "Custom Features"]'
)
ON CONFLICT (slug) DO NOTHING;

-- 6. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_organization_id ON subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_subscription_id ON billing_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_organization_date ON usage_tracking(organization_id, tracking_date);

-- 7. Enable Row Level Security
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS Policies
-- Subscription plans are readable by all authenticated users
CREATE POLICY "subscription_plans_read_policy" ON subscription_plans
    FOR SELECT USING (true);

-- Subscriptions are readable by organization members
CREATE POLICY "subscriptions_read_policy" ON subscriptions
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM staff_members 
            WHERE user_id = auth.jwt() ->> 'id'
        )
    );

-- Subscriptions can be created/updated by organization owners
CREATE POLICY "subscriptions_write_policy" ON subscriptions
    FOR ALL USING (
        organization_id IN (
            SELECT id FROM organizations 
            WHERE owner_id = auth.jwt() ->> 'id'
        )
    );

-- Billing history is readable by organization members
CREATE POLICY "billing_history_read_policy" ON billing_history
    FOR SELECT USING (
        subscription_id IN (
            SELECT s.id FROM subscriptions s
            JOIN organizations o ON s.organization_id = o.id
            WHERE o.owner_id = auth.jwt() ->> 'id'
        )
    );

-- Usage tracking is readable by organization members
CREATE POLICY "usage_tracking_read_policy" ON usage_tracking
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM staff_members 
            WHERE user_id = auth.jwt() ->> 'id'
        )
    );

-- Usage tracking can be updated by the system (for tracking purposes)
CREATE POLICY "usage_tracking_write_policy" ON usage_tracking
    FOR INSERT WITH CHECK (true);

-- 9. Create Helper Functions
-- Function to get current subscription for an organization
CREATE OR REPLACE FUNCTION get_organization_subscription(org_id UUID)
RETURNS TABLE (
    plan_name VARCHAR(100),
    plan_slug VARCHAR(50),
    max_staff INTEGER,
    features JSONB,
    status VARCHAR(50),
    current_period_end TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sp.name,
        sp.slug,
        sp.max_staff,
        sp.features,
        s.status,
        s.current_period_end
    FROM subscriptions s
    JOIN subscription_plans sp ON s.plan_id = sp.id
    WHERE s.organization_id = org_id
    AND s.status = 'active'
    ORDER BY s.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if organization can add more staff
CREATE OR REPLACE FUNCTION can_add_staff(org_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    current_plan_max INTEGER;
    current_staff_count INTEGER;
BEGIN
    -- Get current plan's max staff limit
    SELECT sp.max_staff INTO current_plan_max
    FROM subscriptions s
    JOIN subscription_plans sp ON s.plan_id = sp.id
    WHERE s.organization_id = org_id
    AND s.status = 'active'
    ORDER BY s.created_at DESC
    LIMIT 1;
    
    -- If no subscription, limit to 5 staff (free tier)
    IF current_plan_max IS NULL THEN
        current_plan_max := 5;
    END IF;
    
    -- If unlimited (-1), always allow
    IF current_plan_max = -1 THEN
        RETURN true;
    END IF;
    
    -- Get current staff count
    SELECT COUNT(*) INTO current_staff_count
    FROM staff_members
    WHERE organization_id = org_id;
    
    RETURN current_staff_count < current_plan_max;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create Triggers for Automatic Updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscription_plans_updated_at
    BEFORE UPDATE ON subscription_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Add subscription_id to organizations table for easier access
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS current_subscription_id UUID REFERENCES subscriptions(id);

-- 12. Create a view for easy subscription access
CREATE OR REPLACE VIEW organization_subscriptions AS
SELECT 
    o.id as organization_id,
    o.name as organization_name,
    s.id as subscription_id,
    sp.name as plan_name,
    sp.slug as plan_slug,
    sp.price_monthly,
    sp.price_yearly,
    sp.max_staff,
    sp.features,
    s.status as subscription_status,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at_period_end
FROM organizations o
LEFT JOIN subscriptions s ON o.id = s.organization_id AND s.status = 'active'
LEFT JOIN subscription_plans sp ON s.plan_id = sp.id;

-- Grant permissions
GRANT SELECT ON organization_subscriptions TO authenticated;
GRANT SELECT ON subscription_plans TO authenticated;
GRANT SELECT, INSERT, UPDATE ON subscriptions TO authenticated;
GRANT SELECT ON billing_history TO authenticated;
GRANT SELECT, INSERT ON usage_tracking TO authenticated;
