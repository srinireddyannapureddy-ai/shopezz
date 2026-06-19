
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      title: 'Fashion Extravaganza',
      desc: 'Upgrade your wardrobe with up to 50% off on top brands.',
      image:
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop&q=80',
      category: 'Fashion'
    },
    {
      title: 'Next-Gen Electronics',
      desc: 'Discover cutting-edge gadgets, audio gear, and gaming peripherals.',
      image:
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&auto=format&fit=crop&q=80',
      category: 'Electronics'
    },
    {
      title: 'Fresh & Healthy Groceries',
      desc: 'Daily essentials, organic fruits, veggies, and pantry favorites delivered fresh.',
      image:
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
      category: 'Groceries'
    },
    {
      title: 'Pro Sports & Gym Gear',
      desc: 'Everything you need to crush your fitness goals, indoors or out.',
      image:
        'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1200&auto=format&fit=crop&q=80',
      category: 'Sports Equipment'
    }
  ];

  const categories = [
    {
      name: 'Fashion',
      image:
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&auto=format&fit=crop&q=80'
    },
    {
      name: 'Electronics',
      image:
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=80'
    },
    {
      name: 'Groceries',
      image:
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80'
    },
    {
      name: 'Sports Equipment',
      image:
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&auto=format&fit=crop&q=80'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 3500);

    return () => clearInterval(timer);
  }, [banners.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === banners.length - 1 ? 0 : prev + 1
    );
  };

  const handleShopNowClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="container home-container">

      <section className="carousel-section">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`carousel-slide ${
              index === currentSlide ? 'active' : ''
            }`}
            style={{ backgroundImage: `url(${banner.image})` }}
          >
            <div className="carousel-overlay"></div>

            <div className="carousel-content">

              <span
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  color: '#fff',
                  fontSize: '14px',
                  display: 'inline-block',
                  marginBottom: '12px',
                  backdropFilter: 'blur(4px)'
                }}
              >
                Welcome to ShopEZ
              </span>

              <h1
                style={{
                  fontSize: '48px',
                  fontWeight: '700',
                  color: '#fff',
                  marginBottom: '12px',
                  lineHeight: '1.2'
                }}
              >
                Shop Smart with ShopEZ
              </h1>

              <p
                style={{
                  fontSize: '18px',
                  color: '#fff',
                  marginBottom: '20px',
                  maxWidth: '500px'
                }}
              >
                Discover Amazing Deals Every Day. {banner.desc}
              </p>

              <button
                className="carousel-btn"
                onClick={() => handleShopNowClick(banner.category)}
              >
                Shop Now
              </button>

            </div>
          </div>
        ))}

        <button
          className="carousel-arrow left flex-center"
          onClick={prevSlide}
        >
          <ChevronLeft size={24} />
        </button>

        <button
          className="carousel-arrow right flex-center"
          onClick={nextSlide}
        >
          <ChevronRight size={24} />
        </button>
      </section>

      <section style={{ marginTop: '48px' }}>
        <h2 className="section-title">Shop by Category</h2>

        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.name}
              className="category-card"
              onClick={() => handleShopNowClick(category.name)}
            >
              <div className="category-img-container">
                <img
                  src={category.image}
                  alt={category.name}
                  className="category-img"
                  loading="lazy"
                />
              </div>

              <div className="category-name">
                {category.name}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;