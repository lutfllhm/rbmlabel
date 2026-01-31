#!/usr/bin/env node

/**
 * Startup script for Railway deployment
 * This script ensures the database is properly initialized before starting the server
 */

const { initializeDatabase } = require('../config/database');

async function startup() {
  try {
    console.log('🚀 Railway Startup Script');
    console.log('========================');
    
    // Show environment info
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('Database Host:', process.env.DB_HOST);
    console.log('Database Name:', process.env.DB_NAME || 'rbm_combined');
    console.log('SQL File Path:', process.env.SQL_FILE_PATH || 'auto-detect');
    
    // Initialize database
    console.log('\n🔄 Initializing database...');
    await initializeDatabase();
    
    console.log('\n✅ Startup completed successfully!');
    console.log('🚀 Ready to start server...');
    
  } catch (error) {
    console.error('\n❌ Startup failed:', error.message);
    console.error('Stack:', error.stack);
    
    // Show debug info for Railway
    console.log('\n🔍 Debug Information:');
    console.log('Current directory:', process.cwd());
    console.log('Script directory:', __dirname);
    console.log('Available environment variables:');
    Object.keys(process.env)
      .filter(key => key.startsWith('DB_') || key.startsWith('RAILWAY_') || key.startsWith('SQL_'))
      .forEach(key => {
        const value = key.includes('PASSWORD') ? '***' : process.env[key];
        console.log(`  ${key}=${value}`);
      });
    
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  startup();
}

module.exports = startup;