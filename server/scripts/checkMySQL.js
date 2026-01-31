#!/usr/bin/env node

const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkMySQL() {
  console.log('🔍 Checking MySQL connection...\n');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  };
  
  console.log('Configuration:');
  console.log('  Host:', config.host);
  console.log('  Port:', config.port);
  console.log('  User:', config.user);
  console.log('  Password:', config.password ? '***' : '(empty)');
  console.log('');
  
  try {
    console.log('🔄 Attempting to connect...');
    const connection = await mysql.createConnection(config);
    
    console.log('✅ MySQL connection successful!\n');
    
    // Get MySQL version
    const [rows] = await connection.query('SELECT VERSION() as version');
    console.log('MySQL Version:', rows[0].version);
    
    // List databases
    const [databases] = await connection.query('SHOW DATABASES');
    console.log('\nAvailable Databases:');
    databases.forEach(db => {
      const dbName = db.Database || db.database;
      console.log('  -', dbName);
    });
    
    // Check if rbm_combined exists
    const dbName = process.env.DB_NAME || 'rbm_combined';
    const dbExists = databases.some(db => 
      (db.Database || db.database) === dbName
    );
    
    console.log('\nTarget Database:', dbName);
    if (dbExists) {
      console.log('✅ Database exists');
      
      // Check tables
      await connection.query(`USE \`${dbName}\``);
      const [tables] = await connection.query('SHOW TABLES');
      
      if (tables.length > 0) {
        console.log(`✅ Database has ${tables.length} tables`);
        console.log('\nTables:');
        tables.forEach(table => {
          const tableName = Object.values(table)[0];
          console.log('  -', tableName);
        });
      } else {
        console.log('⚠️  Database is empty (no tables)');
        console.log('💡 Run: npm run init-db');
      }
    } else {
      console.log('⚠️  Database does not exist');
      console.log('💡 Database will be created automatically when you start the server');
    }
    
    await connection.end();
    console.log('\n✅ MySQL check completed successfully');
    
  } catch (error) {
    console.error('\n❌ MySQL connection failed!');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 SOLUTION:');
      console.error('MySQL server is not running. Please:');
      console.error('  1. Open XAMPP Control Panel');
      console.error('  2. Click "Start" button for MySQL');
      console.error('  3. Wait until status shows "Running"');
      console.error('  4. Run this check again');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 SOLUTION:');
      console.error('Wrong username or password. Please check:');
      console.error('  1. server/.env file');
      console.error('  2. DB_USER and DB_PASSWORD values');
      console.error('  3. MySQL user permissions');
    } else if (error.code === 'ENOTFOUND') {
      console.error('\n💡 SOLUTION:');
      console.error('Cannot find MySQL host. Please check:');
      console.error('  1. DB_HOST in server/.env');
      console.error('  2. Network connection');
    }
    
    process.exit(1);
  }
}

// Run check
checkMySQL();
