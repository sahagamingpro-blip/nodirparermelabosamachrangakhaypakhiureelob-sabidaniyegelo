# Supabase Setup Guide for YONO Game Authentication

This guide will help you set up Supabase for your YONO Game authentication system.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `yono-game-auth` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 3. Set Up Environment Variables

1. Create a `.env` file in your project root:
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Replace the placeholder values with your actual credentials from step 2

## 4. Create the Users Table

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Paste and run this SQL:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);
```

## 5. Configure Authentication Settings

1. Go to **Authentication** → **Settings**
2. Configure these settings:

### Email Settings:
- **Enable email confirmations**: Turn ON (recommended)
- **Enable email change confirmations**: Turn ON
- **Enable secure email change**: Turn ON

### Password Settings:
- **Minimum password length**: 6 (or your preference)

### Advanced Settings:
- **Enable phone confirmations**: Turn OFF (unless you want SMS verification)
- **Enable manual linking**: Turn OFF

## 6. Set Up Email Templates (Optional but Recommended)

1. Go to **Authentication** → **Email Templates**
2. Customize the templates:
   - **Confirm signup**: Welcome message for new users
   - **Magic Link**: For passwordless login (if you want to add this later)
   - **Change Email Address**: For email change confirmations
   - **Reset Password**: For password reset emails

Example custom signup template:
```html
<h2>Welcome to YONO Game!</h2>
<p>Thanks for signing up! Please confirm your email address by clicking the link below:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your account</a></p>
<p>If you didn't create an account, you can safely ignore this email.</p>
```

## 7. Test Your Setup

1. Start your development server:
```bash
npm run dev
```

2. Navigate to `/auth` in your browser
3. Try registering a new account
4. Check your email for confirmation
5. Try logging in with the new account
6. Verify you're redirected to `/order` after successful login

## 8. Production Considerations

### Security:
1. **Environment Variables**: Never commit your `.env` file to version control
2. **Row Level Security**: Already enabled in the SQL above
3. **API Keys**: Use the `anon` key for client-side, never expose the `service_role` key

### Email Configuration:
1. Go to **Settings** → **Auth** → **SMTP Settings**
2. Configure your own SMTP server for production emails
3. Default Supabase emails may go to spam

### Domain Configuration:
1. Go to **Authentication** → **URL Configuration**
2. Add your production domain to **Site URL**
3. Add your production domain to **Redirect URLs**

## 9. Monitoring and Analytics

1. **Authentication**: Monitor user signups and logins in the Auth dashboard
2. **Database**: Check table usage and performance in the Database dashboard
3. **API**: Monitor API usage and set up alerts for rate limits

## 10. Backup and Recovery

1. **Database Backups**: Supabase automatically backs up your database
2. **Point-in-time Recovery**: Available on paid plans
3. **Export Data**: You can export your data anytime from the dashboard

## Troubleshooting

### Common Issues:

1. **"Invalid API key"**: Check your environment variables are correct
2. **"User not found"**: Make sure the users table exists and has correct structure
3. **"Email not confirmed"**: Check spam folder or disable email confirmation for testing
4. **CORS errors**: Make sure your domain is added to the allowed origins

### Debug Steps:

1. Check browser console for errors
2. Verify environment variables are loaded: `console.log(import.meta.env.VITE_SUPABASE_URL)`
3. Check Supabase logs in the dashboard
4. Test API calls directly in the Supabase dashboard

## Support

- **Supabase Docs**: [docs.supabase.com](https://docs.supabase.com)
- **Community**: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
- **Discord**: [discord.supabase.com](https://discord.supabase.com)

---

## Quick Start Checklist

- [ ] Create Supabase project
- [ ] Copy Project URL and anon key
- [ ] Create `.env` file with credentials
- [ ] Run SQL to create users table
- [ ] Enable email confirmations
- [ ] Test registration and login
- [ ] Configure production settings
- [ ] Set up monitoring

Your YONO Game authentication system is now ready! 🎮
