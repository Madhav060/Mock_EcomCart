const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const products = [
  {
    name: 'Wireless Headphones',
    description: 'Premium noise-canceling wireless headphones with 30-hour battery life',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics',
    stock: 50
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracking smartwatch with heart rate monitor and GPS',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'Electronics',
    stock: 75
  },
  {
    name: 'Laptop Backpack',
    description: 'Water-resistant backpack with padded laptop compartment',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    category: 'Accessories',
    stock: 100
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical gaming keyboard with tactile switches',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    category: 'Electronics',
    stock: 60
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with adjustable DPI settings',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    category: 'Electronics',
    stock: 120
  },
  {
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
    category: 'Accessories',
    stock: 80
  },
  {
    name: 'Portable Charger',
    description: '20000mAh power bank with fast charging and dual USB ports',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
    category: 'Accessories',
    stock: 150
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Waterproof portable speaker with 360-degree sound',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    category: 'Electronics',
    stock: 90
  },
  {
    name: 'Phone Stand',
    description: 'Adjustable aluminum phone stand for desk',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500',
    category: 'Accessories',
    stock: 200
  },
  {
    name: 'Webcam HD',
    description: '1080p HD webcam with built-in microphone',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500',
    category: 'Electronics',
    stock: 45
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});
    console.log('✅ Existing products deleted');

    // Insert new products
    await Product.insertMany(products);
    console.log('✅ Products seeded successfully');
    console.log(`📦 ${products.length} products added to database`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();