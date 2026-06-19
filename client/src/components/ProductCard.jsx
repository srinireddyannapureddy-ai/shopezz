import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [adding, setAdding] = useState(false);

  const { _id, title, price, discount, image, category, rating, stock } = product;

  // Calculate final discounted price
  const discountedPrice = Math.round(price * (1 - (discount || 0) / 100) * 100) / 100;

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Avoid triggering card click navigation
    setAdding(true);
    const res = await addToCart(_id, 1);
    if (!res.success) {
      alert(res.message);
      if (res.message.includes('log in')) {
        navigate('/login');
      }
    }
    setAdding(false);
  };

  const handleCardClick = () => {
    navigate(`/products/${_id}`);
  };

  const isOutOfStock = stock <= 0;

  return (
    <div className="product-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="product-card-img-box">
        {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
        <img src={image} alt={title} className="product-card-img" loading="lazy" />
        <span className="rating-badge">
          <Star size={12} className="rating-star" />
          <span>{rating ? rating.toFixed(1) : '4.0'}</span>
        </span>
      </div>

      <div className="product-card-info">
        <span className="product-card-category">{category}</span>
        <h3 className="product-card-title">{title}</h3>

        <div className="product-card-price-box">
          <span className="discount-price">${discountedPrice.toFixed(2)}</span>
          {discount > 0 && (
            <span className="original-price">${price.toFixed(2)}</span>
          )}
        </div>

        {user?.role !== 'admin' && (
          <button
            className="product-card-btn"
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <ShoppingCart size={15} />
            <span>
              {isOutOfStock 
                ? 'Out of Stock' 
                : adding 
                  ? 'Adding...' 
                  : 'Add To Cart'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
