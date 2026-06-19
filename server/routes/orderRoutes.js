const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// Checkout and get personal orders are accessible by logged-in users
router.post('/', protect, placeOrder);
router.get('/user', protect, getUserOrders);

// Admin order operations
router.get('/all', protect, admin, getAllOrders);
router.put('/status', protect, admin, updateOrderStatus);

module.exports = router;
