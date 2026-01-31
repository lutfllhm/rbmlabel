#!/usr/bin/env node

const axios = require('axios');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const API_URL = `http://localhost:${PORT}/api`;

async function testLogin() {
  console.log('🧪 Testing login endpoint...\n');
  console.log('API URL:', API_URL);
  console.log('');
  
  const testCases = [
    {
      name: 'Material App Login',
      credentials: {
        username: 'admin',
        password: 'admin123',
        app: 'material'
      }
    },
    {
      name: 'Stoklabel App Login',
      credentials: {
        username: 'admin',
        password: 'admin123',
        app: 'stoklabel'
      }
    },
    {
      name: 'LPS App Login',
      credentials: {
        username: 'admin',
        password: 'admin123',
        app: 'lps'
      }
    },
    {
      name: 'Wrong Password',
      credentials: {
        username: 'admin',
        password: 'wrongpassword',
        app: 'material'
      },
      shouldFail: true
    },
    {
      name: 'Wrong Username',
      credentials: {
        username: 'wronguser',
        password: 'admin123',
        app: 'material'
      },
      shouldFail: true
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of testCases) {
    console.log(`📝 Test: ${testCase.name}`);
    console.log(`   Credentials:`, {
      username: testCase.credentials.username,
      password: '***',
      app: testCase.credentials.app
    });
    
    try {
      const response = await axios.post(`${API_URL}/auth/login`, testCase.credentials);
      
      if (testCase.shouldFail) {
        console.log('   ❌ FAILED - Should have failed but succeeded');
        failed++;
      } else {
        console.log('   ✅ PASSED - Login successful');
        console.log('   Token:', response.data.token.substring(0, 20) + '...');
        console.log('   User:', response.data.user.username);
        console.log('   Role:', response.data.user.role);
        console.log('   App:', response.data.user.app);
        passed++;
      }
    } catch (error) {
      if (testCase.shouldFail) {
        console.log('   ✅ PASSED - Failed as expected');
        console.log('   Error:', error.response?.data?.error || error.message);
        passed++;
      } else {
        console.log('   ❌ FAILED - Login failed');
        console.log('   Error:', error.response?.data?.error || error.message);
        if (error.code === 'ECONNREFUSED') {
          console.log('   💡 Make sure server is running: npm run dev');
        }
        failed++;
      }
    }
    console.log('');
  }
  
  console.log('📊 Test Results:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   Total: ${testCases.length}`);
  
  if (failed > 0) {
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure server is running: npm run dev');
    console.log('   2. Check MySQL is running in XAMPP');
    console.log('   3. Verify user exists: npm run check-users');
    console.log('   4. Check server logs for errors');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed!');
  }
}

testLogin();
