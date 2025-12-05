require('dotenv').config();
const { sequelize } = require('../config/database');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client if needed
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const initDatabase = async () => {
  try {
    console.log('🔍 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync all models
    console.log('🔄 Syncing database models...');
    await sequelize.sync({ force: process.env.NODE_ENV === 'test' });
    console.log('✅ Database synchronized successfully.');

    // Create default admin user if not exists
    await createDefaultAdmin();
    
    console.log('🚀 Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

const createDefaultAdmin = async () => {
  try {
    const User = require('../models/user');
    const bcrypt = require('bcryptjs');
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@civicconnect.org';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    
    // Check if admin already exists
    const adminExists = await User.findOne({ where: { email: adminEmail } });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
        isActive: true
      });
      
      console.log('👑 Default admin user created successfully!');
      console.log(`📧 Email: ${adminEmail}`);
      console.log('🔑 Password: Admin@123 (Change this immediately after first login)');
    } else {
      console.log('ℹ️  Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error);
  }
};

// Run the initialization
initDatabase();
