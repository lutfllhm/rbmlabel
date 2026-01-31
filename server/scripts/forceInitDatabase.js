#!/usr/bin/env node

/**
 * Force Database Initialization Script
 * Drops all tables and re-creates from SQL file
 * Use this if database initialization fails or needs reset
 */

const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Database configuration
const config = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'rbm_combined',
  multipleStatements: true,
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000
};

// SQL file paths
const possiblePaths = [
  process.env.SQL_FILE_PATH,
  path.join(__dirname, '../database/rbm_combined.sql'),
  path.join(__dirname, '../../database/rbm_combined.sql'),
  path.resolve(__dirname, '../../database/rbm_combined.sql'),
  path.join(process.cwd(), 'database/rbm_combined.sql'),
  path.join(process.cwd(), '../database/rbm_combined.sql'),
  '/app/database/rbm_combined.sql',
  '/app/server/database/rbm_combined.sql'
].filter(Boolean);

async function forceInitDatabase() {
  let connection;
  
  try {
    console.log('🔄 Force Database Initialization');
    console.log('================================');
    console.log('⚠️  WARNING: This will DROP ALL TABLES and recreate them!');
    console.log('');
    
    // Connect to database
    console.log('🔄 Connecting to MySQL...');
    console.log('   Host:', config.host);
    console.log('   Database:', config.database);
    
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL');
    
    // Get existing tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`\n📊 Found ${tables.length} existing tables`);
    
    if (tables.length > 0) {
      console.log('🗑️  Dropping all tables...');
      
      // Disable foreign key checks
      await connection.query('SET FOREIGN_KEY_CHECKS = 0');
      
      // Drop each table
      for (const table of tables) {
        const tableName = Object.values(table)[0];
        await connection.query(`DROP TABLE IF EXISTS \`${tableName}\``);
        console.log(`   ✅ Dropped: ${tableName}`);
      }
      
      // Re-enable foreign key checks
      await connection.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('✅ All tables dropped');
    }
    
    // Find SQL file
    console.log('\n🔍 Searching for SQL file...');
    let sqlFile = null;
    
    for (const sqlPath of possiblePaths) {
      try {
        await fs.access(sqlPath);
        sqlFile = sqlPath;
        console.log(`✅ SQL file found: ${sqlPath}`);
        break;
      } catch (err) {
        // Continue searching
      }
    }
    
    if (!sqlFile) {
      throw new Error('SQL file not found in any expected location');
    }
    
    // Read and clean SQL content
    console.log('\n📄 Reading SQL file...');
    let sqlContent = await fs.readFile(sqlFile, 'utf8');
    console.log(`📄 Original size: ${sqlContent.length} characters`);
    
    // Remove CREATE DATABASE and USE statements
    sqlContent = sqlContent
      .replace(/CREATE DATABASE IF NOT EXISTS.*?;/gi, '')
      .replace(/USE\s+`?rbm_combined`?;?/gi, '')
      .replace(/USE\s+rbm_combined;?/gi, '')
      .trim();
    
    console.log(`📄 Cleaned size: ${sqlContent.length} characters`);
    
    // Split into statements
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`📊 Total statements: ${statements.length}`);
    
    // Execute statements one by one
    console.log('\n⚙️  Executing SQL statements...');
    let successCount = 0;
    let errorCount = 0;
    let lastError = null;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length < 10) continue;
      
      try {
        await connection.query(statement);
        successCount++;
        
        // Show progress every 10 statements
        if ((i + 1) % 10 === 0 || i === statements.length - 1) {
          console.log(`   Progress: ${i + 1}/${statements.length} (${successCount} success, ${errorCount} errors)`);
        }
      } catch (stmtError) {
        errorCount++;
        lastError = stmtError;
        
        // Show first few errors
        if (errorCount <= 5) {
          console.error(`   ⚠️  Statement ${i + 1} error: ${stmtError.message.substring(0, 100)}`);
        }
      }
    }
    
    console.log('\n📊 Execution Summary:');
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    
    if (errorCount > 0 && lastError) {
      console.log(`\n⚠️  Last error: ${lastError.message}`);
    }
    
    // Verify tables created
    const [newTables] = await connection.query('SHOW TABLES');
    console.log(`\n✅ Database now has ${newTables.length} tables:`);
    newTables.forEach(table => console.log(`   - ${Object.values(table)[0]}`));
    
    if (newTables.length === 0) {
      throw new Error('No tables were created! Check SQL file and errors above.');
    }
    
    console.log('\n🎉 Force database initialization completed!');
    
  } catch (error) {
    console.error('\n❌ Force initialization failed:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run if called directly
if (require.main === module) {
  forceInitDatabase()
    .then(() => {
      console.log('\n✅ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Failed:', error.message);
      process.exit(1);
    });
}

module.exports = forceInitDatabase;