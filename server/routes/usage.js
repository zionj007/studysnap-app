const express = require('express');
const router = express.Router();

// Import usage tracking functions
const { 
  USAGE_LIMITS, 
  getUserUsage, 
  canPerformAction, 
  incrementUsage, 
  getCurrentWeekKey 
} = require('../utils/usageTracker');

// GET /api/usage - Get user's current usage
router.get('/usage', (req, res) => {
  try {
    const userId = req.query.userId || 'anonymous';
    const usage = getUserUsage(userId);
    const limits = USAGE_LIMITS[usage.plan];
    
    res.json({
      success: true,
      usage: {
        uploads: usage.uploads,
        generations: usage.generations,
        plan: usage.plan,
        limits: {
          uploadsPerWeek: limits.uploadsPerWeek,
          generationsPerWeek: limits.generationsPerWeek
        },
        canUpload: canPerformAction(userId, 'upload'),
        canGenerate: canPerformAction(userId, 'generate'),
        weekStart: usage.weekStart
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST /api/usage/track - Track usage for an action
router.post('/track', (req, res) => {
  try {
    const { userId, action } = req.body;
    
    if (!userId || !action) {
      return res.status(400).json({
        success: false,
        message: 'userId and action are required'
      });
    }
    
    if (!canPerformAction(userId, action)) {
      const usage = getUserUsage(userId);
      const limits = USAGE_LIMITS[usage.plan];
      
      return res.status(403).json({
        success: false,
        message: `Usage limit exceeded. ${usage.plan} plan allows ${limits.uploadsPerWeek === -1 ? 'unlimited' : limits.uploadsPerWeek} ${action}s per week.`,
        upgradeRequired: true,
        currentPlan: usage.plan,
        limits: limits
      });
    }
    
    incrementUsage(userId, action);
    const updatedUsage = getUserUsage(userId);
    
    res.json({
      success: true,
      message: `${action} tracked successfully`,
      usage: {
        uploads: updatedUsage.uploads,
        generations: updatedUsage.generations,
        plan: updatedUsage.plan
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST /api/usage/upgrade - Upgrade user to Pro plan
router.post('/upgrade', (req, res) => {
  try {
    const { userId, plan } = req.body;
    
    if (!userId || !plan) {
      return res.status(400).json({
        success: false,
        message: 'userId and plan are required'
      });
    }
    
    if (!USAGE_LIMITS[plan]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan. Available plans: FREE, PRO'
      });
    }
    
    const usage = getUserUsage(userId);
    usage.plan = plan;
    usageTracker.set(`${userId}_${getCurrentWeekKey()}`, usage);
    
    res.json({
      success: true,
      message: `Successfully upgraded to ${plan} plan`,
      usage: {
        uploads: usage.uploads,
        generations: usage.generations,
        plan: usage.plan,
        limits: USAGE_LIMITS[plan]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/plans - Get available plans
router.get('/plans', (req, res) => {
  try {
    res.json({
      success: true,
      plans: USAGE_LIMITS
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
