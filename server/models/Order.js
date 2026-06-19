const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  address: {
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    addressLine: { type: String, required: true }, // renamed to addressLine to distinguish, but let's make it match the requirements: fullName, mobile, address, city, state, pincode. Wait, let's keep it as `address` or `addressText`. The prompt lists under Shipping Address fields: Full Name, Mobile, Address, City, State, Pincode. Let's make it match:
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    enum: ['Cash On Delivery', 'UPI', 'Credit Card'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Delivered'],
    default: 'Pending'
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
