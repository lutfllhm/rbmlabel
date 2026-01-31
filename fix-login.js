#!/usr/bin/env node

/**
 * Quick Fix Login - Railway
 * Run this script to reset admin password
 * 
 * Usage:
 *   node fix-login.js
 *   railway run node fix-login.js
 */

const path = require('path');

// Check if we're in the root or server directory
const isInRoot = require('fs').existsSync('./server');
const scriptPath = isInRoot 
  ? './server/scripts/resetAdminPassword.js'
  : './scripts/resetAdminPassword.js';

console.log('🔧 Quick Fix Login - RBM System');
console.log('================================\n');

try {
  const resetScript = require(scriptPath);
  
  resetScript()
    .then(() => {
      console.log('\n✅ Login fixed successfully!');
      console.log('\n📋 You can now login with:');
      console.log('   Username: admin');
      console.log('   Password: iware123');
      console.log('   Apps: material, stoklabel, lps');
      console.log('\n🌐 Go to: https://labelrbm.up.railway.app/login');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Failed to fix login:', error.message);
      console.error('\n💡 Try these alternatives:');
      console.error('   1. Open: https://labelrbm.up.railway.app/reset-admin.html');
      console.error('   2. Set ENABLE_DEBUG=true in Railway Variables');
      console.error('   3. Check RAILWAY_FIX_LOGIN.md for more options');
      process.exit(1);
    });
} catch (error) {
  console.error('❌ Error loading script:', error.message);
  console.error('\n💡 Make sure you run this from the project root or server directory');
  process.exit(1);
}
