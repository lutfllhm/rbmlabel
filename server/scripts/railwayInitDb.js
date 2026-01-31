#!/usr/bin/env node

/**
 * Railway-specific Database Initialization
 * This script ensures tables are created in the correct Railway MySQL database
 */

const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function railwayInitDb() {
  let connection;
  
  try {
    console.log('🚂 Railway Database Initialization');
    console.log('===================================');
    
    // Get database configuration from environment
    const dbConfig = {
      host: process.env.DB_HOST || process.env.MYSQLHOST,
      port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306'),
      user: process.env.DB_USER || process.env.MYSQLUSER,
      password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
      database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'railway',
      multipleStatements: true,
      connectTimeout: 60000
    };
    
    console.log('📊 Database Configuration:');
    console.log('   Host:', dbConfig.host);
    console.log('   Port:', dbConfig.port);
    console.log('   User:', dbConfig.user);
    console.log('   Database:', dbConfig.database);
    console.log('   Password:', dbConfig.password ? '***' : '(empty)');
    
    // Connect to database
    console.log('\n🔄 Connecting to MySQL...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected successfully');
    
    // Check current database
    const [dbResult] = await connection.query('SELECT DATABASE() as db');
    console.log('📍 Current database:', dbResult[0].db);
    
    // Check existing tables
    const [existingTables] = await connection.query('SHOW TABLES');
    console.log(`📊 Existing tables: ${existingTables.length}`);
    
    if (existingTables.length > 0) {
      console.log('📋 Tables found:');
      existingTables.forEach(table => {
        console.log(`   - ${Object.values(table)[0]}`);
      });
      
      // Check if FORCE_DB_INIT is set
      if (process.env.FORCE_DB_INIT !== 'true') {
        console.log('\n✅ Database already initialized');
        console.log('💡 Set FORCE_DB_INIT=true to reinitialize');
        return;
      }
      
      console.log('\n⚠️  FORCE_DB_INIT=true: Dropping all tables...');
      await connection.query('SET FOREIGN_KEY_CHECKS = 0');
      
      for (const table of existingTables) {
        const tableName = Object.values(table)[0];
        await connection.query(`DROP TABLE IF EXISTS \`${tableName}\``);
        console.log(`   ✅ Dropped: ${tableName}`);
      }
      
      await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    }
    
    // Find SQL file
    console.log('\n🔍 Searching for SQL file...');
    const possiblePaths = [
      process.env.SQL_FILE_PATH,
      path.join(__dirname, '../database/rbm_combined.sql'), // server/database/rbm_combined.sql
      '/app/server/database/rbm_combined.sql', // Railway absolute path
      '/app/database/rbm_combined.sql', // Root database folder
      path.join(__dirname, '../../database/rbm_combined.sql'),
      path.join(process.cwd(), '../database/rbm_combined.sql'),
      path.join(process.cwd(), 'database/rbm_combined.sql')
    ].filter(Boolean);
    
    let sqlFile = null;
    for (const sqlPath of possiblePaths) {
      try {
        await fs.access(sqlPath);
        sqlFile = sqlPath;
        console.log(`✅ Found: ${sqlPath}`);
        break;
      } catch (err) {
        // Continue searching
      }
    }
    
    if (!sqlFile) {
      throw new Error('SQL file not found. Checked paths: ' + possiblePaths.join(', '));
    }
    
    // Read SQL file
    console.log('\n📄 Reading SQL file...');
    let sqlContent = await fs.readFile(sqlFile, 'utf8');
    console.log(`📄 Original size: ${sqlContent.length} characters`);
    
    // Clean SQL content - remove database creation and USE statements
    console.log('🧹 Cleaning SQL content...');
    sqlContent = sqlContent
      // Remove CREATE DATABASE statements
      .replace(/CREATE\s+DATABASE\s+IF\s+NOT\s+EXISTS\s+`?rbm_combined`?\s+.*?;/gi, '')
      .replace(/CREATE\s+DATABASE\s+`?rbm_combined`?\s+.*?;/gi, '')
      // Remove USE statements
      .replace(/USE\s+`?rbm_combined`?\s*;?/gi, '')
      // Remove comments at start of lines
      .split('\n')
      .filter(line => !line.trim().startsWith('--') || line.includes('CREATE') || line.includes('INSERT'))
      .join('\n')
      .trim();
    
    console.log(`📄 Cleaned size: ${sqlContent.length} characters`);
    
    // Split into individual statements
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 10 && !s.match(/^--/));
    
    console.log(`📊 Total statements to execute: ${statements.length}`);
    
    // Execute statements one by one
    console.log('\n⚙️  Executing SQL statements...');
    let successCount = 0;
    let errorCount = 0;
    let tableCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        await connection.query(statement);
        successCount++;
        
        // Count CREATE TABLE statements
        if (statement.toUpperCase().includes('CREATE TABLE')) {
          tableCount++;
          const match = statement.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?(\w+)`?/i);
          if (match) {
            console.log(`   ✅ Created table: ${match[1]}`);
          }
        }
        
        // Show progress
        if ((i + 1) % 20 === 0) {
          console.log(`   Progress: ${i + 1}/${statements.length} statements`);
        }
      } catch (error) {
        errorCount++;
        
        // Only show first few errors
        if (errorCount <= 3) {
          console.error(`   ⚠️  Error in statement ${i + 1}:`, error.message.substring(0, 100));
        }
      }
    }
    
    console.log('\n📊 Execution Summary:');
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📋 Tables created: ${tableCount}`);
    
    // Verify tables
    const [finalTables] = await connection.query('SHOW TABLES');
    console.log(`\n✅ Final table count: ${finalTables.length}`);
    
    if (finalTables.length > 0) {
      console.log('📋 Tables in database:');
      finalTables.forEach(table => {
        console.log(`   - ${Object.values(table)[0]}`);
      });
    }
    
    if (finalTables.length === 0) {
      throw new Error('No tables were created! Check SQL file and errors above.');
    }
    
    console.log('\n🎉 Railway database initialization completed successfully!');
    
    // Create editor tables
    console.log('\n📝 Creating editor tables...');
    try {
      // Create editor_documents table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS editor_documents (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          title VARCHAR(255) NOT NULL,
          content LONGTEXT,
          format ENUM('json', 'xml', 'html', 'txt', 'markdown') DEFAULT 'txt',
          is_public BOOLEAN DEFAULT FALSE,
          file_size INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          INDEX idx_user_id (user_id),
          INDEX idx_created_at (created_at),
          INDEX idx_is_public (is_public)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('   ✅ editor_documents table created');

      // Create editor_history table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS editor_history (
          id INT AUTO_INCREMENT PRIMARY KEY,
          document_id INT NOT NULL,
          content LONGTEXT,
          version INT NOT NULL,
          file_size INT DEFAULT 0,
          created_by INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (document_id) REFERENCES editor_documents(id) ON DELETE CASCADE,
          FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
          INDEX idx_document_id (document_id),
          INDEX idx_version (document_id, version)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('   ✅ editor_history table created');

      // Create editor_shares table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS editor_shares (
          id INT AUTO_INCREMENT PRIMARY KEY,
          document_id INT NOT NULL,
          shared_by INT NOT NULL,
          shared_with INT,
          share_token VARCHAR(64) UNIQUE,
          permission ENUM('view', 'edit') DEFAULT 'view',
          expires_at TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (document_id) REFERENCES editor_documents(id) ON DELETE CASCADE,
          FOREIGN KEY (shared_by) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (shared_with) REFERENCES users(id) ON DELETE CASCADE,
          INDEX idx_document_id (document_id),
          INDEX idx_share_token (share_token)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('   ✅ editor_shares table created');
      
      console.log('✅ All editor tables created successfully');
    } catch (editorError) {
      console.error('⚠️  Could not create editor tables:', editorError.message);
      // Don't throw - editor tables are optional
    }
    
    // Create default user - ALWAYS reset password
    console.log('\n👤 Creating/Resetting default admin user...');
    try {
      const bcrypt = require('bcryptjs');
      
      // Check if admin exists
      const [existingAdmin] = await connection.query(
        "SELECT * FROM users WHERE username = 'admin'"
      );
      
      // Generate new password hash
      const hashedPassword = await bcrypt.hash('iware123', 10);
      console.log('🔐 Generated password hash:', hashedPassword.substring(0, 30) + '...');
      
      if (existingAdmin.length === 0) {
        // Create new admin
        await connection.query(
          `INSERT INTO users (username, password, full_name, email, role, created_at) 
           VALUES (?, ?, ?, ?, ?, NOW())`,
          ['admin', hashedPassword, 'Administrator', 'admin@rbm.com', 'admin']
        );
        console.log('✅ Default admin user created');
      } else {
        // ALWAYS update password to ensure it's correct
        console.log('🔄 Admin user exists, resetting password...');
        await connection.query(
          'UPDATE users SET password = ?, updated_at = NOW() WHERE username = ?',
          [hashedPassword, 'admin']
        );
        console.log('✅ Admin password reset successfully');
      }
      
      // Verify the password works
      const [verifyAdmin] = await connection.query(
        "SELECT * FROM users WHERE username = 'admin'"
      );
      
      if (verifyAdmin.length > 0) {
        const testPassword = await bcrypt.compare('iware123', verifyAdmin[0].password);
        console.log('🔍 Password verification:', testPassword ? '✅ VALID' : '❌ INVALID');
        
        if (testPassword) {
          console.log('\n📋 Login Credentials:');
          console.log('   Username: admin');
          console.log('   Password: iware123');
          console.log('   Apps: material, stoklabel, lps');
        } else {
          console.error('❌ WARNING: Password verification failed!');
        }
      }
    } catch (userError) {
      console.error('❌ Could not create/reset admin user:', userError.message);
      console.error('Stack:', userError.stack);
      throw userError; // Re-throw to fail the initialization
    }
    
  } catch (error) {
    console.error('\n❌ Railway database initialization failed:', error.message);
    console.error('Stack:', error.stack);
    
    // Show environment info for debugging
    console.log('\n🔍 Environment Variables:');
    const envVars = [
      'DB_HOST', 'MYSQLHOST',
      'DB_PORT', 'MYSQLPORT', 
      'DB_USER', 'MYSQLUSER',
      'DB_NAME', 'MYSQLDATABASE',
      'FORCE_DB_INIT'
    ];
    
    envVars.forEach(key => {
      const value = process.env[key];
      if (value) {
        console.log(`   ${key}=${key.includes('PASSWORD') ? '***' : value}`);
      }
    });
    
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run if called directly
if (require.main === module) {
  railwayInitDb()
    .then(() => {
      console.log('\n✅ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Failed:', error.message);
      process.exit(1);
    });
}

module.exports = railwayInitDb;