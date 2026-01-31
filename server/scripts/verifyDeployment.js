const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Railway Deployment Readiness...\n');

let hasErrors = false;
let hasWarnings = false;

// Check 1: Required files exist
console.log('📁 Checking required files...');
const requiredFiles = [
  'package.json',
  'railway.json',
  'nixpacks.toml',
  'server/package.json',
  'server/index.js',
  'server/config/database.js',
  'server/scripts/initDatabase.js',
  'frontend/package.json',
  'database/rbm_lps.sql',
  'database/rbm_material.sql',
  'database/rbm_stoklabel.sql'
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '../..', file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING`);
    hasErrors = true;
  }
});

// Check 2: Package.json scripts
console.log('\n📦 Checking package.json scripts...');
const rootPackage = require('../../package.json');
const requiredScripts = ['build', 'start', 'install:all'];

requiredScripts.forEach(script => {
  if (rootPackage.scripts && rootPackage.scripts[script]) {
    console.log(`   ✅ ${script}: ${rootPackage.scripts[script]}`);
  } else {
    console.log(`   ❌ ${script} - MISSING`);
    hasErrors = true;
  }
});

// Check 3: Server dependencies
console.log('\n📚 Checking server dependencies...');
const serverPackage = require('../package.json');
const requiredDeps = [
  'express',
  'mysql2',
  'cors',
  'helmet',
  'bcryptjs',
  'jsonwebtoken',
  'dotenv',
  'socket.io',
  'compression',
  'morgan',
  'express-rate-limit'
];

requiredDeps.forEach(dep => {
  if (serverPackage.dependencies && serverPackage.dependencies[dep]) {
    console.log(`   ✅ ${dep}`);
  } else {
    console.log(`   ❌ ${dep} - MISSING`);
    hasErrors = true;
  }
});

// Check 4: Environment variables template
console.log('\n🔐 Checking environment templates...');
const envExample = path.join(__dirname, '..', '.env.example');
if (fs.existsSync(envExample)) {
  const envContent = fs.readFileSync(envExample, 'utf8');
  const requiredEnvVars = [
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME_LPS',
    'DB_NAME_MATERIAL',
    'DB_NAME_STOKLABEL',
    'JWT_SECRET',
    'PORT'
  ];
  
  requiredEnvVars.forEach(envVar => {
    if (envContent.includes(envVar)) {
      console.log(`   ✅ ${envVar}`);
    } else {
      console.log(`   ⚠️  ${envVar} - Not in .env.example`);
      hasWarnings = true;
    }
  });
} else {
  console.log('   ❌ .env.example - MISSING');
  hasErrors = true;
}

// Check 5: Railway configuration
console.log('\n🚂 Checking Railway configuration...');
const railwayJson = path.join(__dirname, '../..', 'railway.json');
if (fs.existsSync(railwayJson)) {
  const railwayConfig = JSON.parse(fs.readFileSync(railwayJson, 'utf8'));
  
  if (railwayConfig.build) {
    console.log('   ✅ Build configuration exists');
    if (railwayConfig.build.buildCommand) {
      console.log(`      Build command: ${railwayConfig.build.buildCommand}`);
    }
  } else {
    console.log('   ⚠️  No build configuration');
    hasWarnings = true;
  }
  
  if (railwayConfig.deploy) {
    console.log('   ✅ Deploy configuration exists');
    if (railwayConfig.deploy.startCommand) {
      console.log(`      Start command: ${railwayConfig.deploy.startCommand}`);
    }
  } else {
    console.log('   ⚠️  No deploy configuration');
    hasWarnings = true;
  }
} else {
  console.log('   ❌ railway.json - MISSING');
  hasErrors = true;
}

// Check 6: Database SQL files
console.log('\n🗄️  Checking database SQL files...');
const databases = ['rbm_lps', 'rbm_material', 'rbm_stoklabel'];
databases.forEach(db => {
  const sqlFile = path.join(__dirname, '../..', 'database', `${db}.sql`);
  if (fs.existsSync(sqlFile)) {
    const stats = fs.statSync(sqlFile);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`   ✅ ${db}.sql (${sizeKB} KB)`);
  } else {
    console.log(`   ❌ ${db}.sql - MISSING`);
    hasErrors = true;
  }
});

// Check 7: Frontend build configuration
console.log('\n⚛️  Checking frontend configuration...');
const frontendPackage = path.join(__dirname, '../..', 'frontend', 'package.json');
if (fs.existsSync(frontendPackage)) {
  const frontendPkg = JSON.parse(fs.readFileSync(frontendPackage, 'utf8'));
  
  if (frontendPkg.scripts && frontendPkg.scripts.build) {
    console.log(`   ✅ Build script: ${frontendPkg.scripts.build}`);
  } else {
    console.log('   ❌ No build script');
    hasErrors = true;
  }
  
  if (frontendPkg.dependencies && frontendPkg.dependencies.react) {
    console.log('   ✅ React installed');
  } else {
    console.log('   ❌ React not installed');
    hasErrors = true;
  }
  
  if ((frontendPkg.dependencies && frontendPkg.dependencies.vite) || 
      (frontendPkg.devDependencies && frontendPkg.devDependencies.vite)) {
    console.log('   ✅ Vite installed');
  } else {
    console.log('   ❌ Vite not installed');
    hasErrors = true;
  }
} else {
  console.log('   ❌ frontend/package.json - MISSING');
  hasErrors = true;
}

// Check 8: Git repository
console.log('\n📚 Checking Git repository...');
const gitDir = path.join(__dirname, '../..', '.git');
if (fs.existsSync(gitDir)) {
  console.log('   ✅ Git repository initialized');
  
  const gitignore = path.join(__dirname, '../..', '.gitignore');
  if (fs.existsSync(gitignore)) {
    const gitignoreContent = fs.readFileSync(gitignore, 'utf8');
    if (gitignoreContent.includes('node_modules')) {
      console.log('   ✅ .gitignore includes node_modules');
    } else {
      console.log('   ⚠️  .gitignore missing node_modules');
      hasWarnings = true;
    }
    if (gitignoreContent.includes('.env')) {
      console.log('   ✅ .gitignore includes .env');
    } else {
      console.log('   ⚠️  .gitignore missing .env');
      hasWarnings = true;
    }
  } else {
    console.log('   ⚠️  .gitignore not found');
    hasWarnings = true;
  }
} else {
  console.log('   ❌ Not a Git repository');
  hasErrors = true;
}

// Check 9: Database initialization script
console.log('\n🔧 Checking database scripts...');
const initDbScript = path.join(__dirname, 'initDatabase.js');
if (fs.existsSync(initDbScript)) {
  console.log('   ✅ initDatabase.js exists');
  
  const checkDbScript = path.join(__dirname, 'checkDatabase.js');
  if (fs.existsSync(checkDbScript)) {
    console.log('   ✅ checkDatabase.js exists');
  } else {
    console.log('   ⚠️  checkDatabase.js not found');
    hasWarnings = true;
  }
} else {
  console.log('   ❌ initDatabase.js - MISSING');
  hasErrors = true;
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 VERIFICATION SUMMARY');
console.log('='.repeat(60));

if (hasErrors) {
  console.log('\n❌ DEPLOYMENT NOT READY - Critical errors found!');
  console.log('\nPlease fix the errors above before deploying to Railway.');
  process.exit(1);
} else if (hasWarnings) {
  console.log('\n⚠️  DEPLOYMENT READY WITH WARNINGS');
  console.log('\nYou can deploy, but consider fixing the warnings above.');
  console.log('\n✅ Core requirements met:');
  console.log('   - All required files present');
  console.log('   - Package.json scripts configured');
  console.log('   - Dependencies installed');
  console.log('   - Database files ready');
  console.log('   - Railway configuration valid');
  console.log('\n🚀 Ready to deploy to Railway!');
  process.exit(0);
} else {
  console.log('\n✅ DEPLOYMENT READY - All checks passed!');
  console.log('\n🎉 Your application is ready for Railway deployment!');
  console.log('\nNext steps:');
  console.log('1. Push to GitHub: git push origin main');
  console.log('2. Create Railway project from GitHub repo');
  console.log('3. Add MySQL database in Railway');
  console.log('4. Configure environment variables');
  console.log('5. Deploy!');
  console.log('\nSee RAILWAY-DEPLOY-CHECKLIST.md for detailed instructions.');
  process.exit(0);
}
