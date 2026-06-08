const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Seed categories
    const categories = [
      { name: 'Electronics', slug: 'electronics' },
      { name: 'Fashion', slug: 'fashion' },
      { name: 'Home & Kitchen', slug: 'home-kitchen' },
      { name: 'Sports', slug: 'sports' },
      { name: 'Books', slug: 'books' },
      { name: 'Beauty & Health', slug: 'beauty-health' },
      { name: 'Toys & Games', slug: 'toys-games' },
      { name: 'Automotive', slug: 'automotive' },
    ];

    for (const cat of categories) {
      await Category.findOneAndUpdate(
        { slug: cat.slug },
        cat,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${categories.length} categories seeded`);

    // Seed admin user (if not exists)
    const adminEmail = 'admin@shopnest.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await User.create({
        name: 'ShopNest Admin',
        email: adminEmail,
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Admin user created (admin@shopnest.com / admin123)');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Seed a sample seller (if not exists)
    const sellerEmail = 'seller@shopnest.com';
    const existingSeller = await User.findOne({ email: sellerEmail });

    if (!existingSeller) {
      await User.create({
        name: 'Demo Seller',
        email: sellerEmail,
        password: 'seller123',
        role: 'seller',
      });
      console.log('✅ Demo seller created (seller@shopnest.com / seller123)');
    } else {
      console.log('ℹ️  Demo seller already exists');
    }

    // Seed a sample customer (if not exists)
    const customerEmail = 'customer@shopnest.com';
    const existingCustomer = await User.findOne({ email: customerEmail });

    if (!existingCustomer) {
      await User.create({
        name: 'Demo Customer',
        email: customerEmail,
        password: 'customer123',
        role: 'customer',
      });
      console.log('✅ Demo customer created (customer@shopnest.com / customer123)');
    } else {
      console.log('ℹ️  Demo customer already exists');
    }

    console.log('\n🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
};

seedData();
