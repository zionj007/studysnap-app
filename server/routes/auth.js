const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// In-memory storage for users (in production, use a database)
const users = new Map();
const sessions = new Map();

// Admin credentials (in production, store securely)
const ADMIN_CREDENTIALS = {
  email: 'admin@studysnap.com',
  password: 'admin123', // In production, use environment variable
  role: 'admin'
};

// Initialize with admin user
const adminPasswordHash = bcrypt.hashSync(ADMIN_CREDENTIALS.password, 10);
users.set(ADMIN_CREDENTIALS.email, {
  id: 'admin-001',
  email: ADMIN_CREDENTIALS.email,
  password: adminPasswordHash,
  role: 'admin',
  isPro: true,
  plan: 'admin',
  createdAt: new Date().toISOString(),
  usage: {
    uploads: 0,
    generations: 0,
    plan: 'PRO'
  }
});

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'studysnap-secret-key-2024';

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role,
      isPro: user.isPro 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// POST /api/auth/register - User registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    if (users.has(email)) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
      role: 'user',
      isPro: false,
      plan: 'FREE',
      createdAt: new Date().toISOString(),
      usage: {
        uploads: 0,
        generations: 0,
        plan: 'FREE'
      }
    };

    users.set(email.toLowerCase(), newUser);

    // Generate token
    const token = generateToken(newUser);

    // Create session
    sessions.set(userId, {
      userId,
      token,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        isPro: newUser.isPro,
        plan: newUser.plan
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = users.get(email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user);

    // Update session
    sessions.set(user.id, {
      userId: user.id,
      token,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isPro: user.isPro,
        plan: user.plan
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// POST /api/auth/logout - User logout
router.post('/logout', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Remove session
    sessions.delete(userId);
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

// GET /api/auth/me - Get current user info
router.get('/me', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const user = Array.from(users.values()).find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isPro: user.isPro,
        plan: user.plan,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user info'
    });
  }
});

// POST /api/auth/upgrade - Upgrade user to Pro (admin only)
router.post('/upgrade', authenticateToken, async (req, res) => {
  try {
    const { targetUserId, plan } = req.body;
    
    // Check if current user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // Find target user
    const targetUser = Array.from(users.values()).find(u => u.id === targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user plan
    targetUser.isPro = true;
    targetUser.plan = plan || 'PRO';
    targetUser.usage.plan = 'PRO';

    users.set(targetUser.email, targetUser);

    res.json({
      success: true,
      message: `User upgraded to ${targetUser.plan} plan`,
      user: {
        id: targetUser.id,
        email: targetUser.email,
        name: targetUser.name,
        role: targetUser.role,
        isPro: targetUser.isPro,
        plan: targetUser.plan
      }
    });

  } catch (error) {
    console.error('Upgrade error:', error);
    res.status(500).json({
      success: false,
      message: 'Upgrade failed'
    });
  }
});

// GET /api/auth/users - Get all users (admin only)
router.get('/users', authenticateToken, (req, res) => {
  try {
    // Check if current user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const allUsers = Array.from(users.values()).map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isPro: user.isPro,
      plan: user.plan,
      createdAt: user.createdAt,
      usage: user.usage
    }));

    res.json({
      success: true,
      users: allUsers,
      total: allUsers.length
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    });
  }
});

// Export helper functions for use in other routes
module.exports = {
  router,
  authenticateToken,
  users,
  sessions
};
