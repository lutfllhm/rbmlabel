#!/usr/bin/env node

const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkUsers() {
  console.log('🔍 Checking users in database...\n');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rbm_combined'
  };
  
  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Connected to database:', config.database);
    
    // Check if users table exists
    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'users'"
    );
    
    if (tables.length === 0) {
      console.log('❌ Users table does not exist!');
      console.log('💡 Run: npm run init-db');
      await connection.end();
      return;
    }
    
    console.log('✅ Users table exists\n');
    
    // Get all users
    const [users] = await connection.query(
      'SELECT id, username, full_name, email, role, created_at FROM users ORDER BY id'
    );
    
    if (users.length === 0) {
      console.log('⚠️  No users found in database!');
      console.log('💡 Run: npm run create-user');
    } else {
      console.log(`Found ${users.length} user(s):\n`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. User ID: ${user.id}`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Full Name: ${user.full_name}`);
        console.log(`   Email: ${user.email || '(not set)'}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Created: ${user.created_at}`);
        console.log('');
      });
      
      console.log('💡 Default credentials (if admin user exists):');
      console.log('   Username: admin');
      console.log('   Password: admin123');
    }
    
    await connection.end();
    console.log('✅ Check completed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUsers();
