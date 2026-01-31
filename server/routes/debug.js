const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

const router = express.Router();

// Debug endpoint - only enable in development or with DEBUG flag
const isDebugEnabled = process.env.NODE_ENV !== 'production' || process.env.ENABLE_DEBUG === 'true';

if (isDebugEnabled) {
  // Check users
  router.get('/users', async (req, res, next) => {
    try {
      const [users] = await pool.execute(
        'SELECT id, username, full_name, email, role, created_at FROM users'
      );
      
      res.json({
        count: users.length,
        users: users
      });
    } catch (error) {
      next(error);
    }
  });
  
  // Test password
  router.post('/test-password', async (req, res, next) => {
    try {
      const { username, password } = req.body;
      
      const [users] = await pool.execute(
        'SELECT id, username, password FROM users WHERE username = ?',
        [username]
      );
      
      if (users.length === 0) {
        return res.json({
          found: false,
          message: 'User not found'
        });
      }
      
      const user = users[0];
      const isValid = await bcrypt.compare(password, user.password);
      
      res.json({
        found: true,
        username: user.username,
        passwordValid: isValid,
        passwordHash: user.password.substring(0, 20) + '...'
      });
    } catch (error) {
      next(error);
    }
  });
  
  // Create test user
  router.post('/create-admin', async (req, res, next) => {
    try {
      // Check if admin exists
      const [existing] = await pool.execute(
        "SELECT * FROM users WHERE username = 'admin'"
      );
      
      if (existing.length > 0) {
        // Update password
        const hashedPassword = await bcrypt.hash('iware123', 10);
        await pool.execute(
          'UPDATE users SET password = ?, full_name = ?, email = ?, role = ? WHERE username = ?',
          [hashedPassword, 'Administrator', 'admin@rbm.com', 'admin', 'admin']
        );
        
        return res.json({
          message: 'Admin user updated',
          username: 'admin',
          password: 'iware123'
        });
      }
      
      // Create new admin
      const hashedPassword = await bcrypt.hash('iware123', 10);
      const [result] = await pool.execute(
        `INSERT INTO users (username, password, full_name, email, role) 
         VALUES (?, ?, ?, ?, ?)`,
        ['admin', hashedPassword, 'Administrator', 'admin@rbm.com', 'admin']
      );
      
      res.json({
        message: 'Admin user created',
        userId: result.insertId,
        username: 'admin',
        password: 'iware123'
      });
    } catch (error) {
      next(error);
    }
  });
  
  // Reset admin password - ALWAYS works
  router.post('/reset-admin-password', async (req, res, next) => {
    try {
      console.log('🔐 Resetting admin password...');
      
      // Check if admin exists
      const [existing] = await pool.execute(
        "SELECT id, username FROM users WHERE username = 'admin'"
      );
      
      // Generate new password hash
      const hashedPassword = await bcrypt.hash('iware123', 10);
      console.log('🔐 New password hash:', hashedPassword.substring(0, 30) + '...');
      
      if (existing.length > 0) {
        // Update existing admin
        await pool.execute(
          'UPDATE users SET password = ?, updated_at = NOW() WHERE username = ?',
          [hashedPassword, 'admin']
        );
        console.log('✅ Admin password updated');
      } else {
        // Create new admin
        await pool.execute(
          `INSERT INTO users (username, password, full_name, email, role, created_at) 
           VALUES (?, ?, ?, ?, ?, NOW())`,
          ['admin', hashedPassword, 'Administrator', 'admin@rbm.com', 'admin']
        );
        console.log('✅ Admin user created');
      }
      
      // Verify password
      const [verify] = await pool.execute(
        "SELECT password FROM users WHERE username = 'admin'"
      );
      
      const isValid = await bcrypt.compare('iware123', verify[0].password);
      console.log('🔍 Password verification:', isValid ? '✅ VALID' : '❌ INVALID');
      
      res.json({
        success: true,
        message: 'Admin password reset successfully',
        verified: isValid,
        credentials: {
          username: 'admin',
          password: 'iware123',
          apps: ['material', 'stoklabel', 'lps']
        }
      });
    } catch (error) {
      console.error('❌ Reset password error:', error);
      next(error);
    }
  });
  
  console.log('🐛 Debug routes enabled at /api/debug/*');
} else {
  // Disabled in production
  router.use((req, res) => {
    res.status(404).json({ error: 'Debug endpoints disabled in production' });
  });
}

module.exports = router;