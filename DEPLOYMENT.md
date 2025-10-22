# 🚀 StudySnap Deployment Guide

## 📸 StudySnap - AI-Powered Study Assistant

A modern web application that transforms uploaded study materials into interactive quizzes using AI. Built with React, Node.js, and OpenAI API.

## ✨ Features

- **📁 File Upload**: Support for PDF, TXT, PNG, JPG files
- **🧠 AI Quiz Generation**: Uses OpenAI API + local fallback for intelligent multiple-choice questions
- **👑 Pro Features**: Subscription-based premium features with Stripe integration
- **📊 Analytics**: Detailed study progress tracking
- **🎨 Modern UI**: Beautiful, responsive design with Tailwind CSS
- **🔄 Real-time**: Live quiz generation and progress tracking

## 🏗️ Architecture

```
studysnap/
├── client/                 # React frontend (Vite + Tailwind)
├── server/                 # Node.js backend (Express + OpenAI)
├── docker-compose.yml     # Production deployment
└── README.md              # This file
```

## 🚀 Quick Start (Development)

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd studysnap
   npm run install:all
   ```

2. **Configure Environment**
   ```bash
   cp server/env.example server/.env
   # Edit server/.env with your OpenAI API key
   ```

3. **Start Development Servers**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 🐳 Production Deployment (Docker)

### Prerequisites
- Docker and Docker Compose
- OpenAI API key
- Domain name (optional)

### 1. Environment Setup

Create `.env` file in the root directory:
```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-openai-api-key-here

# Database Configuration
POSTGRES_PASSWORD=your-secure-password

# Optional: Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

### 2. Deploy with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 3. Access Your Application

- **Frontend**: http://your-server-ip
- **Backend API**: http://your-server-ip:3001
- **Health Check**: http://your-server-ip:3001/health

## ☁️ Cloud Deployment

### Vercel (Frontend)

1. **Connect Repository**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

2. **Configure Environment Variables**
   - `VITE_API_URL`: Your backend API URL

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Render (Backend)

1. **Create New Web Service**
   - Connect your GitHub repository
   - Select "Node" as environment
   - Set build command: `npm install`
   - Set start command: `npm start`

2. **Configure Environment Variables**
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NODE_ENV`: production
   - `PORT`: 3001

3. **Deploy**
   - Render will automatically deploy on git push

### Railway (Full Stack)

1. **Connect Repository**
   - Go to Railway.app
   - Connect your GitHub repository

2. **Configure Services**
   - Frontend: Set root directory to `client/`
   - Backend: Set root directory to `server/`

3. **Deploy**
   - Railway will automatically detect and deploy both services

## 🔧 Configuration

### Environment Variables

#### Server (.env)
```bash
# Required
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=production
PORT=3001

# Optional
CORS_ORIGIN=https://your-frontend-domain.com
MAX_FILE_SIZE=50MB
RATE_LIMIT_MAX_REQUESTS=100

# Database (for future features)
DATABASE_URL=postgresql://user:pass@localhost:5432/studysnap

# Stripe (for Pro subscriptions)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

#### Client (.env)
```bash
VITE_API_URL=https://your-backend-domain.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

### Pro Features Configuration

1. **Stripe Setup**
   - Create Stripe account
   - Get API keys from Stripe Dashboard
   - Configure webhooks for subscription events

2. **OpenAI Setup**
   - Create OpenAI account
   - Generate API key
   - Set usage limits and billing

## 📊 Monitoring & Analytics

### Health Checks
- Backend: `GET /health`
- Database connectivity
- OpenAI API status
- File upload functionality

### Logging
- Application logs: `./logs/app.log`
- Error tracking
- Performance metrics

### Metrics
- Quiz generation count
- User engagement
- Pro subscription metrics
- API usage statistics

## 🔒 Security

### Production Security Checklist
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] File upload validation
- [ ] Environment variables secured
- [ ] Database credentials protected
- [ ] API keys rotated regularly

### Security Headers
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## 🚨 Troubleshooting

### Common Issues

1. **OpenAI API Errors**
   ```bash
   # Check API key
   curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models
   ```

2. **File Upload Issues**
   ```bash
   # Check upload directory permissions
   ls -la server/uploads/
   ```

3. **CORS Errors**
   ```bash
   # Verify CORS_ORIGIN setting
   echo $CORS_ORIGIN
   ```

### Performance Optimization

1. **Enable Gzip Compression**
2. **Configure CDN for static assets**
3. **Implement Redis caching**
4. **Database query optimization**
5. **Image optimization**

## 📈 Scaling

### Horizontal Scaling
- Load balancer (nginx/HAProxy)
- Multiple backend instances
- Database replication
- Redis clustering

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching strategies
- CDN integration

## 🔄 Updates & Maintenance

### Updating the Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Database Migrations
```bash
# Run migrations (when implemented)
npm run migrate
```

### Backup Strategy
```bash
# Database backup
pg_dump studysnap > backup_$(date +%Y%m%d).sql

# File uploads backup
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz server/uploads/
```

## 📞 Support

### Documentation
- API Documentation: `/api/docs`
- Component Library: Storybook (coming soon)
- User Guide: In-app help

### Contact
- Email: support@studysnap.com
- GitHub Issues: [Repository Issues]
- Discord: [Community Server]

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ using React, Node.js, and OpenAI**
