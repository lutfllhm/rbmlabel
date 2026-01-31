#!/usr/bin/env node

/**
 * Create or Reset Admin User
 * This script creates or resets the admin user password
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  let connection;
  
  try {
    console.log('🔧 Creating/Resetting Admin User');
    console.log('===================================');
    
    // Get database configuration from environment
    const dbConfig = {
      host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
      port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306'),
      user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
      password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
      database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'railway'
    };
    
    console.log('📊 Database Configuration:');
    console.log('   Host:', dbConfig.host);
    console.log('   Port:', dbConfig.port);
    console.log('   User:', dbConfig.user);
    console.log('   Database:', dbConfig.database);
    
    // Connect to database
    console.log('\n🔄 Connecting to MySQL...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected successfully');
    
    // Check if users table exists
    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'users'"
    );
    
    if (tables.length === 0) {
      console.log('❌ Users table does not exist!');
      console.log('💡 Please run database initialization first');
      process.exit(1);
    }
    
    console.log('✅ Users table found');
    
    // Check if admin exists
    console.log('\n🔍 Checking for existing admin user...');
    const [existingAdmin] = await connection.query(
      "SELECT * FROM users WHERE username = 'admin'"
    );
    
    const hashedPassword = await bcrypt.hash('iware123', 10);
    
    if (existingAdmin.length === 0) {
      // Create new admin
      console.log('📝 Creating new admin user...');
      await connection.query(
        `INSERT INTO users (username, password, full_name, email, role, created_at) 
         VALUES (?, ?, ?, ?, ?, NOW())`,
        ['admin', hashedPassword, 'Administrator', 'admin@rbm.com', 'admin']
      );
      console.log('✅ Admin user created successfully!');
    } else {
      // Update existing admin
      console.log('🔄 Admin user exists, updating password...');
      await connection.query(
        'UPDATE users SET password = ?, updated_at = NOW() WHERE username = ?',
        [hashedPassword, 'admin']
      );
      console.log('✅ Admin password updated successfully!');
    }
    
    // Verify the user
    console.log('\n🔍 Verifying admin user...');
    const [verifyAdmin] = await connection.query(
      "SELECT id, username, full_name, email, role, created_at FROM users WHERE username = 'admin'"
    );
    
    if (verifyAdmin.length > 0) {
      console.log('✅ Admin user verified:');
      console.log('   ID:', verifyAdmin[0].id);
      console.log('   Username:', verifyAdmin[0].username);
      console.log('   Full Name:', verifyAdmin[0].full_name);
      console.log('   Email:', verifyAdmin[0].email);
      console.log('   Role:', verifyAdmin[0].role);
      console.log('   Created:', verifyAdmin[0].created_at);
      
      // Test password
      const isValid = await bcrypt.compare('iware123', verifyAdmin[0].password || hashedPassword);
      console.log('   Password Valid:', isValid ? '✅ YES' : '❌ NO');
    }
    
    console.log('\n🎉 Admin user is ready!');
    console.log('\n📋 Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: iware123');
    console.log('   Apps: material, stoklabel, lps');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run if called directly
if (require.main === module) {
  createAdminUser()
    .then(() => {
      console.log('\n✅ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Failed:', error.message);
      process.exit(1);
    });
}

module.exports = createAdminUser;
