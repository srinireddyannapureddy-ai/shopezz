const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Original price is required'],
    min: [0, 'Price must be positive']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount percentage cannot be negative'],
    max: [100, 'Discount percentage cannot exceed 100']
  },
  image: {
    type: String,
    required: [true, 'Product image URL is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Electronics', 'Fashion', 'Mobiles', 'Groceries', 'Sports Equipment'],
    trim: true
  },
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Unisex'],
    default: 'Unisex'
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 10
  },
  rating: {
    type: Number,
    default: 4.0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
