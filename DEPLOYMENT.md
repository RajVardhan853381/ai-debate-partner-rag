# Deployment Guide

This guide covers different deployment options for the AI Debate Partner application.

## Table of Contents

1. [Local Development](#local-development)
2. [Docker Development](#docker-development)
3. [Production Deployment](#production-deployment)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Monitoring and Logs](#monitoring-and-logs)

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-debate-partner
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Start development servers**
   ```bash
   # Start all services
   npm run dev
   
   # Or start individually
   npm run dev:backend  # Backend on port 5000
   npm run dev:frontend # Frontend on port 3000
   ```

## Docker Development

### Prerequisites

- Docker
- Docker Compose

### Setup

1. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

2. **Start with Docker Compose**
   ```bash
   # Development environment
   docker-compose up -d
   
   # View logs
   docker-compose logs -f
   
   # Stop services
   docker-compose down
   ```

### Services

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **ChromaDB**: http://localhost:8000

## Production Deployment

### Option 1: Vercel (Frontend) + Render/Railway (Backend)

#### Frontend (Vercel)

1. **Connect repository to Vercel**
2. **Configure build settings**:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/.next`
   - Root Directory: `frontend`

3. **Set environment variables**:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-api-domain.com
   NEXT_PUBLIC_APP_NAME=AI Debate Partner
   ```

#### Backend (Render/Railway)

1. **Connect repository**
2. **Configure build settings**:
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`

3. **Set environment variables** (see [Environment Variables](#environment-variables))

### Option 2: Docker Compose Production

1. **Set up production environment**
   ```bash
   cp .env.example .env.production
   # Edit with production values
   ```

2. **Deploy with production compose file**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Option 3: Kubernetes

1. **Build and push Docker images**
   ```bash
   # Backend
   docker build -t your-registry/ai-debate-backend:latest ./backend
   docker push your-registry/ai-debate-backend:latest
   
   # Frontend
   docker build -t your-registry/ai-debate-frontend:latest ./frontend
   docker push your-registry/ai-debate-frontend:latest
   ```

2. **Apply Kubernetes manifests**
   ```bash
   kubectl apply -f k8s/
   ```

## Environment Variables

### Required Variables

```env
# LLM API
GEMINI_API_KEY=your_gemini_api_key

# Database
DATABASE_URL=file:./db/database.sqlite

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret_32_chars_min
NEXTAUTH_URL=https://your-domain.com
JWT_SECRET=your_jwt_secret_32_chars_min

# Email (Magic Links)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@gmail.com
EMAIL_SERVER_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com

# Vector Database
CHROMA_HOST=localhost
CHROMA_PORT=8000

# Backend
BACKEND_URL=https://your-api-domain.com
PORT=5000
CORS_ORIGIN=https://your-domain.com
```

### Optional Variables

```env
NODE_ENV=production
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EMBEDDING_MODEL=all-MiniLM-L6-v2
MAX_RETRIEVAL_DOCS=10
SIMILARITY_THRESHOLD=0.7
```

## Database Setup

### Development

The SQLite database is automatically created when the backend starts.

### Production

1. **Initialize database**
   ```bash
   cd backend
   npm run db:migrate
   ```

2. **Backup database** (recommended)
   ```bash
   # Create backup
   cp db/database.sqlite db/database.backup.sqlite
   
   # Restore from backup
   cp db/database.backup.sqlite db/database.sqlite
   ```

### Scaling Considerations

For production at scale, consider migrating to:
- PostgreSQL for the main database
- Hosted vector database (Pinecone, Weaviate Cloud)

## Monitoring and Logs

### Health Checks

- Backend: `GET /health`
- Frontend: Standard Next.js health check

### Logging

#### Development
```bash
# Docker logs
docker-compose logs -f [service-name]

# Local logs
npm run dev # Logs to console
```

#### Production

Set up log aggregation with:
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Datadog
- New Relic
- AWS CloudWatch

### Performance Monitoring

1. **Application Performance Monitoring (APM)**
   - New Relic
   - Datadog APM
   - Application Insights

2. **Error Tracking**
   - Sentry
   - Bugsnag
   - Rollbar

3. **Uptime Monitoring**
   - UptimeRobot
   - Pingdom
   - StatusCake

## Security Considerations

### Production Checklist

- [ ] Use HTTPS everywhere
- [ ] Set secure environment variables
- [ ] Enable CORS properly
- [ ] Set up rate limiting
- [ ] Use secure session configuration
- [ ] Enable security headers (Helmet.js)
- [ ] Regular security updates
- [ ] Database backups
- [ ] Monitoring and alerting

### SSL/TLS

Ensure SSL certificates are configured:
- Use Let's Encrypt for free certificates
- CloudFlare for CDN and security
- AWS Certificate Manager for AWS deployments

## Scaling

### Horizontal Scaling

1. **Load Balancer**: NGINX, AWS ALB, CloudFlare
2. **Multiple Backend Instances**: PM2, Kubernetes
3. **Database Scaling**: Read replicas, connection pooling
4. **CDN**: CloudFlare, AWS CloudFront

### Vertical Scaling

- Monitor resource usage
- Scale CPU/Memory as needed
- Optimize database queries
- Implement caching (Redis)

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Check DATABASE_URL
   - Ensure database file permissions
   - Run migrations: `npm run db:migrate`

2. **ChromaDB connection issues**
   - Verify CHROMA_HOST and CHROMA_PORT
   - Check if ChromaDB service is running
   - Check network connectivity

3. **Email delivery issues**
   - Verify email credentials
   - Check SMTP settings
   - Test with a different email provider

4. **Build failures**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all environment variables

### Debug Commands

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f [service]

# Restart service
docker-compose restart [service]

# Database console
sqlite3 backend/db/database.sqlite

# Test API endpoints
curl http://localhost:5000/health
```

## Support

For deployment issues:
1. Check the logs first
2. Verify environment variables
3. Test individual components
4. Check network connectivity
5. Review security settings

For additional support, please refer to the main README.md or create an issue in the repository.