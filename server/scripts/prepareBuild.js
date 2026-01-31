#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

async function prepareBuild() {
  try {
    console.log('🔄 Preparing build...');
    
    // Source and destination paths
    const sourcePath = path.join(__dirname, '../../database/rbm_combined.sql');
    const destPath = path.join(__dirname, '../database/rbm_combined.sql');
    
    // Create destination directory if it doesn't exist
    const destDir = path.dirname(destPath);
    await fs.mkdir(destDir, { recursive: true });
    
    // Copy SQL file to server directory
    try {
      await fs.copyFile(sourcePath, destPath);
      console.log('✅ SQL file copied to server/database/');
      
      // Verify the copy
      const stats = await fs.stat(destPath);
      console.log(`✅ File size: ${stats.size} bytes`);
    } catch (copyError) {
      console.log('⚠️  SQL file copy failed, trying alternative paths...');
      
      // Try alternative source paths
      const altPaths = [
        path.join(process.cwd(), 'database/rbm_combined.sql'),
        path.join(__dirname, '../../database/rbm_combined.sql'),
        '/app/database/rbm_combined.sql'
      ];
      
      let copied = false;
      for (const altPath of altPaths) {
        try {
          await fs.copyFile(altPath, destPath);
          console.log(`✅ SQL file copied from: ${altPath}`);
          copied = true;
          break;
        } catch (err) {
          console.log(`❌ Failed to copy from: ${altPath}`);
        }
      }
      
      if (!copied) {
        console.log('⚠️  Could not copy SQL file, will try runtime detection');
      }
    }
    
    // Create public directory for frontend assets
    const publicDir = path.join(__dirname, '../public');
    await fs.mkdir(publicDir, { recursive: true });
    console.log('✅ Public directory created');
    
  } catch (error) {
    console.error('❌ Build preparation failed:', error.message);
    // Don't exit with error - this is optional
    console.log('⚠️  Continuing without full preparation...');
  }
}

// Run if called directly
if (require.main === module) {
  prepareBuild();
}

module.exports = prepareBuild;