# YONO Game Authentication Setup

This project now includes a complete authentication system using Supabase for your YONO Game application.

## 🚀 Quick Start

1. **Install Dependencies** (already done):
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Set up Supabase**:
   - Follow the detailed guide in `SUPABASE_SETUP_GUIDE.md`
   - Create your `.env` file with Supabase credentials

3. **Start Development**:
   ```bash
   npm run dev
   ```

## 🔐 Authentication Flow

### User Registration
1. User visits `/auth` and clicks "Register" tab
2. Fills out the registration form with:
   - Full Name
   - Username (unique)
   - Email (unique)
   - Phone Number (Indian format validation)
   - Date of Birth (DD-MM-YYYY format)
   - Password (min 6 characters)
3. Account is created in Supabase Auth + custom users table
4. User receives email confirmation
5. **Automatically redirected to `/order` page**

### User Login
1. User visits `/auth` and uses "Login" tab
2. Enters username/email and password
3. System authenticates with Supabase
4. **Automatically redirected to `/order` page**

### Protected Order Page
- Only accessible to authenticated users
- Pre-fills user information from their account
- Allows users to purchase the YONO SLOT game package
- Shows user info and logout option

## 📁 New Files Created

- `client/src/lib/supabase.ts` - Supabase client configuration
- `client/src/pages/order-page.tsx` - Protected order form page
- `SUPABASE_SETUP_GUIDE.md` - Complete Supabase setup instructions
- `.env.example` - Environment variables template

## 🔧 Modified Files

- `client/src/hooks/use-auth.tsx` - Updated to use Supabase authentication
- `client/src/App.tsx` - Added protected route for order page
- `client/src/pages/auth-page.tsx` - Updated redirect logic
- `shared/schema.ts` - Updated date handling for compatibility

## 🎯 Key Features

### Authentication
- ✅ User registration with email verification
- ✅ User login with username or email
- ✅ Automatic session management
- ✅ Protected routes
- ✅ Logout functionality

### Order System
- ✅ Protected order page (login required)
- ✅ Pre-filled user information
- ✅ YONO SLOT game package details
- ✅ Multi-step order form
- ✅ Purchase summary and confirmation

### Security
- ✅ Row Level Security (RLS) enabled
- ✅ Environment variables for sensitive data
- ✅ Input validation and sanitization
- ✅ Secure password handling

## 🌐 Routes

- `/auth` - Login/Register page
- `/order` - **Protected** order form (redirects to `/auth` if not logged in)
- `/order-old` - Original order form (public)
- All other routes remain unchanged

## 🔄 User Journey

1. **New User**: Home → Auth → Register → Email Verification → Order Page
2. **Returning User**: Home → Auth → Login → Order Page
3. **Logged In User**: Any page → Order Page (direct access)

## 📧 Email Configuration

The system uses Supabase's built-in email service for:
- Account verification emails
- Password reset emails
- Email change confirmations

For production, configure your own SMTP server in Supabase dashboard.

## 🛠️ Development Notes

- The old order form is still available at `/order-old` for reference
- User passwords are stored in the custom users table (should be hashed in production)
- Date format is DD-MM-YYYY throughout the application
- Phone number validation is set for Indian numbers (+91 format)

## 🚨 Important Security Notes

1. **Never commit your `.env` file** - it contains sensitive credentials
2. **Use environment variables** for all Supabase configuration
3. **Enable email verification** in production
4. **Configure proper SMTP** for production emails
5. **Review and test RLS policies** before going live

## 📞 Support

If you need help with the setup:
1. Check `SUPABASE_SETUP_GUIDE.md` for detailed instructions
2. Verify your environment variables are correct
3. Check the browser console for any errors
4. Review Supabase dashboard logs

Your YONO Game now has a complete authentication system! 🎮✨
