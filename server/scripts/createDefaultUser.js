#!/usr/bin/env node

/**
 * Create Default User Script
 * Creates admin user if not exists
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createDefaultUser() {
  let connection;
  
  try {
    console.log('👤 Creating Default User');
    console.log('========================');
    
    // Database configuration
    const dbConfig = {
      host: process.env.DB_HOST || process.env.MYSQLHOST,
      port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306'),
      user: process.env.DB_USER || process.env.MYSQLUSER,
      password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
      database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'railway',
      connectTimeout: 60000
    };
    
    console.log('📊 Database:', dbConfig.database);
    console.log('🔗 Host:', dbConfig.host);
    
    // Connect
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');
    
    // Check if users table exists
    const [tables] = await connection.query("SHOW TABLES LIKE 'users'");
    if (tables.length === 0) {
      console.log('❌ Users table does not exist!');
      console.log('💡 Run database initialization first');
      return;
    }
    
    console.log('✅ Users table exists');
    
    // Check if admin user exists
    const [existingUsers] = await connection.query(
      "SELECT * FROM users WHERE username = 'admin'"
    );
    
    if (existingUsers.length > 0) {
      console.log('ℹ️  Admin user already exists');
      console.log('📋 User details:');
      console.log('   ID:', existingUsers[0].id);
      console.log('   Username:', existingUsers[0].username);
      console.log('   Full Name:', existingUsers[0].full_name);
      console.log('   Email:', existingUsers[0].email);
      console.log('   Role:', existingUsers[0].role);
      
      // Verify password hash
      const testPassword = 'admin123';
      const isValid = await bcrypt.compare(testPassword, existingUsers[0].password);
      console.log('   Password (admin123):', isValid ? '✅ Valid' : '❌ Invalid');
      
      if (!isValid) {
        console.log('\n⚠️  Password hash is invalid! Updating...');
        const newHash = await bcrypt.hash(testPassword, 10);
        await connection.query(
          'UPDATE users SET password = ? WHERE username = ?',
          [newHash, 'admin']
        );
        console.log('✅ Password updated successfully');
      }
      
      return;
    }
    
    // Create admin user
    console.log('\n🔄 Creating admin user...');
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await connection.query(
      `INSERT INTO users (username, password, full_name, email, role) 
       VALUES (?, ?, ?, ?, ?)`,
      ['admin', hashedPassword, 'Administrator', 'admin@rbm.com', 'admin']
    );
    
    console.log('✅ Admin user created successfully!');
    console.log('📋 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   User ID:', result.insertId);
    
    // Verify creation
    const [newUser] = await connection.query(
      "SELECT * FROM users WHERE username = 'admin'"
    );
    
    if (newUser.length > 0) {
      console.log('\n✅ Verification successful');
      console.log('   ID:', newUser[0].id);
      console.log('   Username:', newUser[0].username);
      console.log('   Full Name:', newUser[0].full_name);
      console.log('   Role:', newUser[0].role);
      
      // Test password
      const isValid = await bcrypt.compare(password, newUser[0].password);
      console.log('   Password test:', isValid ? '✅ Valid' : '❌ Invalid');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
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
  createDefaultUser()
    .then(() => {
      console.log('\n✅ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Failed:', error.message);
      process.exit(1);
    });
}

module.exports = createDefaultUser;