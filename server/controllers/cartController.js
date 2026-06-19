const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to populate product details in mock cart items
const populateMockCart = (userId) => {
  const userCarts = global.mockCarts.filter(c => c.userId === userId);
  return userCarts.map(item => {
    const product = global.mockProducts.find(p => p._id === item.productId);
    return {
      ...item,
      productId: product // Attach full product object for client use
    };
  });
};

// @desc    Get user's cart items
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    // --- MOCK DB MODE ---
    if (global.useMockDb) {
      const cartItems = populateMockCart(req.user._id);
      return res.json(cartItems);
    }

    // --- MONGO DB MODE ---
    const cartItems = await Cart.find({ userId: req.user._id }).populate('productId');
    res.json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, failed to fetch cart items' });
  }
};

// @desc    Add item to cart or update quantity
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const qty = quantity ? parseInt(quantity) : 1;
    if (qty < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // --- MOCK DB MODE ---
    if (global.useMockDb) {
      const product = global.mockProducts.find(p => p._id === productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      let cartItem = global.mockCarts.find(
        c => c.userId === req.user._id && c.productId === productId
      );

      const { overrideQuantity } = req.body;

      if (cartItem) {
        if (overrideQuantity) {
          cartItem.quantity = qty;
        } else {
          cartItem.quantity += qty;
        }

        // Limit to available stock
        if (cartItem.quantity > product.stock) {
          cartItem.quantity = product.stock;
        }
      } else {
        cartItem = {
          _id: `mock_cart_${Date.now()}`,
          userId: req.user._id,
          productId,
          quantity: Math.min(qty, product.stock)
        };
        global.mockCarts.push(cartItem);
      }

      const updatedCart = populateMockCart(req.user._id);
      return res.json(updatedCart);
    }

    // --- MONGO DB MODE ---
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cartItem = await Cart.findOne({ userId: req.user._id, productId });

    if (cartItem) {
      const { overrideQuantity } = req.body;
      if (overrideQuantity) {
        cartItem.quantity = qty;
      } else {
        cartItem.quantity += qty;
      }
      
      if (cartItem.quantity > product.stock) {
        cartItem.quantity = product.stock;
      }
      
      await cartItem.save();
    } else {
      cartItem = new Cart({
        userId: req.user._id,
        productId,
        quantity: Math.min(qty, product.stock)
      });
      await cartItem.save();
    }

    const updatedCart = await Cart.find({ userId: req.user._id }).populate('productId');
    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, failed to add to cart' });
  }
};

// @desc    Remove item from cart or decrease quantity
// @route   DELETE /api/cart/remove
// @access  Private
const removeFromCart = async (req, res) => {
  const productId = req.query.productId || req.body.productId;

  try {
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // --- MOCK DB MODE ---
    if (global.useMockDb) {
      const idx = global.mockCarts.findIndex(
        c => c.userId === req.user._id && c.productId === productId
      );

      if (idx === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }

      global.mockCarts.splice(idx, 1);

      const updatedCart = populateMockCart(req.user._id);
      return res.json(updatedCart);
    }

    // --- MONGO DB MODE ---
    const cartItem = await Cart.findOne({ userId: req.user._id, productId });

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    await Cart.deleteOne({ _id: cartItem._id });

    const updatedCart = await Cart.find({ userId: req.user._id }).populate('productId');
    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, failed to remove from cart' });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart
};
