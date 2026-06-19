import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="shopez-footer">
      <div className="container footer-content">
        <div className="footer-column">
          <div className="footer-logo">
            <ShoppingBag size={24} style={{ marginRight: '8px', verticalAlign: 'middle', display: 'inline-block' }} />
            <span style={{ verticalAlign: 'middle' }}>ShopEZ</span>
          </div>
          <p className="footer-text">
            ShopEZ is a next-generation MERN e-commerce application designed to provide the fastest, easiest, and most secure shopping experience online.
          </p>
        </div>

        <div className="footer-column">
          <h4>Product Categories</h4>
          <ul className="footer-links">
            <li><Link to="/products?category=Electronics">Electronics</Link></li>
            <li><Link to="/products?category=Fashion">Fashion</Link></li>
            <li><Link to="/products?category=Mobiles">Mobiles</Link></li>
            <li><Link to="/products?category=Groceries">Groceries</Link></li>
            <li><Link to="/products?category=Sports Equipment">Sports Equipment</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Customer Service</h4>
          <ul className="footer-links">
            <li><Link to="/profile">My Account</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
            <li><Link to="/login">Login / Register</Link></li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} ShopEZ Inc. All rights reserved. Built with love using the MERN stack.</p>
      </div>
    </footer>
  );
};

export default Footer;
