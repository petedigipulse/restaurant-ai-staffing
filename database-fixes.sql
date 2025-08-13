-- Database Fixes for Restaurant AI Staffing System
-- This will fix historical data saving and performance metrics issues

-- 1. Create users table to link with NextAuth sessions
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'OWNER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add user_id column to organizations table
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- 3. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_organizations_user_id ON organizations(user_id);

-- 4. Update existing organizations to link with a default user (if any exist)
-- This creates a default user and links existing organizations
INSERT INTO users (email, name, role) 
VALUES ('default@restaurant.com', 'Default User', 'OWNER')
ON CONFLICT (email) DO NOTHING;

UPDATE organizations 
SET user_id = (SELECT id FROM users WHERE email = 'default@restaurant.com')
WHERE user_id IS NULL;

-- 5. Make user_id NOT NULL after linking existing data
ALTER TABLE organizations 
ALTER COLUMN user_id SET NOT NULL;

-- 6. Drop the old restrictive RLS policies
DROP POLICY IF EXISTS "Users can insert historical sales in own organization" ON historical_sales_data;
DROP POLICY IF EXISTS "Users can view historical sales in own organization" ON historical_sales_data;
DROP POLICY IF EXISTS "Users can update historical sales in own organization" ON historical_sales_data;
DROP POLICY IF EXISTS "Users can delete historical sales in own organization" ON historical_sales_data;

-- 7. Create new RLS policies that work with authenticated users
CREATE POLICY "Users can view historical sales in own organization" ON historical_sales_data
    FOR SELECT USING (
        organization_id IN (
            SELECT id FROM organizations WHERE user_id IN (
                SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

CREATE POLICY "Users can insert historical sales in own organization" ON historical_sales_data
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT id FROM organizations WHERE user_id IN (
                SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

CREATE POLICY "Users can update historical sales in own organization" ON historical_sales_data
    FOR UPDATE USING (
        organization_id IN (
            SELECT id FROM organizations WHERE user_id IN (
                SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

CREATE POLICY "Users can delete historical sales in own organization" ON historical_sales_data
    FOR DELETE USING (
        organization_id IN (
            SELECT id FROM organizations WHERE user_id IN (
                SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

-- 8. Fix staff table RLS policies
DROP POLICY IF EXISTS "Users can view staff in own organization" ON staff_members;
DROP POLICY IF EXISTS "Users can insert staff in own organization" ON staff_members;
DROP POLICY IF EXISTS "Users can update staff in own organization" ON staff_members;
DROP POLICY IF EXISTS "Users can delete staff in own organization" ON staff_members;

CREATE POLICY "Users can view staff in own organization" ON staff_members
    FOR SELECT USING (
        organization_id IN (
            SELECT id FROM organizations WHERE user_id IN (
                SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

CREATE POLICY "Users can insert staff in own organization" ON staff_members
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT id FROM organizations WHERE user_id IN (
                SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

CREATE POLICY "Users can update staff in own organization" ON staff_members
    FOR UPDATE USING (
        organization_id IN (
            SELECT id FROM organizations WHERE user_id IN (
                SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

CREATE POLICY "Users can delete staff in own organization" ON staff_members
    FOR DELETE USING (
        organization_id IN (
            SELECT id FROM organizations WHERE user_id IN (
                SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

-- 9. Fix business_rules table RLS policies
DROP POLICY IF EXISTS "Users can view business rules in own organization" ON business_rules;
DROP POLICY IF EXISTS "Users can insert business rules in own organization" ON business_rules;
DROP POLICY IF EXISTS "Users can update business rules in own organization" ON business_rules;
DROP POLICY IF EXISTS "Users can delete business rules in own organization" ON business_rules;

CREATE POLICY "Users can view business rules in own organization" ON business_rules
    FOR SELECT USING (
        organization_id IN (
            SELECT id FROM organizations WHERE user_id IN (
                SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

CREATE POLICY "Users can insert business rules in own organization" ON business_rules
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT id FROM organizations WHERE user_id IN (
                SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

CREATE POLICY "Users can update business rules in own organization" ON business_rules
    FOR UPDATE USING (
        organization_id IN (
            SELECT id FROM organizations WHERE user_id IN (
                SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

CREATE POLICY "Users can delete business rules in own organization" ON business_rules
    FOR DELETE USING (
        organization_id IN (
            SELECT id FROM organizations WHERE user_id IN (
                SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

-- 10. Fix schedules table RLS policies
DROP POLICY IF EXISTS "Users can view schedules in own organization" ON schedules;
DROP POLICY IF EXISTS "Users can insert schedules in own organization" ON schedules;
DROP POLICY IF EXISTS "Users can update schedules in own organization" ON schedules;
DROP POLICY IF EXISTS "Users can delete schedules in own organization" ON schedules;

CREATE POLICY "Users can view schedules in own organization" ON schedules
    FOR SELECT USING (
        organization_id IN (
            SELECT id FROM organizations WHERE user_id IN (
                SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

CREATE POLICY "Users can insert schedules in own organization" ON schedules
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT id FROM organizations WHERE user_id IN (
                SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

CREATE POLICY "Users can update schedules in own organization" ON schedules
    FOR UPDATE USING (
        organization_id IN (
            SELECT id FROM organizations WHERE user_id IN (
                SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

CREATE POLICY "Users can delete schedules in own organization" ON schedules
    FOR DELETE USING (
        organization_id IN (
            SELECT id FROM organizations WHERE user_id IN (
                SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

-- 11. Create a function to automatically create users during onboarding
CREATE OR REPLACE FUNCTION create_user_and_organization(
    user_email TEXT,
    user_name TEXT,
    org_name TEXT,
    org_type TEXT,
    org_timezone TEXT,
    org_operating_hours JSONB
) RETURNS UUID AS $$
DECLARE
    new_user_id UUID;
    new_org_id UUID;
BEGIN
    -- Create or get user
    INSERT INTO users (email, name, role)
    VALUES (user_email, user_name, 'OWNER')
    ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        updated_at = NOW()
    RETURNING id INTO new_user_id;
    
    -- Create organization linked to user
    INSERT INTO organizations (name, type, timezone, operating_hours, owner_id, user_id)
    VALUES (org_name, org_type, org_timezone, org_operating_hours, new_user_id, new_user_id)
    RETURNING id INTO new_org_id;
    
    RETURN new_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
