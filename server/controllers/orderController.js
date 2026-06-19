const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to populate user and product details in mock orders
const populateMockOrders = (ordersList) => {
  return ordersList.map(ord => {
    const user = global.mockUsers.find(u => u._id === ord.userId);
    const product = global.mockProducts.find(p => p._id === ord.productId);
    return {
      ...ord,
      userId: user ? { _id: user._id, username: user.username, email: user.email } : null,
      productId: product || null
    };
  });
};

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
const placeOrder = async (req, res) => {
  const { address, paymentMethod } = req.body;

  try {
    if (!address || !paymentMethod) {
      return res.status(400).json({ message: 'Shipping address and payment method are required' });
    }

    const { fullName, mobile, address: addressText, city, state, pincode } = address;
    if (!fullName || !mobile || !addressText || !city || !state || !pincode) {
      return res.status(400).json({ message: 'All shipping address fields are required' });
    }

    // --- MOCK DB MODE ---
    if (global.useMockDb) {
      // Get mock cart items
      const userCarts = global.mockCarts.filter(c => c.userId === req.user._id);
      if (userCarts.length === 0) {
        return res.status(400).json({ message: 'Your cart is empty' });
      }

      // Verify stock
      for (const item of userCarts) {
        const prod = global.mockProducts.find(p => p._id === item.productId);
        if (!prod) {
          return res.status(404).json({ message: 'One or more products in your cart no longer exist' });
        }
        if (prod.stock < item.quantity) {
          return res.status(400).json({ 
            message: `Insufficient stock for product: ${prod.title}. Available: ${prod.stock}` 
          });
        }
      }

      const createdOrders = [];

      // Create orders & update stock
      for (const item of userCarts) {
        const prodIdx = global.mockProducts.findIndex(p => p._id === item.productId);
        const prod = global.mockProducts[prodIdx];

        // Decrement mock stock
        global.mockProducts[prodIdx].stock -= item.quantity;

        const newOrder = {
          _id: `mock_order_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          userId: req.user._id,
          productId: item.productId,
          quantity: item.quantity,
          address: {
            fullName,
            mobile,
            address: addressText,
            city,
            state,
            pincode
          },
          paymentMethod,
          status: 'Pending',
          orderDate: new Date()
        };

        global.mockOrders.push(newOrder);
        createdOrders.push(newOrder);
      }

      // Clear user's mock cart
      global.mockCarts = global.mockCarts.filter(c => c.userId !== req.user._id);

      return res.status(201).json({
        message: 'Order placed successfully',
        orders: createdOrders
      });
    }

    // --- MONGO DB MODE ---
    const cartItems = await Cart.find({ userId: req.user._id }).populate('productId');
    
    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    for (const item of cartItems) {
      if (!item.productId) {
        return res.status(404).json({ message: 'One or more products in your cart no longer exist' });
      }
      if (item.productId.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for product: ${item.productId.title}. Available: ${item.productId.stock}` 
        });
      }
    }

    const createdOrders = [];

    for (const item of cartItems) {
      const order = new Order({
        userId: req.user._id,
        productId: item.productId._id,
        quantity: item.quantity,
        address: {
          fullName,
          mobile,
          address: addressText,
          city,
          state,
          pincode
        },
        paymentMethod,
        status: 'Pending'
      });

      const savedOrder = await order.save();
      createdOrders.push(savedOrder);

      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -item.quantity }
      });
    }

    await Cart.deleteMany({ userId: req.user._id });

    res.status(201).json({
      message: 'Order placed successfully',
      orders: createdOrders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, failed to place order', error: error.message });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/user
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    // --- MOCK DB MODE ---
    if (global.useMockDb) {
      const userOrders = global.mockOrders.filter(o => o.userId === req.user._id);
      const populated = populateMockOrders(userOrders);
      populated.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      return res.json(populated);
    }

    // --- MONGO DB MODE ---
    const orders = await Order.find({ userId: req.user._id })
      .populate('productId')
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, failed to fetch user orders' });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/all
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    // --- MOCK DB MODE ---
    if (global.useMockDb) {
      const populated = populateMockOrders(global.mockOrders);
      populated.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      return res.json(populated);
    }

    // --- MONGO DB MODE ---
    const orders = await Order.find({})
      .populate('userId', 'username email')
      .populate('productId')
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, failed to fetch all orders' });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    if (!orderId || !status) {
      return res.status(400).json({ message: 'Order ID and status are required' });
    }

    if (!['Pending', 'Processing', 'Delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    // --- MOCK DB MODE ---
    if (global.useMockDb) {
      const idx = global.mockOrders.findIndex(o => o._id === orderId);
      if (idx !== -1) {
        global.mockOrders[idx].status = status;
        return res.json(global.mockOrders[idx]);
      } else {
        return res.status(404).json({ message: 'Order not found' });
      }
    }

    // --- MONGO DB MODE ---
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, failed to update order status' });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
};
