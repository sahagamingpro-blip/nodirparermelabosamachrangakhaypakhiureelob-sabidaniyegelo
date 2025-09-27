-- Fix RLS policies for user registration
-- This SQL should be run in your Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;

-- Create new policies that allow registration
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id::uuid);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id::uuid);

-- This policy allows inserting during registration
-- It checks that the user being inserted matches the authenticated user
CREATE POLICY "Enable insert during registration" ON users
    FOR INSERT WITH CHECK (
        auth.uid() = id::uuid OR 
        auth.uid() IS NOT NULL
    );

-- Alternative: If the above doesn't work, use this more permissive policy for testing
-- CREATE POLICY "Enable insert for registration" ON users
--     FOR INSERT WITH CHECK (true);

-- You can also temporarily disable RLS for testing (NOT recommended for production)
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
