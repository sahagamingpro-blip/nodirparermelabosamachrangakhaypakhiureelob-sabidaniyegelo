# Quick Login Fix

## Immediate Solution

**Try logging in with your EMAIL ADDRESS instead of username.**

If you registered with:
- Username: `testuser`
- Email: `test@example.com`
- Password: `password123`

**Login with:**
- Username field: `test@example.com` (use your email)
- Password: `password123`

## Why This Happens

The RLS (Row Level Security) policy in Supabase is blocking the username lookup, causing the login to hang.

## Permanent Fix Options

### Option 1: Disable RLS (Quick Fix)
1. Go to Supabase Dashboard → SQL Editor
2. Run: `ALTER TABLE users DISABLE ROW LEVEL SECURITY;`
3. Now you can login with username

### Option 2: Fix RLS Policy (Better)
1. Go to Supabase Dashboard → SQL Editor
2. Run this SQL:

```sql
-- Allow reading users table for username lookup
CREATE POLICY "Allow username lookup for login" ON users
    FOR SELECT USING (true);
```

### Option 3: Use Email Only (Simplest)
Just always login with email address instead of username.

## Test Steps

1. Open browser console (F12)
2. Try logging in
3. Check console for error messages
4. If you see RLS errors, use Option 1 above
