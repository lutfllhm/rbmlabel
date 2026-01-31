const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { pool } = require('../config/database');

const router = express.Router();

// Validation schemas
const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  app: Joi.string().valid('material', 'stoklabel', 'lps').required()
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    console.log('🔐 Login attempt:', { username: req.body.username, app: req.body.app });
    
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      console.log('❌ Validation error:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    const { username, password, app } = value;

    // Find user (now using single database)
    const [rows] = await pool.execute(
      'SELECT id, username, password, full_name, email, role FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      console.log('❌ User not found:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    console.log('✅ User found:', { id: user.id, username: user.username, role: user.role });

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('❌ Invalid password for user:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('✅ Password valid');

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        role: user.role,
        app: app 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    console.log('✅ Token generated, login successful');

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        app: app
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    next(error);
  }
});

// Get current user
router.get('/me', async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Use single pool for all apps
    const [rows] = await pool.execute(
      'SELECT id, username, full_name, email, role FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      user: { ...rows[0], app: decoded.app }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;