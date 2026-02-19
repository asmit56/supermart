import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';
import Product from '@/lib/models/Product';
import bcryptjs from 'bcryptjs';

export async function GET(request) {
  try {
    console.log('Initializing demo data...');
    await connectToDatabase();
    console.log('Connected to database');

    // Check if demo data already exists
    const existingUser = await User.findOne({ email: 'seller@demo.com' });
    if (existingUser) {
      return Response.json(
        { message: 'Demo data already initialized' },
        { status: 200 }
      );
    }

    // Create demo seller
    const sellerPassword = await bcryptjs.hash('demo123', 10);
    const seller = new User({
      name: 'Demo Seller',
      email: 'seller@demo.com',
      password: sellerPassword,
      role: 'seller',
      storeName: 'Demo Store',
      storeDescription: 'Welcome to our demo store. We offer quality products.',
      phone: '9876543210',
      address: 'Demo Street, Demo City',
      city: 'Demo City',
      zipCode: '123456',
    });
    await seller.save();
    console.log('Seller created');

    // Create demo buyer
    const buyerPassword = await bcryptjs.hash('demo123', 10);
    const buyer = new User({
      name: 'Demo Buyer',
      email: 'buyer@demo.com',
      password: buyerPassword,
      role: 'buyer',
      phone: '9876543211',
      address: 'Buyer Street, Buyer City',
      city: 'Buyer City',
      zipCode: '654321',
    });
    await buyer.save();
    console.log('Buyer created');

    // Create demo products
    const demoProducts = [
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation and 20-hour battery life.',
        price: 2499,
        originalPrice: 4999,
        category: 'Electronics',
        image: 'headphones.jpg',
        stock: 50,
        sellerId: seller._id,
      },
      {
        name: 'USB-C Cable',
        description: 'Fast charging USB-C cable compatible with all devices.',
        price: 399,
        originalPrice: 799,
        category: 'Electronics',
        image: 'cable.jpg',
        stock: 200,
        sellerId: seller._id,
      },
      {
        name: 'Phone Case',
        description: 'Durable and stylish phone case with excellent protection.',
        price: 599,
        originalPrice: 1199,
        category: 'Electronics',
        image: 'case.jpg',
        stock: 100,
        sellerId: seller._id,
      },
      {
        name: 'Organic Tea Set',
        description: 'Premium organic green tea and black tea collection.',
        price: 1299,
        originalPrice: 2499,
        category: 'Food & Groceries',
        image: 'tea.jpg',
        stock: 75,
        sellerId: seller._id,
      },
      {
        name: 'Coffee Maker',
        description: 'Automatic coffee maker with brew strength control.',
        price: 3499,
        originalPrice: 6999,
        category: 'Home & Garden',
        image: 'coffee.jpg',
        stock: 30,
        sellerId: seller._id,
      },
      {
        name: 'Notebook Set',
        description: 'Set of 3 premium notebooks for writing and sketching.',
        price: 499,
        originalPrice: 999,
        category: 'Books',
        image: 'notebook.jpg',
        stock: 150,
        sellerId: seller._id,
      },
      {
        name: 'T-Shirt',
        description: 'Comfortable cotton t-shirt in multiple colors.',
        price: 599,
        originalPrice: 1299,
        category: 'Clothing',
        image: 'tshirt.jpg',
        stock: 200,
        sellerId: seller._id,
      },
      {
        name: 'Running Shoes',
        description: 'Professional running shoes with air cushioning technology.',
        price: 4999,
        originalPrice: 9999,
        category: 'Clothing',
        image: 'shoes.jpg',
        stock: 40,
        sellerId: seller._id,
      },
    ];

    await Product.insertMany(demoProducts);
    console.log('Products created');

    return Response.json(
      {
        message: 'Demo data initialized successfully',
        seller: {
          email: seller.email,
          password: 'demo123',
        },
        buyer: {
          email: buyer.email,
          password: 'demo123',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error initializing demo data:', error);
    return Response.json(
      { error: 'Failed to initialize demo data', details: error.message },
      { status: 500 }
    );
  }
}
