const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shopez', {
      serverSelectionTimeoutMS: 3000 // Quick timeout (3s) to fallback to Mock DB immediately
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.useMockDb = false;
  } catch (error) {
    console.log('\n======================================================================');
    console.log(`WARNING: MongoDB connection failed (${error.message}).`);
    console.log('ShopEZ is falling back to IN-MEMORY MOCK DATABASE MODE.');
    console.log('All functions (Cart, Checkout, Admin Panels) will work, but data');
    console.log('will reset when the server restarts.');
    console.log('======================================================================\n');
    
    global.useMockDb = true;
    // Initialize empty mock collections
    global.mockUsers = [];
    global.mockProducts = [];
    global.mockCarts = [];
    global.mockOrders = [];
  }
};

module.exports = connectDB;
