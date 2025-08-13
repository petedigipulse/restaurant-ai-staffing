-- Debug RLS Issue - Check current policies and authentication
-- Run this in Supabase SQL Editor to see what's happening

-- 1. Check what policies currently exist
SELECT 
    schemaname,
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'historical_sales_data'
ORDER BY policyname;

-- 2. Check if RLS is enabled on the table
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'historical_sales_data';

-- 3. Check the current user context (this will show what Supabase sees)
SELECT 
    current_user,
    session_user,
    current_setting('request.jwt.claims', true) as jwt_claims,
    current_setting('request.jwt.claims', true)::json->>'email' as email_from_jwt;

-- 4. Test the policy logic manually
-- This will show if the policy condition is working
SELECT 
    'Policy test' as test_type,
    current_setting('request.jwt.claims', true)::json->>'email' as user_email,
    EXISTS(
        SELECT 1 FROM organizations 
        WHERE user_id IN (
            SELECT id FROM users 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    ) as organization_exists;

-- 5. Check if there are any users and organizations
SELECT 
    'Users count' as info,
    COUNT(*) as count
FROM users
UNION ALL
SELECT 
    'Organizations count' as info,
    COUNT(*) as count
FROM organizations
UNION ALL
SELECT 
    'Users with emails' as info,
    COUNT(*) as count
FROM users 
WHERE email IS NOT NULL;
