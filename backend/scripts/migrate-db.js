require('dotenv').config();
const { Sequelize } = require('sequelize');
const Umzug = require('umzug');
const path = require('path');
const { sequelize } = require('../config/database');

// Configure Umzug for migrations
const umzug = new Umzug({
  migrations: {
    path: path.join(__dirname, '../migrations'),
    params: [
      sequelize.getQueryInterface(),
      Sequelize
    ]
  },
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize,
    modelName: 'SequelizeMeta',
    tableName: 'sequelize_meta',
  },
  logging: console.log
});

const runMigrations = async () => {
  try {
    console.log('🚀 Starting database migrations...');
    
    // Check for pending migrations
    const pendingMigrations = await umzug.pending();
    console.log(`📋 Found ${pendingMigrations.length} pending migration(s)`);
    
    if (pendingMigrations.length === 0) {
      console.log('✅ Database is up to date');
      return;
    }
    
    // Run migrations
    console.log('🔄 Running migrations...');
    await umzug.up();
    
    console.log('✅ All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

runMigrations();
