#!/usr/bin/env node

/**
 * Reset Admin Password - Railway Safe
 * This script ONLY resets the admin password without touching other data
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function resetAdminPassword() {
  let connection;
  
  try {
    console.log('🔐 Resetting Admin Password');
    console.log('============================');
    
    // Get database configuration from environment
    const dbConfig = {
      host: process.env.DB_HOST || process.env.MYSQLHOST,
      port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306'),
      user: process.env.DB_USER || process.env.MYSQLUSER,
      password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
      database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'railway',
      connectTimeout: 60000
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
    const [tables] = await connection.query("SHOW TABLES LIKE 'users'");
    
    if (tables.length === 0) {
      console.log('❌ Users table does not exist!');
      console.log('💡 Please run database initialization first');
      process.exit(1);
    }
    
    console.log('✅ Users table found');
    
    // Check if admin exists
    console.log('\n🔍 Checking for admin user...');
    const [existingAdmin] = await connection.query(
      "SELECT id, username, full_name, email, role FROM users WHERE username = 'admin'"
    );
    
    if (existingAdmin.length === 0) {
      console.log('❌ Admin user does not exist!');
      console.log('💡 Creating new admin user...');
      
      // Create new admin
      const hashedPassword = await bcrypt.hash('iware123', 10);
      await connection.query(
        `INSERT INTO users (username, password, full_name, email, role, created_at) 
         VALUES (?, ?, ?, ?, ?, NOW())`,
        ['admin', hashedPassword, 'Administrator', 'admin@rbm.com', 'admin']
      );
      console.log('✅ Admin user created successfully!');
    } else {
      console.log('✅ Admin user found:', existingAdmin[0].username);
      console.log('   ID:', existingAdmin[0].id);
      console.log('   Full Name:', existingAdmin[0].full_name);
      console.log('   Email:', existingAdmin[0].email);
      console.log('   Role:', existingAdmin[0].role);
    }
    
    // Reset password
    console.log('\n🔄 Resetting password to: iware123');
    const newHashedPassword = await bcrypt.hash('iware123', 10);
    console.log('🔐 New password hash:', newHashedPassword.substring(0, 30) + '...');
    
    await connection.query(
      'UPDATE users SET password = ?, updated_at = NOW() WHERE username = ?',
      [newHashedPassword, 'admin']
    );
    console.log('✅ Password updated in database');
    
    // Verify the password
    console.log('\n🔍 Verifying password...');
    const [verifyAdmin] = await connection.query(
      "SELECT password FROM users WHERE username = 'admin'"
    );
    
    if (verifyAdmin.length > 0) {
      const isValid = await bcrypt.compare('iware123', verifyAdmin[0].password);
      
      if (isValid) {
        console.log('✅ Password verification: SUCCESS');
        console.log('\n🎉 Admin password reset completed!');
        console.log('\n📋 Login Credentials:');
        console.log('   Username: admin');
        console.log('   Password: iware123');
        console.log('   Apps: material, stoklabel, lps');
      } else {
        console.log('❌ Password verification: FAILED');
        console.log('⚠️  Something went wrong with password hashing');
        process.exit(1);
      }
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    
    // Show environment info for debugging
    console.log('\n🔍 Environment Variables:');
    const envVars = [
      'DB_HOST', 'MYSQLHOST',
      'DB_PORT', 'MYSQLPORT', 
      'DB_USER', 'MYSQLUSER',
      'DB_NAME', 'MYSQLDATABASE'
    ];
    
    envVars.forEach(key => {
      const value = process.env[key];
      if (value) {
        console.log(`   ${key}=${key.includes('PASSWORD') ? '***' : value}`);
      }
    });
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run if called directly
if (require.main === module) {
  resetAdminPassword()
    .then(() => {
      console.log('\n✅ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Failed:', error.message);
      process.exit(1);
    });
}

module.exports = resetAdminPassword;
