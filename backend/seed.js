const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB Atlas');
    
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin already exists');
      console.log('Email: admin@example.com');
      console.log('Password: admin123');
      return;
    }

    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    if (error.message.includes('IP')) {
      console.log('\nPlease whitelist your IP in MongoDB Atlas:');
      console.log('1. Go to MongoDB Atlas Dashboard');
      console.log('2. Network Access → Add IP Address');
      console.log('3. Add 0.0.0.0/0 for testing');
    }
  } finally {
    mongoose.connection.close();
  }
};

seedAdmin();