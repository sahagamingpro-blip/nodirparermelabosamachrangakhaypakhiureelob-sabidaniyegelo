-- Debug script for users table
-- Run this in your Supabase SQL Editor to check your data

-- 1. Check if users table exists and see its structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users';

-- 2. Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';

-- 3. See all users in the table (temporarily disable RLS for this query)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
SELECT id, username, email, full_name, phone, date_of_birth, created_at 
FROM users 
ORDER BY created_at DESC;

-- 4. Check Supabase Auth users
SELECT id, email, created_at, email_confirmed_at, last_sign_in_at
FROM auth.users 
ORDER BY created_at DESC;

-- 5. Re-enable RLS (uncomment if you want to keep it enabled)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 6. If you want to keep RLS disabled for testing, leave it as is
-- You can re-enable it later with: ALTER TABLE users ENABLE ROW LEVEL SECURITY;
