const jwt = require('jsonwebtoken');
const { materialPool, stoklabelPool, lpsPool } = require('../config/database');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from appropriate database based on app
    let pool;
    switch (decoded.app) {
      case 'material':
        pool = materialPool;
        break;
      case 'stoklabel':
        pool = stoklabelPool;
        break;
      case 'lps':
        pool = lpsPool;
        break;
      default:
        return res.status(401).json({ error: 'Invalid app in token' });
    }

    const [rows] = await pool.execute(
      'SELECT id, username, full_name, email, role FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = { ...rows[0], app: decoded.app };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole
};