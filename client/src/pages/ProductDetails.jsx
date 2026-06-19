import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [shoppingNow, setShoppingNow] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Product not found or failed to load details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container flex-center" style={{ height: '70vh', flexDirection: 'column', gap: '16px' }}>
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
        <span style={{ color: 'var(--gray-text)', fontWeight: '600' }}>Loading details...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '40px 0' }}>
        <div className="alert alert-danger">{error || 'Product details are unavailable.'}</div>
        <button className="btn-secondary" onClick={() => navigate(-1)} style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>
    );
  }

  const { title, description, price, discount, image, category, gender, stock, rating } = product;

  // Pricing calculations
  const discountedPrice = Math.round(price * (1 - (discount || 0) / 100) * 100) / 100;
  const isOutOfStock = stock <= 0;

  const handleAddToCart = async () => {
    setAdding(true);
    const res = await addToCart(product._id, 1);
    if (res.success) {
      alert('Product added to cart successfully!');
    } else {
      alert(res.message);
      if (res.message.includes('log in')) {
        navigate('/login');
      }
    }
    setAdding(false);
  };

  const handleShopNow = async () => {
    setShoppingNow(true);
    const res = await addToCart(product._id, 1);
    if (res.success) {
      navigate('/cart');
    } else {
      alert(res.message);
      if (res.message.includes('log in')) {
        navigate('/login');
      }
    }
    setShoppingNow(false);
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <button 
        className="btn-secondary" 
        onClick={() => navigate(-1)} 
        style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
      >
        <ArrowLeft size={16} /> Back to Products
      </button>

      <div className="details-container">
        {/* Left Side: Product Image */}
        <div className="details-image-box">
          {discount > 0 && <span className="discount-badge" style={{ fontSize: '14px', padding: '6px 12px' }}>{discount}% OFF</span>}
          <img src={image} alt={title} className="details-image" />
        </div>

        {/* Right Side: Product Details */}
        <div className="details-info">
          <span className="details-category-gender">{category} &bull; {gender}</span>
          <h1 className="details-title">{title}</h1>
          
          <div className="details-rating">
            <Star size={16} fill="currentColor" style={{ marginRight: '4px' }} />
            <span>{rating ? rating.toFixed(1) : '4.0'} / 5.0 Rating</span>
          </div>

          <p className="details-desc">{description}</p>

          <div className="details-price-box">
            <span className="discount-price" style={{ fontSize: '32px' }}>
              ${discountedPrice.toFixed(2)}
            </span>
            {discount > 0 && (
              <>
                <span className="original-price" style={{ fontSize: '18px' }}>
                  ${price.toFixed(2)}
                </span>
                <span style={{ color: 'var(--danger)', fontWeight: '700', fontSize: '16px', marginLeft: '6px' }}>
                  ({discount}% OFF)
                </span>
              </>
            )}
          </div>

          <div className="details-stock">
            Availability:{' '}
            {isOutOfStock ? (
              <span className="stock-out">Out of Stock</span>
            ) : (
              <span className="stock-in">In Stock ({stock} units available)</span>
            )}
          </div>

          {/* Shipping & Warranty features for premium look */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid var(--gray-border)', paddingBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--gray-text)', fontWeight: '500' }}>
              <Truck size={18} style={{ color: 'var(--primary)' }} />
              <span>Free Local Delivery</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--gray-text)', fontWeight: '500' }}>
              <ShieldCheck size={18} style={{ color: 'var(--success)' }} />
              <span>100% Quality Assured</span>
            </div>
          </div>

          {/* Action Buttons */}
          {user?.role !== 'admin' && (
            <div className="details-actions">
              <button
                className="btn-add-cart"
                onClick={handleAddToCart}
                disabled={isOutOfStock || adding || shoppingNow}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <ShoppingCart size={18} />
                <span>{adding ? 'Adding...' : 'Add To Cart'}</span>
              </button>
              
              <button
                className="btn-shop-now"
                onClick={handleShopNow}
                disabled={isOutOfStock || adding || shoppingNow}
              >
                {shoppingNow ? 'Checking Out...' : 'Shop Now'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
