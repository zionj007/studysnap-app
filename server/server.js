const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const uploadRoutes = require('./routes/upload');
const quizRoutes = require('./routes/quiz');
const openaiQuizRoutes = require('./routes/openaiQuiz');

const app = express();
const PORT = process.env.PORT || 3001;

// Environment validation
const requiredEnvVars = ['OPENAI_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn(`⚠️  Warning: Missing environment variables: ${missingEnvVars.join(', ')}`);
  console.warn('   Some features may not work properly.');
}

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'https://studysnap-frontend.vercel.app',
    'https://studysnap-frontend-git-clean-main-zionj007.vercel.app',
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('uploads'));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'StudySnap API Server',
    version: '1.0.0',
    endpoints: {
      upload: 'POST /api/upload',
      generateQuiz: 'POST /api/generate-quiz',
      generateQuestions: 'POST /api/generate-questions',
      health: 'GET /health'
    }
  });
});

app.get('/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    port: PORT,
    services: {
      openai: process.env.OPENAI_API_KEY ? 'configured' : 'not configured',
      uploads: fs.existsSync('uploads') ? 'available' : 'not available',
      cors: process.env.CORS_ORIGIN || 'default'
    },
    environment_variables: {
      node_env: process.env.NODE_ENV || 'development',
      port: PORT,
      cors_origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      openai_configured: !!process.env.OPENAI_API_KEY
    }
  };
  
  res.status(200).json(healthCheck);
});

// Use routes
app.use('/api', uploadRoutes);
app.use('/api', quizRoutes);
app.use('/api', openaiQuizRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  res.status(500).json({
    error: 'Server error',
    message: error.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Upload directory: ${path.join(__dirname, 'uploads')}`);
  console.log(`🔗 API endpoints:`);
  console.log(`   GET  / - API info`);
  console.log(`   GET  /health - Health check`);
  console.log(`   POST /api/upload - Upload files`);
  console.log(`   POST /api/generate-quiz - Generate quiz questions (local)`);
  console.log(`   POST /api/generate-questions - Generate quiz questions (OpenAI)`);
});

module.exports = app;
