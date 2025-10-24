# Deployment Guide - ArtConnect Backend

**Document Version:** 1.0  
**Last Updated:** October 24, 2025  
**Target Environments:** Development, Staging, Production

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Hosting Options](#hosting-options)
6. [Railway Deployment](#railway-deployment)
7. [Heroku Deployment](#heroku-deployment)
8. [DigitalOcean Deployment](#digitalocean-deployment)
9. [Post-Deployment](#post-deployment)
10. [Monitoring & Logging](#monitoring--logging)

---

## 🌐 Overview

Panduan lengkap untuk deploy ArtConnect Backend ke production. Guide ini mencakup setup database, environment variables, dan deployment ke berbagai platform hosting.

### Deployment Checklist

- [ ] Environment variables configured
- [ ] MySQL database provisioned
- [ ] Firebase credentials setup
- [ ] Prisma migrations applied
- [ ] Build tested locally
- [ ] CORS origin configured
- [ ] Health check endpoint working
- [ ] Monitoring setup
- [ ] Backup strategy defined

---

## 📋 Prerequisites

### Required Accounts

| Service | Purpose | Sign Up |
|---------|---------|---------|
| Firebase | Authentication | https://console.firebase.google.com |
| Railway | Hosting (Recommended) | https://railway.app |
| PlanetScale | MySQL Database (Optional) | https://planetscale.com |
| Sentry | Error Monitoring (Optional) | https://sentry.io |

### Local Requirements

```bash
# Check Node.js version (v18+ required)
node --version

# Check npm version
npm --version

# Check Prisma CLI
npx prisma --version
```

---

## ⚙️ Environment Configuration

### Environment Files

Create 3 environment files:

1. **`.env.development`** - Local development
2. **`.env.staging`** - Staging environment
3. **`.env.production`** - Production environment

### Development Environment

```env
# .env.development
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="mysql://root:password@localhost:3306/artconnect_dev"

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

# CORS
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=debug
```

### Production Environment

```env
# .env.production
NODE_ENV=production
PORT=3000

# Database (use connection pooling)
DATABASE_URL="mysql://user:password@host:3306/artconnect_prod?connection_limit=10&pool_timeout=20"

# Firebase
FIREBASE_PROJECT_ID=your-production-project
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

# CORS (your production frontend URL)
CORS_ORIGIN=https://your-app.com

# Security
TRUST_PROXY=true

# Logging
LOG_LEVEL=error

# Monitoring (optional)
SENTRY_DSN=https://your-sentry-dsn
```

### Environment Variables Checklist

**Required:**
- ✅ `NODE_ENV`
- ✅ `PORT`
- ✅ `DATABASE_URL`
- ✅ `FIREBASE_PROJECT_ID`
- ✅ `FIREBASE_PRIVATE_KEY`
- ✅ `FIREBASE_CLIENT_EMAIL`
- ✅ `CORS_ORIGIN`

**Optional:**
- `LOG_LEVEL`
- `TRUST_PROXY`
- `SENTRY_DSN`
- `MAX_FILE_SIZE`

---

## 🗄️ Database Setup

### Option 1: PlanetScale (Recommended)

**Why PlanetScale?**
- Free tier available
- Automatic backups
- Serverless (no connection limits)
- Great for MySQL with Prisma

**Setup Steps:**

```bash
# 1. Create account at https://planetscale.com

# 2. Create new database
# Name: artconnect-prod

# 3. Get connection string
# Dashboard → Connect → Copy URL

# 4. Update DATABASE_URL in .env
DATABASE_URL="mysql://user:pass@host.psdb.cloud/artconnect-prod?sslaccept=strict"

# 5. Run migrations
npx prisma migrate deploy
```

### Option 2: Railway MySQL

```bash
# 1. Add MySQL plugin in Railway dashboard

# 2. Railway auto-creates DATABASE_URL

# 3. Copy the connection string

# 4. Run migrations
npx prisma migrate deploy
```

### Option 3: Self-Hosted MySQL

```bash
# Install MySQL 8.0
sudo apt update
sudo apt install mysql-server

# Secure installation
sudo mysql_secure_installation

# Create database
mysql -u root -p
CREATE DATABASE artconnect_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'artconnect'@'%' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON artconnect_prod.* TO 'artconnect'@'%';
FLUSH PRIVILEGES;
EXIT;

# Update DATABASE_URL
DATABASE_URL="mysql://artconnect:secure_password@localhost:3306/artconnect_prod"
```

### Database Migration Commands

```bash
# Check migration status
npx prisma migrate status

# Apply all pending migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Seed database (if needed)
npm run seed
```

---

## 🚀 Hosting Options

### Comparison Table

| Platform | Free Tier | Ease of Use | Performance | Price |
|----------|-----------|-------------|-------------|-------|
| Railway | 500 hours/month | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $5/month |
| Heroku | No (paid only) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | $7/month |
| DigitalOcean | No | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $6/month |
| AWS EC2 | 12 months free | ⭐⭐ | ⭐⭐⭐⭐⭐ | Variable |
| Vercel | Yes | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Free/Hobby |

**Recommendation:** Railway (easiest + affordable)

---

## 🚂 Railway Deployment

### Step 1: Prepare Repository

```bash
# Commit all changes
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create Railway Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will auto-detect Node.js

### Step 3: Add MySQL Database

1. Click "+ New"
2. Select "Database"
3. Choose "MySQL"
4. Railway provisions database automatically

### Step 4: Configure Environment Variables

In Railway Dashboard → Variables:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=${{MySQL.DATABASE_URL}}
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

**Note:** Railway auto-injects `DATABASE_URL` from MySQL service.

### Step 5: Add Build Configuration

Create `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npx prisma generate && npm run build"
  },
  "deploy": {
    "startCommand": "npx prisma migrate deploy && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Step 6: Deploy

```bash
# Railway auto-deploys on git push
git push origin main

# Or use Railway CLI
npm install -g @railway/cli
railway login
railway link
railway up
```

### Step 7: Verify Deployment

```bash
# Check logs
railway logs

# Test health endpoint
curl https://your-app.railway.app/api/health
```

### Custom Domain (Optional)

1. Railway Dashboard → Settings → Domains
2. Click "Generate Domain" or "Custom Domain"
3. For custom: Add CNAME record to your DNS

---

## 🔴 Heroku Deployment

### Step 1: Install Heroku CLI

```bash
# Windows (with Chocolatey)
choco install heroku-cli

# Mac
brew tap heroku/brew && brew install heroku

# Verify
heroku --version
```

### Step 2: Create Heroku App

```bash
# Login
heroku login

# Create app
heroku create artconnect-backend

# Add MySQL addon (ClearDB)
heroku addons:create cleardb:ignite

# Get database URL
heroku config:get CLEARDB_DATABASE_URL
```

### Step 3: Configure Buildpacks

```bash
# Add Node.js buildpack
heroku buildpacks:set heroku/nodejs

# Verify
heroku buildpacks
```

### Step 4: Set Environment Variables

```bash
# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set FIREBASE_PROJECT_ID=your-project-id
heroku config:set FIREBASE_PRIVATE_KEY="your-private-key"
heroku config:set FIREBASE_CLIENT_EMAIL=your-client-email
heroku config:set CORS_ORIGIN=https://your-frontend.vercel.app

# Verify
heroku config
```

### Step 5: Create Procfile

```
# Procfile
web: npx prisma migrate deploy && npm start
```

### Step 6: Deploy

```bash
# Add Heroku remote
heroku git:remote -a artconnect-backend

# Deploy
git push heroku main

# Check logs
heroku logs --tail

# Open app
heroku open
```

### Step 7: Scale Dyno

```bash
# Scale up
heroku ps:scale web=1

# Check dyno status
heroku ps
```

---

## 🌊 DigitalOcean Deployment

### Step 1: Create Droplet

1. Go to https://digitalocean.com
2. Create → Droplets
3. Choose Ubuntu 22.04 LTS
4. Select $6/month plan (1GB RAM)
5. Add SSH key
6. Create Droplet

### Step 2: Initial Server Setup

```bash
# SSH into droplet
ssh root@your_droplet_ip

# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Install MySQL
apt install -y mysql-server

# Secure MySQL
mysql_secure_installation

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (reverse proxy)
apt install -y nginx

# Install certbot (SSL)
apt install -y certbot python3-certbot-nginx
```

### Step 3: Setup Database

```bash
# Create database
mysql -u root -p

CREATE DATABASE artconnect_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'artconnect'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON artconnect_prod.* TO 'artconnect'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 4: Clone and Build

```bash
# Create app directory
mkdir -p /var/www/artconnect-backend
cd /var/www/artconnect-backend

# Clone repository
git clone https://github.com/your-username/artconnect-backend.git .

# Install dependencies
npm ci --production

# Create .env file
nano .env
# (paste your environment variables)

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Build
npm run build
```

### Step 5: Configure PM2

```bash
# Create PM2 ecosystem file
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'artconnect-backend',
    script: './dist/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    time: true,
  }],
};
```

```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup systemd
```

### Step 6: Configure Nginx

```bash
# Create Nginx config
nano /etc/nginx/sites-available/artconnect
```

```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/artconnect /etc/nginx/sites-enabled/

# Test Nginx config
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Step 7: Setup SSL with Let's Encrypt

```bash
# Get SSL certificate
certbot --nginx -d api.your-domain.com

# Auto-renewal test
certbot renew --dry-run
```

### Step 8: Setup Firewall

```bash
# Enable UFW
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable

# Check status
ufw status
```

---

## ✅ Post-Deployment

### Health Check

```bash
# Test health endpoint
curl https://your-api-url.com/api/health

# Expected response:
{
  "status": "OK",
  "message": "ArtConnect Backend API is running",
  "timestamp": "2025-10-24T10:30:00.000Z"
}
```

### Database Verification

```bash
# Check migrations
npx prisma migrate status

# Test database connection
npx prisma studio
```

### Performance Testing

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Load test (100 requests, 10 concurrent)
ab -n 100 -c 10 https://your-api-url.com/api/health
```

### Setup Monitoring

**Option 1: PM2 Monitoring (DigitalOcean)**
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

**Option 2: Sentry Error Tracking**
```bash
npm install @sentry/node

# Add to src/index.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Backup Strategy

**Database Backups:**
```bash
# Daily backup script
nano /usr/local/bin/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/mysql"
DB_NAME="artconnect_prod"

mkdir -p $BACKUP_DIR
mysqldump -u artconnect -p$DB_PASSWORD $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
```

```bash
# Make executable
chmod +x /usr/local/bin/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /usr/local/bin/backup-db.sh
```

---

## 📊 Monitoring & Logging

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs artconnect-backend

# View specific log
pm2 logs artconnect-backend --lines 100
```

### Nginx Access Logs

```bash
# View access logs
tail -f /var/log/nginx/access.log

# View error logs
tail -f /var/log/nginx/error.log
```

### Application Logging

Install Winston for structured logging:

```bash
npm install winston
```

```typescript
// src/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

---

## 🔧 Troubleshooting

### Common Issues

**Issue: Database connection timeout**
```bash
# Solution: Increase connection timeout
DATABASE_URL="mysql://user:pass@host/db?connection_timeout=30"
```

**Issue: Prisma Client not generated**
```bash
# Solution: Generate after npm install
npm run build
```

**Issue: Firebase authentication fails**
```bash
# Solution: Check private key format (newlines as \n)
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Issue: CORS errors in production**
```bash
# Solution: Update CORS_ORIGIN
CORS_ORIGIN=https://your-frontend-domain.com
```

### Debugging in Production

```bash
# Check environment variables
printenv | grep FIREBASE

# Test database connection
npx prisma studio

# Check process status
pm2 list
pm2 describe artconnect-backend
```

---

## 📚 Related Documentation

- [API Documentation](./API_DOCUMENTATION.md) - API endpoints
- [Database Schema](./DATABASE_SCHEMA.md) - Database structure
- [Testing Strategy](./TESTING_STRATEGY.md) - Test before deploy

---

## 🔒 Security Checklist

Before going to production:

- [ ] Environment variables secured (not in repository)
- [ ] Database credentials rotated
- [ ] HTTPS enabled (SSL certificate)
- [ ] CORS configured correctly
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Error messages don't expose sensitive info
- [ ] Dependencies updated (npm audit fix)
- [ ] Firebase service account secured
- [ ] Backup strategy in place

---

**Maintained by:** ArtConnect Development Team  
**Last Updated:** October 24, 2025  
**Deployment Version:** 1.0
