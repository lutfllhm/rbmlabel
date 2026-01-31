#!/usr/bin/env node

/**
 * Railway Deployment Script
 * Handles complete deployment setup including database initialization
 */

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

async function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 Running: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
    
    child.on('error', reject);
  });
}

async function deploy() {
  try {
    console.log('🚀 Railway Deployment Started');
    console.log('============================');
    
    // Show environment info
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('Port:', process.env.PORT || '5000');
    console.log('Database Host:', process.env.DB_HOST || 'not set');
    console.log('Database Name:', process.env.DB_NAME || 'rbm_combined');
    
    // Step 1: Initialize database
    console.log('\n📦 Step 1: Database Initialization');
    try {
      const initDb = require('./initDatabase');
      await initDb();
      console.log('✅ Database initialized successfully');
    } catch (dbError) {
      console.error('❌ Database initialization failed:', dbError.message);
      // Continue deployment even if DB init fails (might be already initialized)
      console.log('⚠️  Continuing deployment...');
    }
    
    // Step 2: Verify server can start
    console.log('\n🔧 Step 2: Server Verification');
    try {
      // Test database connection
      const { pool } = require('../config/database');
      await pool.execute('SELECT 1');
      console.log('✅ Database connection verified');
      
      // Check if required directories exist
      const publicDir = path.join(__dirname, '../public');
      try {
        await fs.access(publicDir);
        console.log('✅ Public directory exists');
      } catch {
        await fs.mkdir(publicDir, { recursive: true });
        console.log('✅ Public directory created');
      }
      
    } catch (verifyError) {
      console.error('❌ Server verification failed:', verifyError.message);
      throw verifyError;
    }
    
    console.log('\n🎉 Deployment completed successfully!');
    console.log('🚀 Server is ready to start');
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    console.error('Stack:', error.stack);
    
    // Show debug info for Railway
    console.log('\n🔍 Debug Information:');
    console.log('Current directory:', process.cwd());
    console.log('Script directory:', __dirname);
    console.log('Node version:', process.version);
    console.log('Platform:', process.platform);
    
    console.log('\nEnvironment variables:');
    Object.keys(process.env)
      .filter(key => key.startsWith('DB_') || key.startsWith('RAILWAY_') || key.startsWith('NODE_'))
      .forEach(key => {
        const value = key.includes('PASSWORD') ? '***' : process.env[key];
        console.log(`  ${key}=${value}`);
      });
    
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  deploy();
}

module.exports = deploy;