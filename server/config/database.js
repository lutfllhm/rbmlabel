const mysql = require('mysql2/promise');

// Check required environment variables (DB_PASSWORD can be empty for local dev)
const requiredEnvVars = ['DB_HOST', 'DB_USER'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('Available env vars:', Object.keys(process.env).filter(k => k.startsWith('DB_')).join(', '));
  process.exit(1);
}

console.log('✅ Database credentials found');
console.log('   Host:', process.env.DB_HOST);
console.log('   User:', process.env.DB_USER);
console.log('   Password:', process.env.DB_PASSWORD ? '***' : '(empty)');
console.log('   Port:', process.env.DB_PORT || 3306);

// Database name
const dbName = process.env.DB_NAME || 'rbm_combined';

// Single database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: '+00:00',
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Create connection without database to create database if needed
const createInitialConnection = async () => {
  try {
    return await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      charset: 'utf8mb4',
      timezone: '+00:00'
    });
  } catch (error) {
    console.error('❌ Cannot connect to MySQL server');
    console.error('   Make sure MySQL is running on', process.env.DB_HOST + ':' + (process.env.DB_PORT || 3306));
    console.error('   Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 SOLUTION:');
      console.error('   1. Start XAMPP Control Panel');
      console.error('   2. Click "Start" button for MySQL');
      console.error('   3. Wait until MySQL status shows "Running"');
      console.error('   4. Try running the server again\n');
    }
    
    throw error;
  }
};

// Ensure database exists and has schema
const ensureDatabaseExists = async (dbName) => {
  let connection;
  try {
    connection = await createInitialConnection();
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database '${dbName}' ready`);
    
    // Check if database has tables
    await connection.query(`USE \`${dbName}\``);
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log(`⚠️  Database '${dbName}' is empty, needs schema import`);
      return false; // Needs schema import
    } else {
      console.log(`✅ Database '${dbName}' has ${tables.length} tables`);
      return true; // Already has schema
    }
  } catch (error) {
    console.error(`❌ Error ensuring database '${dbName}':`, error.message);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
};

// Initialize database asynchronously
const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');
    
    // Ensure database exists and check if it needs schema
    const dbReady = await ensureDatabaseExists(dbName);

    // If database is empty, run schema import
    if (!dbReady) {
      console.log('🔄 Running schema import...');
      const initDb = require('../scripts/initDatabase');
      await initDb();
    }

    // Test connection
    await pool.execute('SELECT 1');
    console.log('✅ Database connected successfully');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error('Stack:', error.stack);
    throw error; // Re-throw to be handled by server startup
  }
};

// Export single pool for all modules
module.exports = {
  pool,
  initializeDatabase,
  // Backward compatibility - all point to same pool
  materialPool: pool,
  stoklabelPool: pool,
  lpsPool: pool
};