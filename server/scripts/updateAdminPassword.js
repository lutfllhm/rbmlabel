#!/usr/bin/env node

/**
 * Update Admin Password Script
 * Updates admin password to admin123
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function updateAdminPassword() {
  let connection;
  
  try {
    console.log('🔐 Updating Admin Password');
    console.log('==========================');
    
    // Database configuration
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'rbm_combined',
      connectTimeout: 60000
    };
    
    console.log('📊 Database:', dbConfig.database);
    console.log('🔗 Host:', dbConfig.host);
    
    // Connect
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');
    
    // Check if admin user exists
    const [existingUsers] = await connection.query(
      "SELECT * FROM users WHERE username = 'admin'"
    );
    
    if (existingUsers.length === 0) {
      console.log('❌ Admin user does not exist!');
      return;
    }
    
    console.log('✅ Admin user found');
    console.log('   ID:', existingUsers[0].id);
    console.log('   Username:', existingUsers[0].username);
    
    // Create new password hash
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    console.log('\n🔄 Updating password...');
    
    // Update password
    await connection.query(
      'UPDATE users SET password = ? WHERE username = ?',
      [hashedPassword, 'admin']
    );
    
    console.log('✅ Password updated successfully!');
    
    // Verify new password
    const [updatedUser] = await connection.query(
      "SELECT * FROM users WHERE username = 'admin'"
    );
    
    const isValid = await bcrypt.compare(newPassword, updatedUser[0].password);
    console.log('\n✅ Verification:');
    console.log('   New password (admin123):', isValid ? '✅ Valid' : '❌ Invalid');
    
    console.log('\n📋 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure MySQL is running');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('💡 Database does not exist. Run: npm run init-db');
    }
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run if called directly
if (require.main === module) {
  updateAdminPassword()
    .then(() => {
      console.log('\n✅ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Failed:', error.message);
      process.exit(1);
    });
}

module.exports = updateAdminPassword;
