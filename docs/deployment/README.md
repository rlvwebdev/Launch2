# 🚀 Deployment Guide

## Overview

Launch TMS uses a modern deployment strategy with the frontend hosted on Vercel and the backend deployable to various cloud platforms.

## Frontend Deployment (Vercel)

### Automatic Deployment

The frontend is automatically deployed to Vercel when changes are pushed to the main branch.

- **Live URL**: `https://launch2-chi.vercel.app`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node.js Version**: 18.x

### Environment Variables

Configure these environment variables in the Vercel dashboard:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_FRONTEND_URL=https://launch2-chi.vercel.app
```

### Custom Domain

To add a custom domain:
1. Go to Vercel dashboard > Project > Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update environment variables if needed

## Backend Deployment

### Local Development

For local development with PostgreSQL:

```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Setup Django backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python create_django_test_data.py
python manage.py runserver
```

### Production Deployment Options

#### Option 1: Railway

1. **Create Railway account** at https://railway.app
2. **Connect GitHub repository**
3. **Configure environment variables**:
   ```bash
   SECRET_KEY=your-production-secret-key
   DEBUG=False
   DATABASE_URL=postgresql://user:pass@host:port/db
   ALLOWED_HOSTS=your-domain.railway.app
   CORS_ALLOWED_ORIGINS=https://launch2-chi.vercel.app
   ```
4. **Deploy**: Railway will automatically build and deploy

#### Option 2: DigitalOcean App Platform

1. **Create DigitalOcean account**
2. **Create new app** and connect GitHub repository
3. **Configure build settings**:
   - Build Command: `pip install -r requirements.txt`
   - Run Command: `python manage.py runserver 0.0.0.0:$PORT`
4. **Add managed PostgreSQL database**
5. **Configure environment variables**

#### Option 3: AWS Elastic Beanstalk

1. **Install AWS CLI and EB CLI**
2. **Initialize Elastic Beanstalk**:
   ```bash
   cd backend
   eb init
   eb create production
   ```
3. **Configure environment variables** in EB console
4. **Deploy**: `eb deploy`

### Database Setup

#### PostgreSQL (Recommended)

**Local Development:**
```bash
docker-compose up -d
```

**Production Options:**
- Railway: Managed PostgreSQL add-on
- DigitalOcean: Managed Databases
- AWS: RDS PostgreSQL
- Google Cloud: Cloud SQL

#### Environment Variables

**Backend (.env)**:
```bash
SECRET_KEY=your-super-secret-key-change-in-production
DEBUG=False
DATABASE_URL=postgresql://user:password@host:port/database
ALLOWED_HOSTS=your-domain.com,api.your-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

**Frontend (.env.local)**:
```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_FRONTEND_URL=https://your-frontend-domain.com
```

## SSL/HTTPS Configuration

### Frontend (Vercel)
- Automatic HTTPS with Let's Encrypt
- Custom domains get automatic SSL certificates

### Backend
- Most cloud providers offer automatic HTTPS
- For custom setups, use Let's Encrypt with Certbot

## Domain Configuration

### Recommended Setup
- Frontend: `https://launch.yourdomain.com`
- Backend API: `https://api.yourdomain.com`
- Admin Panel: `https://api.yourdomain.com/admin/`

### DNS Configuration
```
launch.yourdomain.com    CNAME  vercel-endpoint
api.yourdomain.com       CNAME  backend-endpoint
```

## Monitoring & Maintenance

### Health Checks
- Frontend: Vercel provides automatic monitoring
- Backend: Implement health check endpoint at `/health/`

### Backups
- Database: Regular automated backups
- Code: Git repository serves as code backup
- Environment variables: Secure documentation

### Updates
- Frontend: Automatic deployment on git push
- Backend: Manual deployment (recommended for production)
- Database: Migration management with Django

## Troubleshooting

### Common Issues

**Build Failures:**
- Check Node.js version compatibility
- Verify all dependencies are listed
- Check for TypeScript errors

**API Connection Issues:**
- Verify CORS settings
- Check environment variables
- Confirm API endpoints are accessible

**Database Connection:**
- Verify DATABASE_URL format
- Check network connectivity
- Confirm database credentials

### Support Resources
- Vercel Documentation: https://vercel.com/docs
- Django Deployment: https://docs.djangoproject.com/en/5.0/howto/deployment/
- PostgreSQL Setup: https://www.postgresql.org/docs/
