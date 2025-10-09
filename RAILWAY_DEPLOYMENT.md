# Railway Deployment Guide

## Environment Variables Required in Railway:

1. **DATABASE_URL** (Required)
   - Railway akan generate ini otomatis jika Anda add PostgreSQL service
   - Format: `postgresql://user:password@host:port/database`
   - Jangan gunakan localhost atau 127.0.0.1

2. **NODE_ENV** (Optional)
   - Set ke: `production`

3. **PORT** (Optional) 
   - Railway akan set otomatis
   - Default: 3000

## Setup Steps:

### Step 1: Create Railway Project
```bash
# Install Railway CLI (if not installed)
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init
```

### Step 2: Add PostgreSQL Database
- Go to Railway dashboard
- Click "Add Service" → "Database" → "PostgreSQL"
- Railway will auto-generate DATABASE_URL

### Step 3: Deploy
```bash
# Deploy to Railway
railway up
```

### Step 4: Verify Environment Variables
Check that these are set in Railway dashboard:
- DATABASE_URL (should be generated automatically)
- NODE_ENV=production

## Common Issues:

### Issue: "Can't reach database server at localhost:5434"
**Solution:** DATABASE_URL is pointing to local development database
- Check Railway environment variables
- Ensure DATABASE_URL uses Railway's PostgreSQL service
- Should look like: `postgresql://postgres:xxx@xxx.railway.app:5432/railway`

### Issue: Migration fails
**Solution:** Database not ready or wrong credentials
- Verify PostgreSQL service is running in Railway
- Check DATABASE_URL format
- Ensure network connectivity

## Testing Deployment:
After successful deployment, test these endpoints:
- `GET /jobs` - Should return empty array with pagination
- `POST /auth/login` - Should return authentication error (expected)
- Check Railway logs for any errors