const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Database configuration
const config = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
  connectTimeout: 60000, // 60 seconds
  acquireTimeout: 60000,
  timeout: 60000
};

// Try multiple possible paths for SQL file
const possiblePaths = [
  process.env.SQL_FILE_PATH,
  path.join(__dirname, '../database/rbm_combined.sql'), // server/database (copied during build)
  path.join(__dirname, '../../database/rbm_combined.sql'), // relative to script
  path.resolve(__dirname, '../../database/rbm_combined.sql'), // absolute resolve
  path.join(process.cwd(), 'database/rbm_combined.sql'), // from root or server
  path.join(process.cwd(), '../database/rbm_combined.sql'), // from server dir
  '/app/database/rbm_combined.sql', // absolute Railway path
  '/app/server/database/rbm_combined.sql', // Railway server path
  '/opt/render/project/src/database/rbm_combined.sql', // Render path
  path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH || '/app', 'database/rbm_combined.sql') // Railway volume
].filter(Boolean);

const database = {
  name: process.env.DB_NAME || 'rbm_combined',
  sqlFile: null // Will be determined in initDatabase
};

async function initDatabase() {
  let connection;
  
  try {
    console.log('🔄 Connecting to MySQL...');
    console.log('   Host:', config.host);
    console.log('   Port:', config.port);
    console.log('   User:', config.user);
    
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL');

    console.log(`\n📦 Processing database: ${database.name}`);
    
    // Find SQL file from possible paths
    console.log('🔍 Searching for SQL file...');
    console.log('Current directory:', process.cwd());
    console.log('Script directory:', __dirname);
    console.log('Process argv[0]:', process.argv[0]);
    console.log('__filename:', __filename);
    
    // List all possible paths we'll try
    console.log('Paths to try:');
    possiblePaths.forEach((p, i) => console.log(`  ${i + 1}. ${p}`));
    
    for (const sqlPath of possiblePaths) {
      try {
        await fs.access(sqlPath);
        database.sqlFile = sqlPath;
        console.log(`✅ SQL file found at: ${sqlPath}`);
        break;
      } catch (err) {
        console.log(`❌ Not found: ${sqlPath}`);
      }
    }
    
    // If still not found, try to list directory contents for debugging
    if (!database.sqlFile) {
      console.log('\n🔍 Debug: Listing directory contents...');
      try {
        const rootFiles = await fs.readdir(process.cwd());
        console.log('Root directory files:', rootFiles);
        
        if (rootFiles.includes('database')) {
          const dbFiles = await fs.readdir(path.join(process.cwd(), 'database'));
          console.log('Database directory files:', dbFiles);
        }
      } catch (debugErr) {
        console.log('Debug listing failed:', debugErr.message);
      }
      
      throw new Error('SQL file not found in any expected location');
    }
    
    // Create database if not exists
    console.log(`🔄 Creating database '${database.name}' if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database.name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database '${database.name}' ready`);
    
    // Check if database has tables
    await connection.query(`USE \`${database.name}\``);
    const [tables] = await connection.query('SHOW TABLES');
    
    const shouldForceInit = process.env.FORCE_DB_INIT === 'true';
    
    if (tables.length > 0 && !shouldForceInit) {
      console.log(`ℹ️  Database '${database.name}' already has ${tables.length} tables:`);
      tables.forEach(table => console.log(`   - ${Object.values(table)[0]}`));
      console.log('✅ Database initialization complete (tables already exist)');
      return;
    }
    
    if (tables.length > 0 && shouldForceInit) {
      console.log(`⚠️  FORCE_DB_INIT=true: Re-initializing database with ${tables.length} existing tables`);
      
      // Drop all existing tables
      console.log(`🗑️  Dropping existing tables...`);
      for (const table of tables) {
        const tableName = Object.values(table)[0];
        await connection.query(`DROP TABLE IF EXISTS \`${tableName}\``);
        console.log(`   - Dropped: ${tableName}`);
      }
    }
    
    // Read SQL file
    console.log(`📄 Reading SQL file: ${path.basename(database.sqlFile)}`);
    let sqlContent = await fs.readFile(database.sqlFile, 'utf8');
    console.log(`📄 SQL file size: ${sqlContent.length} characters`);
    
    // Clean SQL content - remove CREATE DATABASE and USE statements
    console.log(`🧹 Cleaning SQL content...`);
    sqlContent = sqlContent
      .replace(/CREATE DATABASE IF NOT EXISTS.*?;/gi, '')
      .replace(/USE\s+`?rbm_combined`?;?/gi, '')
      .replace(/USE\s+rbm_combined;?/gi, '')
      .trim();
    
    console.log(`📄 Cleaned SQL size: ${sqlContent.length} characters`);
    
    // Execute SQL
    console.log(`⚙️  Importing schema and data...`);
    try {
      await connection.query(sqlContent);
      console.log(`✅ SQL executed successfully`);
    } catch (sqlError) {
      console.error(`❌ SQL execution error:`, sqlError.message);
      
      // Try to execute statement by statement if bulk execution fails
      console.log(`🔄 Attempting statement-by-statement execution...`);
      const statements = sqlContent
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement.length < 10) continue; // Skip very short statements
        
        try {
          await connection.query(statement);
          successCount++;
          if (i % 10 === 0) {
            console.log(`   Progress: ${i}/${statements.length} statements`);
          }
        } catch (stmtError) {
          errorCount++;
          console.error(`   ⚠️  Statement ${i} failed:`, stmtError.message.substring(0, 100));
        }
      }
      
      console.log(`📊 Execution summary: ${successCount} success, ${errorCount} errors`);
      
      if (successCount === 0) {
        throw new Error('All SQL statements failed to execute');
      }
    }
    
    // Verify tables created
    const [newTables] = await connection.query('SHOW TABLES');
    console.log(`✅ Successfully imported ${newTables.length} tables to '${database.name}':`);
    newTables.forEach(table => console.log(`   - ${Object.values(table)[0]}`));
    
    console.log('\n🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error('Stack:', error.stack);
    
    // Additional debugging for Railway
    if (process.env.NODE_ENV === 'production') {
      console.log('\n🔍 Railway Debug Information:');
      console.log('Environment variables:');
      Object.keys(process.env)
        .filter(key => key.startsWith('DB_') || key.startsWith('RAILWAY_') || key.startsWith('SQL_'))
        .forEach(key => {
          const value = key.includes('PASSWORD') ? '***' : process.env[key];
          console.log(`   ${key}=${value}`);
        });
    }
    
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = initDatabase;
