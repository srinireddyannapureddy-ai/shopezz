const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // --- MOCK DB MODE ---
    if (global.useMockDb) {
      const totalUsers = global.mockUsers.filter(u => u.role === 'user').length;
      const totalProducts = global.mockProducts.length;
      const totalOrders = global.mockOrders.length;

      // Compute mock revenue
      let revenue = 0;
      for (const ord of global.mockOrders) {
        const prod = global.mockProducts.find(p => p._id === ord.productId);
        if (prod) {
          const discountedPrice = prod.price * (1 - (prod.discount || 0) / 100);
          revenue += discountedPrice * ord.quantity;
        }
      }

      return res.json({
        totalUsers,
        totalProducts,
        totalOrders,
        revenue: Math.round(revenue * 100) / 100
      });
    }

    // --- MONGO DB MODE ---
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({});

    // Calculate revenue by aggregating orders and resolving product prices/discounts
    const revenueData = await Order.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $project: {
          quantity: 1,
          discountedPrice: {
            $subtract: [
              '$product.price',
              { $multiply: ['$product.price', { $divide: ['$product.discount', 100] }] }
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $multiply: ['$discountedPrice', '$quantity'] }
          }
        }
      }
    ]);

    const revenue = revenueData.length > 0 ? Math.round(revenueData[0].totalRevenue) : 0;

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      revenue
    });
  } catch (error) {
    console.error('Error fetching admin dashboard statistics:', error);
    res.status(500).json({ message: 'Server error, failed to load dashboard statistics' });
  }
};

module.exports = {
  getDashboardStats
};
