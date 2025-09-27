# Production Deployment Guide

This guide will help you deploy the YONO Game Development Services application to production using GitHub and Vercel.

## Prerequisites

1. GitHub account
2. Vercel account
3. Supabase account (for authentication)
4. MySQL database (hosted or local)

## Step 1: Prepare Your Repository

1. Create a new repository on GitHub
2. Push your code to the repository:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

## Step 2: Configure Environment Variables

Create a `.env.production` file with your production environment variables:

```env
# Database Configuration
MYSQL_HOST=your-production-database-host
MYSQL_PORT=3306
MYSQL_USER=your-production-database-user
MYSQL_PASSWORD=your-production-database-password
MYSQL_DATABASE=your-production-database-name

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Application Configuration
NODE_ENV=production
PORT=3000
```

## Step 3: Set Up Vercel Deployment

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project settings:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: `npm run vercel-build`
   - Output Directory: dist/public
   - Install Command: `npm install`

5. Add environment variables in the Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add all the environment variables from your `.env.production` file

## Step 4: Configure Supabase for Production

1. Update your Supabase project settings:
   - Go to Authentication → URL Configuration
   - Add your Vercel deployment URL to "Site URL" and "Redirect URLs"
   
2. Configure SMTP settings for production emails:
   - Go to Settings → Auth → SMTP Settings
   - Configure your SMTP provider (SendGrid, Mailgun, etc.)

## Step 5: Set Up Automated Deployments

The project includes a GitHub Actions workflow that will automatically deploy to Vercel when you push to the main branch.

To enable this:
1. Generate a Vercel token:
   - Go to Vercel Dashboard → Settings → Tokens
   - Create a new token

2. Add the following secrets to your GitHub repository:
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `VERCEL_TOKEN`: Your Vercel token
     - `VERCEL_ORG_ID`: Your Vercel organization ID
     - `VERCEL_PROJECT_ID`: Your Vercel project ID

## Step 6: Deploy Using Docker (Alternative)

If you prefer to deploy using Docker:

1. Build the Docker image:
```bash
docker build -t yono-game .
```

2. Run the container:
```bash
docker run -p 3000:3000 \
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

Or use docker-compose:
```bash
docker-compose up -d
```

## Step 7: Database Setup

Make sure your production database is set up with the correct schema:

1. Run the database schema scripts:
   - `COMPLETE_DATABASE_SCHEMA.sql`
   - `ADMIN_DATABASE_SCHEMA.sql`
   - Any other SQL files in the root directory

2. Ensure proper database permissions and security settings

## Monitoring and Maintenance

1. Set up monitoring for your Vercel deployment
2. Regularly update dependencies
3. Monitor database performance
4. Check authentication logs in Supabase
5. Review error logs in Vercel

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**:
   - Check that all environment variables are correctly set in Vercel
   - Ensure variable names match exactly

2. **Database Connection Issues**:
   - Verify database credentials
   - Check that your database allows connections from your deployment server

3. **Supabase Authentication Not Working**:
   - Confirm Supabase project URL and anon key
   - Check that your domain is added to Supabase URL Configuration

4. **Build Failures**:
   - Check Vercel build logs
   - Ensure all dependencies are properly installed
   - Verify TypeScript compilation

### Support

If you encounter issues:
1. Check the Vercel build logs
2. Review console errors in the browser
3. Verify all environment variables are correctly set
4. Check Supabase dashboard for authentication errors

Your YONO Game Development Services application is now ready for production deployment! 🚀