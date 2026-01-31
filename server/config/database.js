const mysql = require('mysql2/promise');

// Support both Railway and local environment variables
const DB_HOST = process.env.MYSQLHOST || process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.MYSQLPORT || process.env.DB_PORT || 3306;
const DB_USER = process.env.MYSQLUSER || process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '';
const DB_NAME = process.env.MYSQLDATABASE || process.env.DB_NAME || 'rbm_combined';

// Check if we're on Railway
const isRailway = !!process.env.RAILWAY_ENVIRONMENT;

console.log('✅ Database credentials found');
console.log('   Environment:', isRailway ? 'Railway' : 'Local');
console.log('   Host:', DB_HOST);
console.log('   User:', DB_USER);
console.log('   Password:', DB_PASSWORD ? '***' : '(empty)');
console.log('   Port:', DB_PORT);
console.log('   Database:', DB_NAME);

// Single database connection pool
const pool = mysql.createPool({
  host: DB_HOST,
  port: parseInt(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
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
      host: DB_HOST,
      port: parseInt(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      charset: 'utf8mb4',
      timezone: '+00:00'
    });
  } catch (error) {
    console.error('❌ Cannot connect to MySQL server');
    console.error('   Host:', DB_HOST + ':' + DB_PORT);
    console.error('   Error:', error.message);
    
    if (!isRailway && error.code === 'ECONNREFUSED') {
      console.error('\n💡 SOLUTION (Local):');
      console.error('   1. Start XAMPP Control Panel');
      console.error('   2. Click "Start" button for MySQL');
      console.error('   3. Wait until MySQL status shows "Running"');
      console.error('   4. Try running the server again\n');
    } else if (isRailway) {
      console.error('\n💡 SOLUTION (Railway):');
      console.error('   1. Make sure MySQL service is added to your project');
      console.error('   2. Check that environment variables are linked');
      console.error('   3. Verify MySQL service is running\n');
    }
    
    throw error;
  }
};

// Ensure database exists and has schema
const ensureDatabaseExists = async () => {
  let connection;
  try {
    connection = await createInitialConnection();
    
    // On Railway, database already exists, just check it
    if (isRailway) {
      console.log(`✅ Using Railway database '${DB_NAME}'`);
      await connection.query(`USE \`${DB_NAME}\``);
    } else {
      // Local: create database if not exists
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      console.log(`✅ Database '${DB_NAME}' ready`);
      await connection.query(`USE \`${DB_NAME}\``);
    }
    
    // Check if database has tables
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log(`⚠️  Database '${DB_NAME}' is empty, needs schema import`);
      return false; // Needs schema import
    } else {
      console.log(`✅ Database '${DB_NAME}' has ${tables.length} tables`);
      return true; // Already has schema
    }
  } catch (error) {
    console.error(`❌ Error ensuring database '${DB_NAME}':`, error.message);
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
    const dbReady = await ensureDatabaseExists();

    // If database is empty, run schema import
    if (!dbReady) {
      if (isRailway) {
        console.log('🔄 Running Railway schema import...');
        const railwayInitDb = require('../scripts/railwayInitDb');
        await railwayInitDb();
      } else {
        console.log('🔄 Running local schema import...');
        const initDb = require('../scripts/initDatabase');
        await initDb();
      }
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