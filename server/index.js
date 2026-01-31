const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const materialRoutes = require('./routes/material');
const stoklabelRoutes = require('./routes/stoklabel');
const lpsRoutes = require('./routes/lps');
const publicRoutes = require('./routes/public');
const webhookRoutes = require('./routes/webhooks');

const { errorHandler } = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for React app
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(morgan('combined'));
app.use(limiter);

// CORS configuration - support both development and production
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['*'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // In development, allow localhost
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list or if wildcard is set
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Cache preflight for 10 minutes
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger middleware (for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// CRITICAL: API Routes MUST be registered BEFORE static files
// This ensures API endpoints are not overridden by static file serving
console.log('📍 Registering API routes...');

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/debug', require('./routes/debug')); // Debug routes
app.use('/api/material', authenticateToken, materialRoutes);
app.use('/api/stoklabel', authenticateToken, stoklabelRoutes);
app.use('/api/lps', authenticateToken, lpsRoutes);
console.log('✅ API routes registered');
console.log('   - POST /api/auth/login');
console.log('   - GET  /api/auth/me');
console.log('   - GET  /api/public/*');
console.log('   - POST /api/debug/reset-admin-password');

// Health check
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    const { pool } = require('./config/database');
    await pool.execute('SELECT 1');
    
    // Check if tables exist
    const [tables] = await pool.execute('SHOW TABLES');
    
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: true,
        tables: tables.length,
        tableNames: tables.map(t => Object.values(t)[0])
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: false,
        error: error.message
      }
    });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test auth endpoint specifically
app.post('/api/test-login', (req, res) => {
  res.json({
    message: 'Auth endpoint is reachable!',
    body: req.body,
    timestamp: new Date().toISOString()
  });
});

// List all routes (debug)
app.get('/api/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const path = middleware.regexp.source
            .replace('\\/?', '')
            .replace('(?=\\/|$)', '')
            .replace(/\\\//g, '/');
          routes.push({
            path: path + handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  res.json({ routes });
});

// Serve static files from React build (Production only)
// IMPORTANT: This must come AFTER all API routes
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, 'public');
  
  // Serve static files ONLY for non-API requests
  app.use((req, res, next) => {
    // Skip static file serving for API routes
    if (req.path.startsWith('/api/')) {
      return next();
    }
    express.static(frontendPath)(req, res, next);
  });
  
  // Handle React routing - return all NON-API requests to React app
  // This catch-all route must be LAST
  app.get('*', (req, res) => {
    // Don't catch API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Error handling
app.use(errorHandler);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('🔄 Starting server initialization...');
    
    // Force database initialization every time in production
    if (process.env.NODE_ENV === 'production') {
      console.log('🔄 Production mode: Force database initialization...');
      
      // Use Railway-specific init script
      const railwayInitDb = require('./scripts/railwayInitDb');
      await railwayInitDb();
    } else {
      // Initialize database first
      const { initializeDatabase } = require('./config/database');
      await initializeDatabase();
    }
    
    const PORT = process.env.PORT || 5000;
    
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔒 CORS Origins: ${allowedOrigins.join(', ')}`);
    });
    
  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = { app, io };