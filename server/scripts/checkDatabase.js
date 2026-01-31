const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const config = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true
};

const databases = [
  process.env.DB_NAME_MATERIAL || 'rbm_material',
  process.env.DB_NAME_STOKLABEL || 'rbm_stoklabel',
  process.env.DB_NAME_LPS || 'rbm_lps'
];

async function checkDatabase() {
  let connection;
  
  try {
    console.log('🔍 Checking database configuration...\n');
    
    // Check environment variables
    console.log('📋 Environment Variables:');
    console.log(`   DB_HOST: ${process.env.DB_HOST || '❌ NOT SET'}`);
    console.log(`   DB_USER: ${process.env.DB_USER || '❌ NOT SET'}`);
    console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '✅ SET' : '❌ NOT SET'}`);
    console.log(`   DB_PORT: ${process.env.DB_PORT || '3306 (default)'}`);
    console.log(`   DB_NAME_MATERIAL: ${process.env.DB_NAME_MATERIAL || 'rbm_material (default)'}`);
    console.log(`   DB_NAME_STOKLABEL: ${process.env.DB_NAME_STOKLABEL || 'rbm_stoklabel (default)'}`);
    console.log(`   DB_NAME_LPS: ${process.env.DB_NAME_LPS || 'rbm_lps (default)'}`);
    
    // Check required variables
    const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD'];
    const missing = required.filter(v => !process.env[v]);
    
    if (missing.length > 0) {
      console.log('\n❌ Missing required environment variables:', missing.join(', '));
      console.log('   Please set these variables before running the application.');
      process.exit(1);
    }
    
    console.log('\n✅ All required environment variables are set\n');
    
    // Connect to MySQL
    console.log('🔄 Connecting to MySQL...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL successfully\n');
    
    // Check each database
    for (const dbName of databases) {
      console.log(`📦 Checking database: ${dbName}`);
      
      // Check if database exists
      const [dbs] = await connection.query(
        'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?',
        [dbName]
      );
      
      if (dbs.length === 0) {
        console.log(`   ❌ Database '${dbName}' does not exist`);
        console.log(`   💡 Run: npm run init-db to create and import schema\n`);
        continue;
      }
      
      console.log(`   ✅ Database exists`);
      
      // Check tables
      await connection.query(`USE \`${dbName}\``);
      const [tables] = await connection.query('SHOW TABLES');
      
      if (tables.length === 0) {
        console.log(`   ⚠️  Database is empty (0 tables)`);
        console.log(`   💡 Run: npm run init-db to import schema\n`);
      } else {
        console.log(`   ✅ Has ${tables.length} tables`);
        
        // List tables
        console.log(`   📋 Tables:`);
        tables.forEach(table => {
          const tableName = Object.values(table)[0];
          console.log(`      - ${tableName}`);
        });
        console.log('');
      }
    }
    
    console.log('✅ Database check completed!\n');
    
    // Summary
    console.log('📊 Summary:');
    console.log('   Connection: ✅ OK');
    console.log('   Databases: Check results above');
    console.log('\n💡 Next steps:');
    console.log('   - If databases are empty, run: npm run init-db');
    console.log('   - If databases are ready, start server: npm start');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Database check failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Connection refused. Possible causes:');
      console.error('   - MySQL server is not running');
      console.error('   - Wrong host or port');
      console.error('   - Firewall blocking connection');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Access denied. Possible causes:');
      console.error('   - Wrong username or password');
      console.error('   - User does not have access from this host');
    } else if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Host not found. Possible causes:');
      console.error('   - Wrong DB_HOST value');
      console.error('   - DNS resolution failed');
      console.error('   - Network connectivity issue');
    }
    
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Check environment variables in .env file');
    console.error('   2. Verify MySQL server is running');
    console.error('   3. Test connection with mysql client');
    console.error('   4. Check firewall settings');
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run if called directly
if (require.main === module) {
  checkDatabase();
}

module.exports = checkDatabase;
