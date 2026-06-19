import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, LogOut, LayoutDashboard, ChevronDown, ShoppingBag } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Sync search input with URL search param if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
    } else if (!location.pathname.startsWith('/products')) {
      setSearchQuery('');
    }
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogoutClick = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="header-nav">
      <div className="container header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <ShoppingBag size={28} />
          <span>ShopEZ</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-bar-form">
          <input
            type="text"
            className="search-input"
            placeholder="Search products, brands and more..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-icon-btn">
            <Search size={20} />
          </button>
        </form>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Cart Icon */}
          {(!user || user.role !== 'admin') && (
            <Link to="/cart" className="cart-icon-container">
              <ShoppingCart size={24} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          )}

          {/* Authentication States */}
          {user ? (
            <div className="profile-menu">
              <div 
                className="profile-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <User size={18} />
                <span>{user.username}</span>
                <ChevronDown size={14} />
              </div>

              {dropdownOpen && (
                <div className="profile-dropdown">
                  {user.role === 'admin' ? (
                    <>
                      <Link 
                        to="/admin" 
                        className="profile-dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <LayoutDashboard size={16} />
                        <span>Admin Panel</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/profile" 
                        className="profile-dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User size={16} />
                        <span>My Profile</span>
                      </Link>
                    </>
                  )}
                  <div 
                    className="profile-dropdown-item logout"
                    onClick={handleLogoutClick}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
