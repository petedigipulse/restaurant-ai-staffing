-- Fix RLS policies for historical_sales_data table to work with NextAuth.js
-- This should be run in Supabase SQL Editor

-- First, drop the existing restrictive policies
DROP POLICY IF EXISTS "Users can view historical sales in own organization" ON historical_sales_data;
DROP POLICY IF EXISTS "Users can insert historical sales in own organization" ON historical_sales_data;
DROP POLICY IF EXISTS "Users can update historical sales in own organization" ON historical_sales_data;
DROP POLICY IF EXISTS "Users can delete historical sales in own organization" ON historical_sales_data;

-- Create new policies that work with NextAuth.js JWT claims
-- Allow users to view historical sales data in their organization
CREATE POLICY "Users can view historical sales in own organization" ON historical_sales_data
    FOR SELECT USING (
        organization_id IN (
            SELECT id FROM organizations 
            WHERE user_id IN (
                SELECT id FROM users 
                WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

-- Allow users to insert historical sales data in their organization
CREATE POLICY "Users can insert historical sales in own organization" ON historical_sales_data
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT id FROM organizations 
            WHERE user_id IN (
                SELECT id FROM users 
                WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

-- Allow users to update historical sales data in their organization
CREATE POLICY "Users can update historical sales in own organization" ON historical_sales_data
    FOR UPDATE USING (
        organization_id IN (
            SELECT id FROM organizations 
            WHERE user_id IN (
                SELECT id FROM users 
                WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

-- Allow users to delete historical sales data in their organization
CREATE POLICY "Users can delete historical sales in own organization" ON historical_sales_data
    FOR DELETE USING (
        organization_id IN (
            SELECT id FROM organizations 
            WHERE user_id IN (
                SELECT id FROM users 
                WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

-- Also fix the staff_members table policies
DROP POLICY IF EXISTS "Users can view staff in own organization" ON staff_members;
DROP POLICY IF EXISTS "Users can insert staff in own organization" ON staff_members;
DROP POLICY IF EXISTS "Users can update staff in own organization" ON staff_members;
DROP POLICY IF EXISTS "Users can delete staff in own organization" ON staff_members;

-- Create new policies for staff_members
CREATE POLICY "Users can view staff in own organization" ON staff_members
    FOR SELECT USING (
        organization_id IN (
            SELECT id FROM organizations 
            WHERE user_id IN (
                SELECT id FROM users 
                WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

CREATE POLICY "Users can insert staff in own organization" ON staff_members
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT id FROM organizations 
            WHERE user_id IN (
                SELECT id FROM users 
                WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

CREATE POLICY "Users can update staff in own organization" ON staff_members
    FOR UPDATE USING (
        organization_id IN (
            SELECT id FROM organizations 
            WHERE user_id IN (
                SELECT id FROM users 
                WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

CREATE POLICY "Users can delete staff in own organization" ON staff_members
    FOR DELETE USING (
        organization_id IN (
            SELECT id FROM organizations 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

-- Fix business_rules table policies
DROP POLICY IF EXISTS "Users can view business rules in own organization" ON business_rules;
DROP POLICY IF EXISTS "Users can insert business rules in own organization" ON business_rules;
DROP POLICY IF EXISTS "Users can update business rules in own organization" ON business_rules;

CREATE POLICY "Users can view business rules in own organization" ON business_rules
    FOR SELECT USING (
        organization_id IN (
            SELECT id FROM organizations 
            WHERE user_id IN (
                SELECT id FROM users 
                WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

CREATE POLICY "Users can insert business rules in own organization" ON business_rules
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT id FROM organizations 
            WHERE user_id IN (
                SELECT id FROM users 
                WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

CREATE POLICY "Users can update business rules in own organization" ON business_rules
    FOR UPDATE USING (
        organization_id IN (
            SELECT id FROM organizations 
            WHERE user_id IN (
                SELECT id FROM users 
                WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

-- Fix performance_metrics table policies
DROP POLICY IF EXISTS "Users can view performance metrics in own organization" ON performance_metrics;
DROP POLICY IF EXISTS "Users can insert performance metrics in own organization" ON performance_metrics;
DROP POLICY IF EXISTS "Users can update performance metrics in own organization" ON performance_metrics;

CREATE POLICY "Users can view performance metrics in own organization" ON performance_metrics
    FOR SELECT USING (
        organization_id IN (
            SELECT id FROM organizations 
            WHERE user_id IN (
                SELECT id FROM users 
                WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

CREATE POLICY "Users can insert performance metrics in own organization" ON performance_metrics
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT id FROM organizations 
            WHERE user_id IN (
                SELECT id FROM users 
                WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

CREATE POLICY "Users can update performance metrics in own organization" ON performance_metrics
    FOR UPDATE USING (
        organization_id IN (
            SELECT id FROM organizations 
            WHERE user_id IN (
                SELECT id FROM users 
                WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

-- Fix organizations table policies
DROP POLICY IF EXISTS "Users can view own organization" ON organizations;
DROP POLICY IF EXISTS "Users can insert own organization" ON organizations;
DROP POLICY IF EXISTS "Users can update own organization" ON organizations;

CREATE POLICY "Users can view own organization" ON organizations
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM users 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

CREATE POLICY "Users can insert own organization" ON organizations
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT id FROM users 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

CREATE POLICY "Users can update own organization" ON organizations
    FOR UPDATE USING (
        user_id IN (
            SELECT id FROM users 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

-- Fix users table policies
DROP POLICY IF EXISTS "Users can view own user record" ON users;
DROP POLICY IF EXISTS "Users can insert own user record" ON users;
DROP POLICY IF EXISTS "Users can update own user record" ON users;

CREATE POLICY "Users can view own user record" ON users
    FOR SELECT USING (
        email = current_setting('request.jwt.claims', true)::json->>'email'
    );

CREATE POLICY "Users can insert own user record" ON users
    FOR INSERT WITH CHECK (
        email = current_setting('request.jwt.claims', true)::json->>'email'
    );

CREATE POLICY "Users can update own user record" ON users
    FOR UPDATE USING (
        email = current_setting('request.jwt.claims', true)::json->>'email'
    );

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('historical_sales_data', 'staff_members', 'business_rules', 'performance_metrics', 'organizations', 'users')
ORDER BY tablename, policyname;
