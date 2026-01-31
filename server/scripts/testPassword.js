#!/usr/bin/env node

/**
 * Test Password Script
 * Tests if password matches for admin user
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testPassword() {
  let connection;
  
  try {
    console.log('🔐 Testing Admin Password');
    console.log('========================');
    
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
    console.log('✅ Connected to database\n');
    
    // Get admin user
    const [users] = await connection.query(
      "SELECT * FROM users WHERE username = 'admin'"
    );
    
    if (users.length === 0) {
      console.log('❌ Admin user not found!');
      return;
    }
    
    const admin = users[0];
    console.log('✅ Admin user found');
    console.log('   ID:', admin.id);
    console.log('   Username:', admin.username);
    console.log('   Full Name:', admin.full_name);
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.role);
    console.log('   Password Hash:', admin.password.substring(0, 20) + '...');
    
    // Test passwords
    console.log('\n🔍 Testing passwords:');
    
    const testPasswords = ['admin123', 'iware123', 'admin', 'password'];
    
    for (const testPass of testPasswords) {
      const isValid = await bcrypt.compare(testPass, admin.password);
      const status = isValid ? '✅ VALID' : '❌ Invalid';
      console.log(`   ${testPass.padEnd(15)} : ${status}`);
      
      if (isValid) {
        console.log('\n🎉 SUCCESS! Correct password is:', testPass);
        console.log('\n📋 Login credentials:');
        console.log('   Username: admin');
        console.log('   Password:', testPass);
      }
    }
    
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
  testPassword()
    .then(() => {
      console.log('\n✅ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Failed:', error.message);
      process.exit(1);
    });
}

module.exports = testPassword;
