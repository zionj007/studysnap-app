// Usage tracking module
const usageTracker = new Map();

// Usage limits
const USAGE_LIMITS = {
  FREE: {
    uploadsPerWeek: 2,
    generationsPerWeek: 2,
    price: 0
  },
  PRO: {
    uploadsPerWeek: -1, // unlimited
    generationsPerWeek: -1, // unlimited
    price: 5.99
  }
};

// Helper function to get current week key
const getCurrentWeekKey = () => {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  return startOfWeek.toISOString().split('T')[0]; // YYYY-MM-DD format
};

// Helper function to get user usage
const getUserUsage = (userId) => {
  const weekKey = getCurrentWeekKey();
  const userKey = `${userId}_${weekKey}`;
  
  if (!usageTracker.has(userKey)) {
    usageTracker.set(userKey, {
      uploads: 0,
      generations: 0,
      plan: 'FREE',
      weekStart: weekKey
    });
  }
  
  return usageTracker.get(userKey);
};

// Helper function to check if user can perform action
const canPerformAction = (userId, action) => {
  const usage = getUserUsage(userId);
  const limits = USAGE_LIMITS[usage.plan];
  
  if (action === 'upload') {
    return limits.uploadsPerWeek === -1 || usage.uploads < limits.uploadsPerWeek;
  } else if (action === 'generate') {
    return limits.generationsPerWeek === -1 || usage.generations < limits.generationsPerWeek;
  }
  
  return false;
};

// Helper function to increment usage
const incrementUsage = (userId, action) => {
  const usage = getUserUsage(userId);
  
  if (action === 'upload') {
    usage.uploads++;
  } else if (action === 'generate') {
    usage.generations++;
  }
  
  usageTracker.set(`${userId}_${getCurrentWeekKey()}`, usage);
};

module.exports = {
  USAGE_LIMITS,
  getUserUsage,
  canPerformAction,
  incrementUsage,
  getCurrentWeekKey
};
