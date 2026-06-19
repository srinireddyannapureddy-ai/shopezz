import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Wallet, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Address Fields State
  const [address, setAddress] = useState({
    fullName: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/api/orders', {
        address,
        paymentMethod
      });

      // Clear the local cart context
      clearCart();

      // Navigate to order success page and pass order details in state
      navigate('/order-success', { 
        state: { 
          orders: response.data.orders,
          address,
          paymentMethod
        } 
      });
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div className="alert alert-warning">Your cart is empty. Please add items to proceed.</div>
        <button className="btn-primary" onClick={() => navigate('/products')} style={{ marginTop: '16px' }}>
          Shop Products
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <h1 className="section-title" style={{ marginTop: '24px' }}>Checkout</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="checkout-layout">
        {/* Left: Forms */}
        <div className="checkout-box">
          
          {/* Shipping Address Section */}
          <div className="checkout-section" style={{ marginBottom: '36px' }}>
            <h2 className="checkout-section-title">Shipping Address</h2>
            
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-input"
                placeholder="Enter your full name"
                value={address.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mobile">Mobile Number</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  className="form-input"
                  placeholder="10-digit mobile number"
                  value={address.mobile}
                  onChange={handleInputChange}
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit mobile number"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="pincode">Pincode</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  className="form-input"
                  placeholder="6-digit pincode"
                  value={address.pincode}
                  onChange={handleInputChange}
                  pattern="[0-9]{6}"
                  title="Please enter a valid 6-digit pincode"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address (Area and Street)</label>
              <textarea
                id="address"
                name="address"
                className="form-input"
                placeholder="Enter your street address, apartment details, etc."
                value={address.address}
                onChange={handleInputChange}
                rows="3"
                style={{ resize: 'vertical' }}
                required
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City/District/Town</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="form-input"
                  placeholder="Enter city"
                  value={address.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  className="form-input"
                  placeholder="Enter state"
                  value={address.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Methods Section */}
          <div className="checkout-section">
            <h2 className="checkout-section-title">Payment Method</h2>
            
            <div className="payment-options">
              {/* COD */}
              <div 
                className={`payment-card ${paymentMethod === 'Cash On Delivery' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('Cash On Delivery')}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Cash On Delivery'}
                  onChange={() => setPaymentMethod('Cash On Delivery')}
                />
                <div className="payment-card-info">
                  <span className="payment-card-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={16} /> Cash On Delivery (COD)
                  </span>
                  <span className="payment-card-desc">Pay cash when your order gets delivered.</span>
                </div>
              </div>

              {/* UPI */}
              <div 
                className={`payment-card ${paymentMethod === 'UPI' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('UPI')}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                />
                <div className="payment-card-info">
                  <span className="payment-card-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Wallet size={16} /> UPI (Google Pay, PhonePe, BHIM)
                  </span>
                  <span className="payment-card-desc">Scan QR code or enter your UPI ID.</span>
                </div>
              </div>

              {/* Credit Card */}
              <div 
                className={`payment-card ${paymentMethod === 'Credit Card' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('Credit Card')}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Credit Card'}
                  onChange={() => setPaymentMethod('Credit Card')}
                />
                <div className="payment-card-info">
                  <span className="payment-card-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={16} /> Credit / Debit Card
                  </span>
                  <span className="payment-card-desc">Pay using Visa, MasterCard, RuPay, or AMEX.</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right: Order Summary */}
        <div className="cart-summary">
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Items Review</h3>
          
          <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '20px', borderBottom: '1px solid var(--gray-border)', paddingBottom: '16px' }}>
            {cartItems.map((item) => {
              const product = item.productId;
              if (!product) return null;
              const finalPrice = product.price * (1 - (product.discount || 0) / 100);
              
              return (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px' }}>
                  <span style={{ fontWeight: '500', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.title} <span style={{ color: 'var(--gray-text)' }}>x{item.quantity}</span>
                  </span>
                  <span style={{ fontWeight: '700' }}>
                    ${(finalPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cartSubtotal.toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping</span>
            <span style={{ color: 'var(--success)', fontWeight: '600' }}>FREE</span>
          </div>

          <div className="summary-row total">
            <span>Order Total</span>
            <span>${cartSubtotal.toFixed(2)}</span>
          </div>

          <button 
            type="submit"
            className="btn-checkout"
            disabled={loading}
          >
            {loading ? 'Processing Order...' : 'Place Order'}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--gray-text)', fontSize: '12px', marginTop: '16px', fontWeight: '500' }}>
            <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
            <span>Secure 256-bit SSL checkout encryption</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
