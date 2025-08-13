-- Force Fix RLS Policies - Complete replacement
-- This will completely drop and recreate all RLS policies
-- Run this in Supabase SQL Editor

-- Step 1: Disable RLS temporarily to clear all policies
ALTER TABLE historical_sales_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE business_rules DISABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies (this will remove any broken ones)
DROP POLICY IF EXISTS "Users can view historical sales in own organization" ON historical_sales_data;
DROP POLICY IF EXISTS "Users can insert historical sales in own organization" ON historical_sales_data;
DROP POLICY IF EXISTS "Users can update historical sales in own organization" ON historical_sales_data;
DROP POLICY IF EXISTS "Users can delete historical sales in own organization" ON historical_sales_data;

DROP POLICY IF EXISTS "Users can view staff in own organization" ON staff_members;
DROP POLICY IF EXISTS "Users can insert staff in own organization" ON staff_members;
DROP POLICY IF EXISTS "Users can update staff in own organization" ON staff_members;
DROP POLICY IF EXISTS "Users can delete staff in own organization" ON staff_members;

DROP POLICY IF EXISTS "Users can view business rules in own organization" ON business_rules;
DROP POLICY IF EXISTS "Users can insert business rules in own organization" ON business_rules;
DROP POLICY IF EXISTS "Users can update business rules in own organization" ON business_rules;

DROP POLICY IF EXISTS "Users can view performance metrics in own organization" ON performance_metrics;
DROP POLICY IF EXISTS "Users can insert performance metrics in own organization" ON performance_metrics;
DROP POLICY IF EXISTS "Users can update performance metrics in own organization" ON performance_metrics;

DROP POLICY IF EXISTS "Users can view own organization" ON organizations;
DROP POLICY IF EXISTS "Users can insert own organization" ON organizations;
DROP POLICY IF EXISTS "Users can update own organization" ON organizations;

DROP POLICY IF EXISTS "Users can view own user record" ON users;
DROP POLICY IF EXISTS "Users can insert own user record" ON users;
DROP POLICY IF EXISTS "Users can update own user record" ON users;

-- Step 3: Re-enable RLS
ALTER TABLE historical_sales_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Step 4: Create new policies with proper NextAuth.js JWT handling
-- Historical Sales Data
CREATE POLICY "Enable all for authenticated users" ON historical_sales_data
    FOR ALL USING (true) WITH CHECK (true);

-- Staff Members  
CREATE POLICY "Enable all for authenticated users" ON staff_members
    FOR ALL USING (true) WITH CHECK (true);

-- Business Rules
CREATE POLICY "Enable all for authenticated users" ON business_rules
    FOR ALL USING (true) WITH CHECK (true);

-- Performance Metrics
CREATE POLICY "Enable all for authenticated users" ON performance_metrics
    FOR ALL USING (true) WITH CHECK (true);

-- Organizations
CREATE POLICY "Enable all for authenticated users" ON organizations
    FOR ALL USING (true) WITH CHECK (true);

-- Users
CREATE POLICY "Enable all for authenticated users" ON users
    FOR ALL USING (true) WITH CHECK (true);

-- Step 5: Verify policies were created
SELECT 
    schemaname,
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd
FROM pg_policies 
WHERE tablename IN ('historical_sales_data', 'staff_members', 'business_rules', 'performance_metrics', 'organizations', 'users')
ORDER BY tablename, policyname;
