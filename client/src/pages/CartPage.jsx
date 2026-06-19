import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart, cartSubtotal, loading } = useContext(CartContext);

  const handleQtyChange = async (productId, currentQty, amount, maxStock) => {
    const newQty = currentQty + amount;
    if (newQty < 1) return;
    if (newQty > maxStock) {
      alert(`Cannot add more. Only ${maxStock} items available in stock.`);
      return;
    }
    await addToCart(productId, newQty, true); // true = override quantity
  };

  const handleRemoveItem = async (productId) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      await removeFromCart(productId);
    }
  };

  if (loading && cartItems.length === 0) {
    return (
      <div className="container flex-center" style={{ height: '60vh' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid var(--primary-light)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="success-icon-box" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <ShoppingBag size={36} />
          </div>
          <h3>Your cart is empty</h3>
          <p>Explore our products and find something you love!</p>
          <Link to="/products" className="btn-primary" style={{ display: 'inline-block', padding: '12px 30px' }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <h1 className="section-title" style={{ marginTop: '24px' }}>Shopping Cart</h1>
      
      <div className="cart-layout">
        {/* Cart Items List */}
        <div className="cart-items-box">
          {cartItems.map((item) => {
            const product = item.productId;
            if (!product) return null;

            const finalPrice = Math.round(product.price * (1 - (product.discount || 0) / 100) * 100) / 100;
            const itemSubtotal = finalPrice * item.quantity;

            return (
              <div key={item._id} className="cart-item">
                <img src={product.image} alt={product.title} className="cart-item-img" />
                
                <div className="cart-item-info">
                  <h3 className="cart-item-title">
                    <Link to={`/products/${product._id}`}>{product.title}</Link>
                  </h3>
                  <div className="cart-item-category">{product.category}</div>
                  
                  {/* Quantity Controls */}
                  <div className="cart-item-qty-actions">
                    <button 
                      className="qty-btn"
                      onClick={() => handleQtyChange(product._id, item.quantity, -1, product.stock)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="qty-val">{item.quantity}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => handleQtyChange(product._id, item.quantity, 1, product.stock)}
                      disabled={item.quantity >= product.stock}
                    >
                      +
                    </button>
                    <span style={{ fontSize: '12px', color: 'var(--gray-text)', marginLeft: '10px' }}>
                      (Stock: {product.stock})
                    </span>
                  </div>
                </div>

                <div className="cart-item-pricing">
                  <div className="cart-item-subtotal">${itemSubtotal.toFixed(2)}</div>
                  <div style={{ fontSize: '13px', color: 'var(--gray-text)', marginBottom: '8px' }}>
                    (${finalPrice.toFixed(2)} each)
                  </div>
                  <div 
                    className="cart-item-delete"
                    onClick={() => handleRemoveItem(product._id)}
                  >
                    <Trash2 size={14} />
                    <span>Remove</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Summary */}
        <div className="cart-summary">
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Order Summary</h3>
          
          <div className="summary-row">
            <span>Price ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
            <span>${cartSubtotal.toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Delivery Charges</span>
            <span style={{ color: 'var(--success)', fontWeight: '600' }}>FREE</span>
          </div>

          <div className="summary-row total">
            <span>Total Amount</span>
            <span>${cartSubtotal.toFixed(2)}</span>
          </div>

          <button 
            className="btn-checkout"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link to="/products" style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <ArrowLeft size={14} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
