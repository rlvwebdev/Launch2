# Launch TMS - Vercel Deployment Guide

This guide will help you connect your deployed Vercel frontend to a real database.

## Database Setup Options

### Option 1: Vercel Postgres (Recommended)

1. **Create Database via Vercel Dashboard:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your `launch2` project
   - Navigate to Storage → Create Database
   - Choose "Postgres" 
   - Name: `launch-tms-db`
   - Select a region close to your users

2. **Copy Environment Variables:**
   After creating the database, Vercel will provide these variables:
   ```
   POSTGRES_URL="postgres://..."
   POSTGRES_PRISMA_URL="postgres://..."
   POSTGRES_URL_NO_SSL="postgres://..."
   POSTGRES_URL_NON_POOLING="postgres://..."
   POSTGRES_USER="..."
   POSTGRES_HOST="..."
   POSTGRES_PASSWORD="..."
   POSTGRES_DATABASE="..."
   ```

3. **Add to Vercel Project:**
   - In your project: Settings → Environment Variables
   - Add each variable for Production, Preview, and Development
   - Redeploy your project

### Option 2: External Postgres (Railway, Supabase, etc.)

1. **Create a Postgres database** on your preferred provider
2. **Get the connection string** (usually starts with `postgresql://`)
3. **Add to Vercel Environment Variables:**
   ```
   POSTGRES_URL="postgresql://username:password@host:port/database"
   ```

## Initialize Your Database

After setting up the database connection:

1. **Visit your deployed app** at `https://your-app.vercel.app`
2. **Navigate to** `/database-setup`
3. **Click "Initialize Database"** to create tables and sample data
4. **Verify the connection** by checking the sample data

## Environment Variables Reference

Add these to your Vercel project's environment variables:

```bash
# Required for Vercel Postgres
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."  # Optional, for Prisma ORM
POSTGRES_URL_NO_SSL="postgres://..."   # Optional, non-SSL connection
POSTGRES_URL_NON_POOLING="postgres://..." # Optional, direct connection

# Or for external Postgres
POSTGRES_URL="postgresql://username:password@host:port/database"

# Application settings
NEXT_PUBLIC_API_URL="https://your-app.vercel.app/api"
NEXT_PUBLIC_APP_ENV="production"
```

## Testing the Connection

1. **Database Setup Page**: `/database-setup`
   - Initialize tables
   - Create sample data
   - Test connection

2. **API Endpoints**:
   - `GET /api/drivers` - Fetch drivers
   - `POST /api/drivers` - Create driver
   - `GET /api/trucks` - Fetch trucks
   - `POST /api/trucks` - Create truck

3. **Application Pages**:
   - `/drivers` - Driver management
   - `/trucks` - Truck management
   - `/loads` - Load management (coming soon)

## Production Checklist

- [ ] Database created and connected
- [ ] Environment variables added to Vercel
- [ ] Database initialized with tables
- [ ] Sample data created (optional)
- [ ] API endpoints working
- [ ] Frontend pages loading data
- [ ] CRUD operations working

## Troubleshooting

### Database Connection Issues
- Check environment variables are set correctly
- Ensure database allows connections from Vercel IPs
- Verify connection string format

### API Route Errors
- Check server logs in Vercel dashboard
- Verify database permissions
- Test endpoints individually

### Frontend Data Issues
- Check browser console for errors
- Verify API endpoints return data
- Check network requests in DevTools

## Next Steps

Once your database is connected:

1. **Add Authentication** (coming soon)
2. **Implement Load Management** features
3. **Add File Upload** for Excel imports
4. **Configure Notifications** and alerts
5. **Set up Monitoring** and logging

## Support

If you encounter issues:
1. Check the Vercel deployment logs
2. Test API endpoints directly
3. Verify database connection strings
4. Review environment variable setup
