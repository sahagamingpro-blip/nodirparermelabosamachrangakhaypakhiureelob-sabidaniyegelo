# Production Environment Configuration Guide

This guide provides detailed instructions for configuring your YONO Game Development Services application for production deployment.

## Environment Variables

Create a `.env.production` file in the root directory with the following variables:

```env
# Database Configuration
MYSQL_HOST=103.124.172.12
MYSQL_PORT=3306
MYSQL_USER=sahawebtech_yono_developer
MYSQL_PASSWORD=sahawebtech_yono_developer
MYSQL_DATABASE=sahawebtech_yono_developer

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Supabase Configuration (for authentication)
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Application Configuration
NODE_ENV=production
PORT=3000

# Optional: SSL Configuration for MySQL (if your hosting provider supports it)
# MYSQL_SSL=true
```

## Database Setup

### 1. Create Database Schema

Run the following SQL scripts in order:

1. `COMPLETE_DATABASE_SCHEMA.sql` - Main database schema
2. `ADMIN_DATABASE_SCHEMA.sql` - Admin user schema
3. `CREATE_WEBSITE_SETTINGS_TABLE.sql` - Website settings table

### 2. Initialize Admin User

After setting up the database, initialize the admin user:

```bash
# Run this endpoint to create the initial admin user
curl -X POST http://localhost:3000/api/admin/init
```

This will create an admin user with:
- Username: `admin`
- Password: `admin123`
- Email: `admin@a2z.dog`

### 3. Update Admin Password (Recommended)

After logging in as admin, immediately update your password:

1. Go to Admin Panel → Settings
2. Use the password hash generator at `/api/admin/hash-password`
3. Update the password in the database using the provided SQL query

## Supabase Configuration

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your Project URL and anon key from Settings → API

### 2. Set Up Authentication

1. Enable email signups in Authentication → Settings
2. Configure email templates in Authentication → Email Templates
3. Add your domain to Authentication → URL Configuration

### 3. Create Users Table

Run the SQL from `SUPABASE_SETUP_GUIDE.md` to create the users table with proper RLS policies.

## Deployment Configuration

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set the following build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

3. Add all environment variables from your `.env.production` file in Vercel Dashboard → Settings → Environment Variables

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t yono-game .
```

2. Run with environment variables:
```bash
docker run -d \
  --name yono-game \
  -p 3000:3000 \
  -e MYSQL_HOST=your-host \
  -e MYSQL_PORT=3306 \
  -e MYSQL_USER=your-user \
  -e MYSQL_PASSWORD=your-password \
  -e MYSQL_DATABASE=your-database \
  -e SESSION_SECRET=your-session-secret \
  -e VITE_SUPABASE_URL=your-supabase-url \
  -e VITE_SUPABASE_ANON_KEY=your-supabase-key \
  yono-game
```

## Security Considerations

### 1. Environment Variables

- Never commit `.env` files to version control
- Use strong, random values for SESSION_SECRET
- Rotate secrets regularly

### 2. Database Security

- Use strong database credentials
- Restrict database access to only necessary IP addresses
- Enable SSL/TLS for database connections if supported

### 3. Application Security

- Keep dependencies updated
- Use HTTPS in production
- Implement proper rate limiting
- Regularly review and update authentication policies

## Monitoring and Maintenance

### 1. Health Checks

The application includes built-in health check endpoints:

- `/health` - Basic health check with database connectivity status
- `/status` - Frontend status page

### 2. Logging

All API requests are logged with:
- Request method and path
- Response status code
- Request duration
- Response data (for API endpoints)

### 3. Backups

Regularly backup:
- Database
- Uploaded files (if stored locally)
- Environment configuration

## Performance Optimization

### 1. Caching

The application uses:
- Browser caching for static assets
- Database connection pooling
- Session storage optimization

### 2. Compression

Enable gzip compression in your reverse proxy (Nginx, Apache, etc.)

### 3. CDN

Use a CDN for static assets:
- Images
- CSS and JavaScript files
- Fonts

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check database credentials
   - Verify database server is accessible
   - Check firewall settings

2. **Authentication Not Working**
   - Verify Supabase credentials
   - Check environment variables
   - Review Supabase URL configuration

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript compilation errors

### Support

For additional help:
1. Check the application logs
2. Review error messages in browser console
3. Verify all environment variables are correctly set
4. Contact the development team

Your YONO Game Development Services application is now ready for production! 🚀