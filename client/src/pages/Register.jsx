import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ShoppingBag } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, user } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Frontend validations
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    const result = await register(username, email, password, confirmPassword);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo flex-center" style={{ color: 'var(--primary)', marginBottom: '16px' }}>
            <ShoppingBag size={36} />
            <span style={{ fontSize: '30px', fontWeight: '800', marginLeft: '8px' }}>ShopEZ</span>
          </div>
          <h2>Create Account</h2>
          <p>Sign up to start shopping on ShopEZ</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          
          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div style={{ position: 'relative' }}>
              <User 
                size={18} 
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-text)' }} 
              />
              <input
                type="text"
                id="username"
                className="form-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail 
                size={18} 
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-text)' }} 
              />
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={18} 
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-text)' }} 
              />
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={18} 
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-text)' }} 
              />
              <input
                type="password"
                id="confirmPassword"
                className="form-input"
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={submitting}
          >
            {submitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
