const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.use(protect); // protect all cart routes

router.route('/')
  .get(getCart);

router.post('/add', addToCart);
router.delete('/remove', removeFromCart);

module.exports = router;
