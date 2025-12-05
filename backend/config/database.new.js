const { Sequelize } = require('sequelize');
const config = require('./config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Configure SSL for production
const isProduction = env === 'production';
const sslConfig = isProduction ? {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // For self-signed certificates
    }
  }
} : {};

// Initialize Sequelize with connection pooling and retry logic
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'postgres',
    logging: process.env.ENABLE_QUERY_LOGGING === 'true' ? console.log : false,
    benchmark: process.env.NODE_ENV === 'development',
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: false, // Enable soft deletes if needed
    },
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || '10'),
      min: parseInt(process.env.DB_POOL_MIN || '0'),
      acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000'),
      idle: parseInt(process.env.DB_POOL_IDLE || '10000'),
      evict: parseInt(process.env.DB_POOL_EVICT || '1000'),
    },
    retry: {
      max: 3, // Maximum retry attempts
      match: [
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/,
        /TimeoutError/,
        /Connection terminated unexpectedly/,
      ],
    },
    ...sslConfig,
  }
);

// Test the database connection with retries
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const testConnection = async (retryCount = 0) => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
    return true;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.warn(`⚠️  Connection attempt ${retryCount + 1} failed. Retrying in ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return testConnection(retryCount + 1);
    }
    console.error('❌ Unable to connect to the database after several attempts:', error);
    process.exit(1);
  }
};

// Add hooks for connection events
sequelize
  .authenticate()
  .then(() => {
    console.log('🔌 Database connection ready');
  })
  .catch(err => {
    console.error('⚠️  Database connection error:', err);
  });

// Handle process termination
const shutdown = async () => {
  try {
    await sequelize.close();
    console.log('👋 Database connection closed gracefully');    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = {
  sequelize,
  testConnection,
  Sequelize,
  shutdown,
};
