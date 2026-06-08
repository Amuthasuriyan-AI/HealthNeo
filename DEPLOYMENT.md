# 🚀 Deployment Guide - MediBot AI

This guide provides comprehensive instructions for deploying MediBot AI to production environments.

## Table of Contents
- [Local Deployment](#local-deployment)
- [Docker Deployment](#docker-deployment)
- [Production Deployment](#production-deployment)
- [Environment Setup](#environment-setup)
- [Monitoring & Maintenance](#monitoring--maintenance)

## Local Deployment

### Prerequisites
- Node.js 16+
- npm 8+
- MongoDB
- Git

### Step-by-Step Guide

#### 1. Clone Repository
```bash
git clone https://github.com/Amuthasuriyan-AI/HealthNeo.git
cd HealthNeo
```

#### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
npm run build
```

**Frontend:**
```bash
cd frontend
npm install
```

#### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
nano .env
```

#### 4. Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string
```

#### 5. Run Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - MongoDB** (if local)
```bash
mongod
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Docker Deployment

### Prerequisites
- Docker
- Docker Compose

### Quick Start

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Build

#### Build Backend
```bash
docker build -f docker/Dockerfile.backend -t medibot-backend .
docker run -d \
  --name medibot-backend \
  -p 5000:5000 \
  --env-file .env \
  medibot-backend
```

#### Build Frontend
```bash
docker build -f docker/Dockerfile.frontend -t medibot-frontend .
docker run -d \
  --name medibot-frontend \
  -p 3000:3000 \
  medibot-frontend
```

#### Build MongoDB
```bash
docker run -d \
  --name medibot-mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:7.0
```

## Production Deployment

### Deployment Platforms

#### 1. AWS EC2

```bash
# SSH into instance
ssh -i key.pem ubuntu@your-instance-ip

# Install dependencies
sudo apt update
sudo apt install -y nodejs npm docker.io docker-compose

# Clone and configure
git clone https://github.com/Amuthasuriyan-AI/HealthNeo.git
cd HealthNeo

# Create .env file
cp .env.example .env
nano .env

# Build and run with Docker Compose
docker-compose up -d
```

#### 2. Heroku

```bash
# Install Heroku CLI
curl https://cli.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create medibot-ai

# Add MongoDB Atlas addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key
heroku config:set OPENAI_API_KEY=your_key

# Deploy
git push heroku main
```

#### 3. Azure

```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login
az login

# Create resource group
az group create --name medibot-rg --location eastus

# Create App Service
az appservice plan create --name medibot-plan --resource-group medibot-rg --sku B1 --is-linux

# Create web app
az webapp create --resource-group medibot-rg --plan medibot-plan --name medibot-ai

# Configure deployment
az webapp config appsettings set --resource-group medibot-rg --name medibot-ai --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=true
```

#### 4. Vercel (Frontend Only)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

### Production Environment Variables

Create a `.env.production` file:

```env
# Server
PORT=5000
NODE_ENV=production

# Database (use MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medibot-ai?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secure_secret_key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRE=30d

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-3.5-turbo

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM=noreply@medibot-ai.com

# Security
CORS_ORIGIN=https://medibot-ai.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Environment Setup

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### OpenAI API Setup

1. Visit [OpenAI Platform](https://platform.openai.com)
2. Create API key
3. Set usage limits
4. Update `OPENAI_API_KEY` in `.env`

### SendGrid Email Setup (Optional)

1. Create [SendGrid account](https://sendgrid.com)
2. Get API key
3. Configure SMTP settings

### SSL Certificate

For HTTPS in production:

```bash
# Using Let's Encrypt with Certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Configure in nginx
# Update nginx config with certificate paths
```

## Monitoring & Maintenance

### Health Checks

```bash
# Check backend health
curl http://localhost:5000/health

# Expected response:
# {
#   "success": true,
#   "message": "MediBot AI Backend is running",
#   "timestamp": "2024-01-15T10:30:00.000Z"
# }
```

### Logs

```bash
# View Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# View production logs
tail -f /var/log/medibot-ai.log
```

### Database Backup

```bash
# Backup MongoDB
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/medibot-ai" --out /backup/medibot-ai

# Restore MongoDB
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net/medibot-ai" /backup/medibot-ai
```

### Performance Optimization

1. **Enable Caching**
   - Use Redis for session storage
   - Cache API responses

2. **Database Optimization**
   - Create indexes on frequently queried fields
   - Use database connection pooling

3. **Frontend Optimization**
   - Enable gzip compression
   - Minimize and compress assets
   - Use CDN for static files

4. **Backend Optimization**
   - Use clustering with multiple worker processes
   - Implement load balancing
   - Use message queues for heavy operations

### Security Checklist

- [ ] All secrets in environment variables
- [ ] HTTPS enabled on production
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Database backups scheduled
- [ ] SSL certificates installed
- [ ] Firewall rules configured
- [ ] DDoS protection enabled
- [ ] Regular security audits
- [ ] Update dependencies regularly

### CI/CD Pipeline Example (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Build and test backend
        run: |
          cd backend
          npm install
          npm run build
      
      - name: Build frontend
        run: |
          cd frontend
          npm install
          npm run build
      
      - name: Deploy to Docker
        env:
          DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
          DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
        run: |
          echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
          docker build -f docker/Dockerfile.backend -t medibot-backend .
          docker push $DOCKER_USERNAME/medibot-backend
```

## Troubleshooting

### Connection Issues

```bash
# Test MongoDB connection
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/medibot-ai"

# Test backend connectivity
curl -i http://localhost:5000/health

# Check ports
netstat -tulpn | grep LISTEN
```

### Performance Issues

```bash
# Monitor CPU and memory
top

# Check disk usage
du -sh *

# Monitor network
iftop
```

### Log Analysis

```bash
# Find errors in logs
grep -i error /var/log/medibot-ai.log

# Count occurrences
grep -i "error" /var/log/medibot-ai.log | wc -l

# Real-time monitoring
tail -f /var/log/medibot-ai.log | grep ERROR
```

## Support & Resources

- Documentation: See README.md
- GitHub Issues: Report bugs
- Email: support@medibot-ai.com

---

**Happy Deploying! 🚀**
