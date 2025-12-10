require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Donation = require('./models/Donation');
const Request = require('./models/Request');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample data
const users = [
  {
    fullName: 'Admin User',
    username: 'admin',
    email: 'admin@greenbites.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1234567890',
    isActive: true,
    isVerified: true
  },
  {
    fullName: 'John Donor',
    username: 'donor1',
    email: 'donor1@example.com',
    password: 'donor123',
    role: 'donor',
    phone: '+1234567891',
    organization: {
      name: 'Fresh Foods Restaurant',
      type: 'Restaurant'
    },
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    },
    isActive: true
  },
  {
    fullName: 'Sarah Donor',
    username: 'donor2',
    email: 'donor2@example.com',
    password: 'donor123',
    role: 'donor',
    phone: '+1234567892',
    organization: {
      name: 'Green Grocery Store',
      type: 'Grocery'
    },
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001'
    },
    isActive: true
  },
  {
    fullName: 'Mike Recipient',
    username: 'recipient1',
    email: 'recipient1@example.com',
    password: 'recipient123',
    role: 'recipient',
    phone: '+1234567893',
    organization: {
      name: 'City Food Bank',
      type: 'Food Bank'
    },
    address: {
      street: '789 Elm St',
      city: 'New York',
      state: 'NY',
      zipCode: '10002'
    },
    isActive: true
  },
  {
    fullName: 'Lisa Recipient',
    username: 'recipient2',
    email: 'recipient2@example.com',
    password: 'recipient123',
    role: 'recipient',
    phone: '+1234567894',
    organization: {
      name: 'Community Kitchen',
      type: 'Charity'
    },
    address: {
      street: '321 Pine Rd',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90002'
    },
    isActive: true
  },
  {
    fullName: 'Data Analyst',
    username: 'analyst1',
    email: 'analyst1@example.com',
    password: 'analyst123',
    role: 'analyst',
    phone: '+1234567895',
    isActive: true
  }
];

const getDonations = (donorIds) => [
  {
    donor: donorIds[0],
    foodType: 'Fresh Vegetables Mix',
    category: 'Vegetables',
    quantity: {
      amount: 50,
      unit: 'kg'
    },
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    pickupLocation: {
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      coordinates: {
        lat: 40.7128,
        lng: -74.0060
      }
    },
    pickupTime: {
      from: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      to: new Date(Date.now() + 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000) // Tomorrow + 8 hours
    },
    status: 'available',
    description: 'Fresh organic vegetables from our restaurant kitchen'
  },
  {
    donor: donorIds[0],
    foodType: 'Prepared Meals',
    category: 'Prepared Food',
    quantity: {
      amount: 100,
      unit: 'servings'
    },
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    pickupLocation: {
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      coordinates: {
        lat: 40.7128,
        lng: -74.0060
      }
    },
    pickupTime: {
      from: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
      to: new Date(Date.now() + 20 * 60 * 60 * 1000) // 20 hours from now
    },
    status: 'available',
    description: 'Healthy prepared meals, ready to serve'
  },
  {
    donor: donorIds[1],
    foodType: 'Fresh Fruits',
    category: 'Fruits',
    quantity: {
      amount: 75,
      unit: 'kg'
    },
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    pickupLocation: {
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      coordinates: {
        lat: 34.0522,
        lng: -118.2437
      }
    },
    pickupTime: {
      from: new Date(Date.now() + 24 * 60 * 60 * 1000),
      to: new Date(Date.now() + 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000)
    },
    status: 'available',
    description: 'Assorted fresh fruits - apples, oranges, bananas'
  },
  {
    donor: donorIds[1],
    foodType: 'Bread and Bakery Items',
    category: 'Baked Goods',
    quantity: {
      amount: 50,
      unit: 'items'
    },
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    pickupLocation: {
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      coordinates: {
        lat: 34.0522,
        lng: -118.2437
      }
    },
    pickupTime: {
      from: new Date(Date.now() + 18 * 60 * 60 * 1000),
      to: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    status: 'available',
    description: 'Fresh bread, pastries, and baked goods from today'
  },
  {
    donor: donorIds[0],
    foodType: 'Dairy Products',
    category: 'Dairy',
    quantity: {
      amount: 30,
      unit: 'kg'
    },
    expiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (completed)
    pickupLocation: {
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    },
    pickupTime: {
      from: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      to: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000)
    },
    status: 'completed',
    description: 'Milk, cheese, and yogurt products',
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    rating: 5,
    feedback: 'Great donation! Helped our community a lot.'
  }
];

// Seed the database
const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Donation.deleteMany({});
    await Request.deleteMany({});

    console.log('Creating users...');
    // Use .create() instead of insertMany() to trigger pre-save hooks for password hashing
    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);

    // Get donor IDs
    const donorIds = createdUsers
      .filter(u => u.role === 'donor')
      .map(u => u._id);

    console.log('Creating donations...');
    const donations = getDonations(donorIds);
    const createdDonations = await Donation.insertMany(donations);
    console.log(`Created ${createdDonations.length} donations`);

    console.log('\n=== Seed Data Summary ===');
    console.log('Users created:');
    createdUsers.forEach(user => {
      console.log(`  - ${user.role}: ${user.username}`);
    });
    console.log('\nLogin credentials:');
    console.log('  - admin: admin123');
    console.log('  - donor1: donor123');
    console.log('  - donor2: donor123');
    console.log('  - recipient1: recipient123');
    console.log('  - recipient2: recipient123');
    console.log('  - analyst1: analyst123');
    
    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
