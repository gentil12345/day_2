/**
 * Seed script - populates the database with initial services and a default admin user
 * Run with: node seed.js
 */
const mongoose = require('mongoose');
const Service = require('./models/Service');
const User = require('./models/User');
require('dotenv').config();

const services = [
  { ServiceCode: 'SRV001', ServiceName: 'Engine Repair', ServicePrice: 150000 },
  { ServiceCode: 'SRV002', ServiceName: 'Transmission Repair', ServicePrice: 80000 },
  { ServiceCode: 'SRV003', ServiceName: 'Oil Change', ServicePrice: 60000 },
  { ServiceCode: 'SRV004', ServiceName: 'Chain Replacement', ServicePrice: 40000 },
  { ServiceCode: 'SRV005', ServiceName: 'Disc Replacement', ServicePrice: 400000 },
  { ServiceCode: 'SRV006', ServiceName: 'Wheel Alignment', ServicePrice: 5000 },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB CRPMS database');

    // Seed services
    for (const svc of services) {
      const exists = await Service.findOne({ ServiceCode: svc.ServiceCode });
      if (!exists) {
        await Service.create(svc);
        console.log(`✓ Service added: ${svc.ServiceName} — ${svc.ServicePrice.toLocaleString()} RWF`);
      } else {
        console.log(`  Service already exists: ${svc.ServiceName}`);
      }
    }

    // Seed default admin user
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({ username: 'admin', password: 'Admin@2025!' });
      console.log('✓ Default admin user created: username=admin, password=Admin@2025!');
    } else {
      console.log('  Admin user already exists');
    }

    console.log('\nDatabase seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
};

seedDB();
