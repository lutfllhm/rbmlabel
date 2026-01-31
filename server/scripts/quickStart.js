#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 RBM Server Quick Start\n');
console.log('This script will check your setup and start the server\n');

const steps = [
  {
    name: 'Check MySQL Connection',
    command: 'node scripts/checkMySQL.js',
    required: true
  },
  {
    name: 'Check Users',
    command: 'node scripts/checkUsers.js',
    required: false
  }
];

let allPassed = true;

for (const step of steps) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📋 ${step.name}`);
  console.log('='.repeat(60));
  
  try {
    execSync(step.command, { stdio: 'inherit' });
    console.log(`✅ ${step.name} - PASSED`);
  } catch (error) {
    console.log(`❌ ${step.name} - FAILED`);
    if (step.required) {
      allPassed = false;
      console.log('\n💡 Please fix the above issue before starting the server');
      process.exit(1);
    }
  }
}

if (allPassed) {
  console.log('\n' + '='.repeat(60));
  console.log('✅ All checks passed!');
  console.log('='.repeat(60));
  console.log('\n🎉 Starting server...\n');
  
  try {
    execSync('npm run dev', { stdio: 'inherit' });
  } catch (error) {
    console.error('\n❌ Server failed to start');
    process.exit(1);
  }
}
