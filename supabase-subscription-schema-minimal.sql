-- Minimal Subscription Schema - Just the essential tables
-- This should work with any existing database structure

-- 1. Subscription Plans Table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    price_monthly INTEGER NOT NULL,
    price_yearly INTEGER NOT NULL,
    max_staff INTEGER NOT NULL,
    features JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    plan_id UUID NOT NULL,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Billing History Table
CREATE TABLE IF NOT EXISTS billing_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL,
    stripe_invoice_id VARCHAR(255) UNIQUE,
    amount INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'usd',
    status VARCHAR(50) NOT NULL,
    billing_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Usage Tracking Table
CREATE TABLE IF NOT EXISTS usage_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
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
    2900,
    29000,
    10,
    '["Basic AI Scheduling", "Staff Management", "CSV Import", "Email Support"]'
),
(
    'Professional',
    'professional',
    7900,
    79000,
    25,
    '["Advanced AI Optimization", "Weather Integration", "Analytics Dashboard", "Performance Metrics", "Priority Support"]'
),
(
    'Enterprise',
    'enterprise',
    19900,
    199000,
    -1,
    '["Custom Integrations", "API Access", "White-label Options", "Dedicated Support", "Custom Features"]'
)
ON CONFLICT (slug) DO NOTHING;

-- 6. Create Basic Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_org ON subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_billing_sub ON billing_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_usage_org_date ON usage_tracking(organization_id, tracking_date);

-- 7. Add subscription column to organizations (if it doesn't exist)
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS current_subscription_id UUID;
