#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Checks if the deployment is working correctly
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;
const HOST = process.env.RAILWAY_PUBLIC_DOMAIN || `localhost:${PORT}`;
const PROTOCOL = process.env.RAILWAY_PUBLIC_DOMAIN ? 'https' : 'http';

async function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = PROTOCOL === 'https' ? https : http;
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function verifyDeployment() {
  console.log('🔍 Verifying Railway Deployment');
  console.log('==============================');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Host: ${HOST}`);
  console.log(`Protocol: ${PROTOCOL}`);
  console.log('');

  const checks = [
    {
      name: 'Health Check',
      url: `${PROTOCOL}://${HOST}/api/health`,
      expected: 200
    },
    {
      name: 'Frontend (Root)',
      url: `${PROTOCOL}://${HOST}/`,
      expected: 200
    },
    {
      name: 'Frontend Assets',
      url: `${PROTOCOL}://${HOST}/assets`,
      expected: [200, 404] // 404 is ok if no assets yet
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    try {
      console.log(`🔄 Testing: ${check.name}`);
      console.log(`   URL: ${check.url}`);
      
      const response = await makeRequest(check.url);
      const expectedStatuses = Array.isArray(check.expected) ? check.expected : [check.expected];
      
      if (expectedStatuses.includes(response.status)) {
        console.log(`   ✅ PASS (${response.status})`);
        passed++;
        
        // Additional checks for health endpoint
        if (check.name === 'Health Check' && response.data) {
          try {
            const healthData = JSON.parse(response.data);
            console.log(`   📊 Database: ${healthData.database?.connected ? 'Connected' : 'Disconnected'}`);
            console.log(`   📊 Tables: ${healthData.database?.tables || 0}`);
          } catch (e) {
            console.log(`   ⚠️  Could not parse health data`);
          }
        }
      } else {
        console.log(`   ❌ FAIL (${response.status}, expected ${check.expected})`);
        failed++;
      }
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
      failed++;
    }
    console.log('');
  }

  // File system checks
  console.log('📁 File System Checks');
  console.log('--------------------');
  
  const fileChecks = [
    { path: 'server/public/index.html', name: 'Frontend Build' },
    { path: 'server/database/rbm_combined.sql', name: 'Database Schema' },
    { path: 'database/rbm_combined.sql', name: 'Source Database Schema' }
  ];

  for (const fileCheck of fileChecks) {
    try {
      if (fs.existsSync(fileCheck.path)) {
        const stats = fs.statSync(fileCheck.path);
        console.log(`✅ ${fileCheck.name}: Found (${stats.size} bytes)`);
        passed++;
      } else {
        console.log(`❌ ${fileCheck.name}: Not found at ${fileCheck.path}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${fileCheck.name}: Error checking ${fileCheck.path}`);
      failed++;
    }
  }

  console.log('');
  console.log('📊 Summary');
  console.log('----------');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    console.log('');
    console.log('🎉 All checks passed! Deployment is working correctly.');
    console.log(`🌐 Your app is available at: ${PROTOCOL}://${HOST}`);
  } else {
    console.log('');
    console.log('⚠️  Some checks failed. Please review the issues above.');
    
    if (process.env.NODE_ENV === 'production') {
      console.log('');
      console.log('🔍 Troubleshooting Tips:');
      console.log('- Check Railway logs for errors');
      console.log('- Verify environment variables are set');
      console.log('- Ensure MySQL service is running');
      console.log('- Check if build completed successfully');
    }
  }

  return failed === 0;
}

// Run if called directly
if (require.main === module) {
  verifyDeployment()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error('❌ Verification failed:', error.message);
      process.exit(1);
    });
}

module.exports = verifyDeployment;