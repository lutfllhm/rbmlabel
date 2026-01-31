# Database Scripts

This directory contains scripts for database management and deployment.

## Scripts

### `initDatabase.js`
Initializes the database by creating the database and importing the schema from SQL file.

**Features:**
- Automatically finds SQL file from multiple possible paths
- Creates database if it doesn't exist
- Skips import if tables already exist
- Supports both local development and production deployment

**Usage:**
```bash
npm run init-db
```

### `prepareBuild.js`
Copies the SQL file from the root database directory to the server directory during build process.

**Purpose:**
- Ensures SQL file is accessible during deployment
- Handles different deployment environments (Railway, Render, etc.)
- Runs automatically during build process

**Usage:**
```bash
npm run prepare
```

### `checkDatabase.js`
Verifies database connection and checks database status.

**Usage:**
```bash
npm run check-db
```

### `verifyDeployment.js`
Verifies that the deployment is working correctly.

**Usage:**
```bash
npm run verify-deploy
```

## Environment Variables

The following environment variables are used by the database scripts:

- `DB_HOST` - Database host
- `DB_PORT` - Database port (default: 3306)
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name (default: rbm_combined)
- `SQL_FILE_PATH` - Custom path to SQL file (optional)

## SQL File Path Resolution

The `initDatabase.js` script looks for the SQL file in the following locations (in order):

1. `SQL_FILE_PATH` environment variable
2. `server/database/rbm_combined.sql` (copied during build)
3. `../database/rbm_combined.sql` (relative to script)
4. Various deployment-specific paths

## Deployment

During deployment, the build process:

1. Runs `npm run prepare` to copy SQL file to server directory
2. Builds the frontend
3. Starts the server
4. Server automatically initializes database on first run

## Troubleshooting

If database initialization fails:

1. Check database connection settings in `.env`
2. Verify SQL file exists: `ls -la database/rbm_combined.sql`
3. Run preparation script manually: `npm run prepare`
4. Check database logs for connection issues
5. Verify database server is running and accessible