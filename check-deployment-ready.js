#!/usr/bin/env node

/**
 * Pre-deployment Check Script
 * Verifies all files and configurations are ready for Railway deployment
 */

const fs = require('fs');
const path = require('path');

function checkFile(filePath, description) {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log(`✅ ${description}: Found (${stats.size} bytes)`);
      return true;
    } else {
      console.log(`❌ ${description}: Missing at ${filePath}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description}: Error checking ${filePath} - ${error.message}`);
    return false;
  }
}

function checkPackageJson(filePath, description) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ ${description}: Missing at ${filePath}`);
      return false;
    }

    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`✅ ${description}: Found`);
    
    // Check scripts
    if (content.scripts) {
      const requiredScripts = filePath.includes('server') 
        ? ['start', 'prepare'] 
        : filePath.includes('frontend')
        ? ['build']
        : ['build', 'start'];
      
      const missingScripts = requiredScripts.filter(script => !content.scripts[script]);
      if (missingScripts.length > 0) {
        console.log(`   ⚠️  Missing scripts: ${missingScripts.join(', ')}`);
      } else {
        console.log(`   ✅ Required scripts present`);
      }
    }
    
    return true;
  } catch (error) {
    console.log(`❌ ${description}: Error reading ${filePath} - ${error.message}`);
    return false;
  }
}

function checkDeploymentReady() {
  console.log('🔍 Railway Deployment Readiness Check');
  console.log('====================================');
  console.log('');

  let passed = 0;
  let failed = 0;

  // Core configuration files
  console.log('📋 Configuration Files');
  console.log('----------------------');
  
  const configChecks = [
    { path: 'railway.json', desc: 'Railway Configuration' },
    { path: 'nixpacks.toml', desc: 'Nixpacks Configuration' },
    { path: 'build.js', desc: 'Build Script' },
    { path: 'Procfile', desc: 'Process File' },
    { path: '.railwayignore', desc: 'Railway Ignore File' }
  ];

  configChecks.forEach(check => {
    if (checkFile(check.path, check.desc)) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log('');

  // Package.json files
  console.log('📦 Package Configuration');
  console.log('------------------------');
  
  const packageChecks = [
    { path: 'package.json', desc: 'Root Package.json' },
    { path: 'server/package.json', desc: 'Server Package.json' },
    { path: 'frontend/package.json', desc: 'Frontend Package.json' }
  ];

  packageChecks.forEach(check => {
    if (checkPackageJson(check.path, check.desc)) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log('');

  // Database files
  console.log('🗄️  Database Files');
  console.log('------------------');
  
  const dbChecks = [
    { path: 'database/rbm_combined.sql', desc: 'Source Database Schema' },
    { path: 'server/config/database.js', desc: 'Database Configuration' },
    { path: 'server/scripts/initDatabase.js', desc: 'Database Init Script' }
  ];

  dbChecks.forEach(check => {
    if (checkFile(check.path, check.desc)) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log('');

  // Server files
  console.log('🖥️  Server Files');
  console.log('----------------');
  
  const serverChecks = [
    { path: 'server/index.js', desc: 'Main Server File' },
    { path: 'server/.env.example.railway', desc: 'Railway Environment Example' },
    { path: 'server/scripts/prepareBuild.js', desc: 'Build Preparation Script' }
  ];

  serverChecks.forEach(check => {
    if (checkFile(check.path, check.desc)) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log('');

  // Frontend files
  console.log('🌐 Frontend Files');
  console.log('-----------------');
  
  const frontendChecks = [
    { path: 'frontend/index.html', desc: 'Frontend HTML Template' },
    { path: 'frontend/vite.config.js', desc: 'Vite Configuration' },
    { path: 'frontend/.env.production', desc: 'Frontend Production Environment' },
    { path: 'frontend/src/services/api.js', desc: 'API Configuration' }
  ];

  frontendChecks.forEach(check => {
    if (checkFile(check.path, check.desc)) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log('');

  // Routes check
  console.log('🛣️  API Routes');
  console.log('--------------');
  
  const routeChecks = [
    { path: 'server/routes/auth.js', desc: 'Authentication Routes' },
    { path: 'server/routes/material.js', desc: 'Material Routes' },
    { path: 'server/routes/stoklabel.js', desc: 'Stock Label Routes' },
    { path: 'server/routes/lps.js', desc: 'LPS Routes' },
    { path: 'server/routes/public.js', desc: 'Public Routes' },
    { path: 'server/routes/webhooks.js', desc: 'Webhook Routes' }
  ];

  routeChecks.forEach(check => {
    if (checkFile(check.path, check.desc)) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log('');

  // Documentation
  console.log('📚 Documentation');
  console.log('----------------');
  
  const docChecks = [
    { path: 'README.md', desc: 'Main README' },
    { path: 'RAILWAY-SETUP.md', desc: 'Railway Setup Guide' },
    { path: 'DEPLOYMENT-CHECKLIST.md', desc: 'Deployment Checklist' }
  ];

  docChecks.forEach(check => {
    if (checkFile(check.path, check.desc)) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log('');
  console.log('📊 Summary');
  console.log('----------');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Readiness: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    console.log('');
    console.log('🎉 All checks passed! Your project is ready for Railway deployment.');
    console.log('');
    console.log('Next steps:');
    console.log('1. Push your code to GitHub');
    console.log('2. Create Railway project from GitHub repo');
    console.log('3. Add MySQL service to Railway');
    console.log('4. Set environment variables (see RAILWAY-SETUP.md)');
    console.log('5. Deploy and verify');
  } else {
    console.log('');
    console.log('⚠️  Some files are missing. Please address the issues above before deploying.');
    console.log('');
    console.log('Common fixes:');
    console.log('- Run the build preparation scripts');
    console.log('- Check file paths and names');
    console.log('- Ensure all dependencies are installed');
  }

  return failed === 0;
}

// Run if called directly
if (require.main === module) {
  const ready = checkDeploymentReady();
  process.exit(ready ? 0 : 1);
}

module.exports = checkDeploymentReady;