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
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.CORS_ORIGIN || '*',
        'https://labelrbm.up.railway.app',
        'https://labelrbm-production.up.railway.app'
      ]
    : (process.env.CLIENT_URL || "http://localhost:5173"),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger middleware (for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
console.log('📍 Registering API routes...');
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/debug', require('./routes/debug')); // Debug routes
app.use('/api/material', authenticateToken, materialRoutes);
app.use('/api/stoklabel', authenticateToken, stoklabelRoutes);
app.use('/api/lps', authenticateToken, lpsRoutes);
console.log('✅ API routes registered');

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
  
  // Serve static files
  app.use(express.static(frontendPath));
  
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
      console.log(`🔒 CORS Origin: ${corsOptions.origin}`);
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