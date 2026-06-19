const User = require('../models/User');
const Product = require('../models/Product');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  const products = [
    // ===== ELECTRONICS (10 products) =====
    {
      title: 'Premium Wireless Headphones',
      description: 'High-fidelity active noise-cancelling over-ear headphones with 40-hour battery life and fast charging.',
      price: 199.99,
      discount: 15,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      category: 'Electronics',
      gender: 'Unisex',
      stock: 25,
      rating: 4.6
    },
    {
      title: 'Ergonomic Wireless Mouse',
      description: 'Multi-device connectivity, hyper-fast scrolling, and precision tracking on any surface.',
      price: 59.99,
      discount: 20,
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
      category: 'Electronics',
      gender: 'Unisex',
      stock: 50,
      rating: 4.4
    },
    {
      title: 'Portable Bluetooth Speaker',
      description: 'IPX7 waterproof, deep bass, and 360-degree stereo sound with 24 hours of playtime.',
      price: 79.99,
      discount: 12,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
      category: 'Electronics',
      gender: 'Unisex',
      stock: 35,
      rating: 4.5
    },
    {
      title: '4K Ultra HD Action Camera',
      description: 'Wide-angle lens, electronic image stabilization, and waterproof housing up to 100 feet.',
      price: 129.99,
      discount: 18,
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80',
      category: 'Electronics',
      gender: 'Unisex',
      stock: 15,
      rating: 4.2
    },
    {
      title: 'Gigabit Dual-Band WiFi Router',
      description: 'High-speed internet router with 4 external antennas, guest network setup, and parental controls.',
      price: 49.99,
      discount: 8,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
      category: 'Electronics',
      gender: 'Unisex',
      stock: 20,
      rating: 4.1
    },
    {
      title: '27-inch 144Hz Monitor',
      description: 'IPS display panel with 1ms response time, AMD FreeSync, and ultra-thin bezels.',
      price: 249.99,
      discount: 20,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
      category: 'Electronics',
      gender: 'Unisex',
      stock: 12,
      rating: 4.7
    },
    {
      title: 'HD Smart Home Projector',
      description: 'Portable cinematic video projector with built-in speakers, HDMI/USB, and WiFi screen mirroring.',
      price: 179.99,
      discount: 22,
      image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&auto=format&fit=crop&q=80',
      category: 'Electronics',
      gender: 'Unisex',
      stock: 18,
      rating: 4.4
    },

    // ===== FASHION (10 products) =====
    {
      title: 'Casual Cotton Crewneck T-Shirt',
      description: '100% breathable organic cotton, tagless neckline, premium everyday fit.',
      price: 24.99,
      discount: 10,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
      category: 'Fashion',
      gender: 'Men',
      stock: 100,
      rating: 4.4
    },
    {
      title: 'High-Rise Stretch Skinny Jeans',
      description: 'Comfortable denim with dynamic stretch, tailored skinny fit, and classic 5-pocket styling.',
      price: 49.99,
      discount: 15,
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
      category: 'Fashion',
      gender: 'Women',
      stock: 80,
      rating: 4.5
    },
    {
      title: 'Classic Denim Trucker Jacket',
      description: 'Timeless vintage denim wash, button-up front, and chest pockets.',
      price: 69.99,
      discount: 25,
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
      category: 'Fashion',
      gender: 'Men',
      stock: 45,
      rating: 4.3
    },
    {
      title: 'Lightweight Breathable Sneakers',
      description: 'Mesh upper, cushioned foam sole, perfect for running, walking, or training.',
      price: 59.99,
      discount: 30,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      category: 'Fashion',
      gender: 'Unisex',
      stock: 65,
      rating: 4.7
    },
    {
      title: 'Minimalist Leather Strap Watch',
      description: 'Stainless steel casing, genuine brown leather strap, minimalist dials, and waterproof.',
      price: 119.99,
      discount: 18,
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop&q=80',
      category: 'Fashion',
      gender: 'Unisex',
      stock: 25,
      rating: 4.5
    },
    {
      title: 'Polarized Aviator Sunglasses',
      description: 'UV400 protection, lightweight metal frame, classic aviator styling for active wear.',
      price: 29.99,
      discount: 10,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
      category: 'Fashion',
      gender: 'Unisex',
      stock: 50,
      rating: 4.2
    },
    {
      title: 'Flowy Summer Floral Dress',
      description: 'A-line floral midi dress with tie-up straps, lightweight and comfortable for hot weather.',
      price: 34.99,
      discount: 12,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80',
      category: 'Fashion',
      gender: 'Women',
      stock: 30,
      rating: 4.4
    },

    // ===== MOBILES (10 products) =====
    {
      title: 'ShopEZ Pro Smartphone 14',
      description: '6.7-inch OLED Super Retina display, 5G capabilities, triple-camera system, and 256GB storage.',
      price: 999.99,
      discount: 10,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
      category: 'Mobiles',
      gender: 'Unisex',
      stock: 15,
      rating: 4.8
    },
    {
      title: 'Lite Smart Smartphone X',
      description: 'Budget-friendly Android phone with 6.5-inch HD screen, dual camera, and long-lasting 5000mAh battery.',
      price: 199.99,
      discount: 15,
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
      category: 'Mobiles',
      gender: 'Unisex',
      stock: 30,
      rating: 4.2
    },
    {
      title: 'Magnetic Matte Phone Case',
      description: 'Shockproof TPU bumper cover with strong magnetic back for wireless accessories.',
      price: 19.99,
      discount: 20,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
      category: 'Mobiles',
      gender: 'Unisex',
      stock: 120,
      rating: 4.4
    },
    {
      title: 'Fast USB-C Charger (35W)',
      description: 'Dual-port USB-C and USB-A wall charger plug with power delivery technology.',
      price: 24.99,
      discount: 10,
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
      category: 'Mobiles',
      gender: 'Unisex',
      stock: 95,
      rating: 4.6
    },
    {
      title: 'Extendable Phone Tripod & Selfie Stick',
      description: 'Wireless bluetooth remote control, stable 3-leg base, and 360-degree rotation bracket.',
      price: 29.99,
      discount: 15,
      image: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=600&auto=format&fit=crop&q=80',
      category: 'Mobiles',
      gender: 'Unisex',
      stock: 45,
      rating: 4.4
    },
    

    // ===== GROCERIES (10 products) =====
    {
      title: 'Organic Fresh Red Apples',
      description: 'Crisp, sweet, and locally harvested red apples. Pack of 6 apples.',
      price: 4.99,
      discount: 0,
      image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=600&auto=format&fit=crop&q=80',
      category: 'Groceries',
      gender: 'Unisex',
      stock: 200,
      rating: 4.7
    },
    {
      title: 'Organic Whole Milk (1 Gallon)',
      description: 'Fresh organic pasteurized whole milk, rich in calcium and vitamin D.',
      price: 5.49,
      discount: 5,
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80',
      category: 'Groceries',
      gender: 'Unisex',
      stock: 50,
      rating: 4.8
    },
    {
      title: 'Crispy Honey Nut Cereal',
      description: 'Crunchy oat loops toasted with honey and real sliced almonds. 500g pack.',
      price: 4.29,
      discount: 10,
      image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&auto=format&fit=crop&q=80',
      category: 'Groceries',
      gender: 'Unisex',
      stock: 90,
      rating: 4.3
    },
    {
      title: 'Dark Roast Coffee Beans',
      description: '100% Arabica dark roast coffee beans with hints of cocoa and toasted nuts. 1kg pack.',
      price: 16.99,
      discount: 12,
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&auto=format&fit=crop&q=80',
      category: 'Groceries',
      gender: 'Unisex',
      stock: 40,
      rating: 4.7
    },
    {
      title: 'Premium Organic Green Tea',
      description: 'Pure green tea leaves harvested from high-elevation gardens. 50 bags pack.',
      price: 6.99,
      discount: 8,
      image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&auto=format&fit=crop&q=80',
      category: 'Groceries',
      gender: 'Unisex',
      stock: 75,
      rating: 4.5
    },
    {
      title: 'Belgian Dark Chocolate Bar',
      description: '72% cocoa dark chocolate bar with smooth texture and rich complex flavors.',
      price: 3.49,
      discount: 5,
      image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=600&auto=format&fit=crop&q=80',
      category: 'Groceries',
      gender: 'Unisex',
      stock: 110,
      rating: 4.6
    },
    {
      title: 'Creamy Peanut Butter',
      description: 'All-natural creamy peanut butter made with freshly roasted peanuts and sea salt.',
      price: 4.49,
      discount: 8,
      image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop&q=80',
      category: 'Groceries',
      gender: 'Unisex',
      stock: 65,
      rating: 4.5
    },

    // ===== SPORTS EQUIPMENT (10 products) =====
    
    {
      title: 'Official Size Basketball',
      description: 'Composite leather basketball with high-tack grip for indoor and outdoor courts.',
      price: 34.99,
      discount: 15,
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80',
      category: 'Sports Equipment',
      gender: 'Unisex',
      stock: 30,
      rating: 4.6
    },
    {
      title: 'Thick Non-Slip Yoga Mat',
      description: '6mm high-density eco-friendly TPE foam yoga mat with alignment lines and carrying strap.',
      price: 24.99,
      discount: 20,
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop&q=80',
      category: 'Sports Equipment',
      gender: 'Unisex',
      stock: 60,
      rating: 4.5
    },
    {
      title: 'Performance Men’s Running Shoes',
      description: 'Comfortable road running shoes with responsive cushioning and carbon rubber outsole.',
      price: 79.99,
      discount: 55,
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&auto=format&fit=crop&q=80',
      category: 'Sports Equipment',
      gender: 'Men',
      stock: 40,
      rating: 4.5
    },
    {
      title: 'Aero Bicycle Helmet',
      description: 'Impact-resistant polycarbonate shell with EPS foam padding, dial adjustment fit system.',
      price: 49.99,
      discount: 18,
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80',
      category: 'Sports Equipment',
      gender: 'Unisex',
      stock: 25,
      rating: 4.6
    },
    {
      title: 'Weighted Speed Skipping Rope',
      description: 'Steel wire jump rope with ball bearing handles and removable weights for cardio cardio workouts.',
      price: 12.99,
      discount: 5,
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      category: 'Sports Equipment',
      gender: 'Unisex',
      stock: 85,
      rating: 4.4
    }
  ];

  try {
    if (global.useMockDb) {
      // Seed Mock DB in-memory
      console.log('Seeding In-Memory Mock Database...');
      
      // Admin
      const adminEmail = 'admin@shopez.com';
      const adminExists = global.mockUsers.some(u => u.email === adminEmail);
      if (!adminExists) {
        global.mockUsers.push({
          _id: 'mock_admin_1',
          username: 'ShopEZ Admin',
          email: adminEmail,
          password: 'admin123', // stored plain text for simplicity in mock comparison
          role: 'admin',
          createdAt: new Date()
        });
        console.log('Mock Admin user seeded.');
      }

      // Products
      if (global.mockProducts.length === 0) {
        global.mockProducts = products.map((p, idx) => ({
          ...p,
          _id: `mock_prod_${idx + 1}`,
          createdAt: new Date()
        }));
        console.log('50 Mock products seeded.');
      }
      return;
    }

    // Standard MongoDB Seeding
    const adminExists = await User.findOne({ email: 'admin@shopez.com' });
    if (!adminExists) {
      await User.create({
        username: 'ShopEZ Admin',
        email: 'admin@shopez.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Default Admin user seeded successfully.');
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(products);
      console.log('50 products seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

module.exports = seedData;
