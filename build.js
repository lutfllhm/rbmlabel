#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Starting build process...');
console.log('Environment:', process.env.NODE_ENV || 'development');

try {
  // Only clean in development, not in production (to avoid downtime)
  if (process.env.NODE_ENV !== 'production') {
    console.log('🧹 Cleaning old builds...');
    const publicDir = path.join(__dirname, 'server', 'public');
    const distDir = path.join(__dirname, 'frontend', 'dist');
    
    if (fs.existsSync(publicDir)) {
      fs.rmSync(publicDir, { recursive: true, force: true });
      console.log('✅ Cleaned server/public');
    }
    
    if (fs.existsSync(distDir)) {
      fs.rmSync(distDir, { recursive: true, force: true });
      console.log('✅ Cleaned frontend/dist');
    }
  } else {
    console.log('⚠️  Production mode: Skipping clean to avoid downtime');
  }

  // Install dependencies
  console.log('\n📦 Installing dependencies...');
  const installCmd = process.env.CI ? 'npm ci --legacy-peer-deps' : 'npm install';
  execSync(installCmd, { stdio: 'inherit' });
  execSync(`cd server && ${installCmd}`, { stdio: 'inherit' });
  execSync(`cd frontend && ${installCmd}`, { stdio: 'inherit' });

  // Prepare server
  console.log('\n🔧 Preparing server...');
  execSync('cd server && npm run prepare', { stdio: 'inherit' });

  // Build frontend
  console.log('\n🏗️  Building frontend...');
  execSync('cd frontend && npm run build', { stdio: 'inherit' });

  // Copy frontend build to server
  console.log('\n📁 Copying frontend build...');
  const publicDir = path.join(__dirname, 'server', 'public');
  const distDir = path.join(__dirname, 'frontend', 'dist');

  // Create public directory
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('✅ Created server/public directory');
  }

  // Copy files
  const copyRecursive = (src, dest) => {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      const files = fs.readdirSync(src);
      files.forEach(file => {
        copyRecursive(path.join(src, file), path.join(dest, file));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  };

  copyRecursive(distDir, publicDir);
  console.log('✅ Frontend build copied to server/public');
  
  // Copy database folder to server for Railway deployment
  console.log('\n📁 Copying database folder...');
  const dbSourceDir = path.join(__dirname, 'database');
  const dbDestDir = path.join(__dirname, 'server', 'database');
  
  if (fs.existsSync(dbSourceDir)) {
    if (!fs.existsSync(dbDestDir)) {
      fs.mkdirSync(dbDestDir, { recursive: true });
    }
    copyRecursive(dbSourceDir, dbDestDir);
    console.log('✅ Database folder copied to server/database');
    
    // Verify SQL file
    const sqlPath = path.join(dbDestDir, 'rbm_combined.sql');
    if (fs.existsSync(sqlPath)) {
      const sqlSize = fs.statSync(sqlPath).size;
      console.log(`✅ rbm_combined.sql verified (${sqlSize} bytes)`);
    }
  } else {
    console.log('⚠️  Database folder not found, skipping...');
  }
  
  // Verify critical files
  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    const indexSize = fs.statSync(indexPath).size;
    console.log(`✅ index.html verified (${indexSize} bytes)`);
  } else {
    throw new Error('❌ index.html not found in server/public!');
  }
  
  // List files in public directory
  console.log('\n📋 Files in server/public:');
  const publicFiles = fs.readdirSync(publicDir);
  publicFiles.forEach(file => {
    const filePath = path.join(publicDir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      console.log(`   📁 ${file}/`);
    } else {
      console.log(`   📄 ${file} (${stats.size} bytes)`);
    }
  });

  console.log('\n🎉 Build completed successfully!');

} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}