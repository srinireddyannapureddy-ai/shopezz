import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, ShoppingBag } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, loading } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await login(email, password);
    if (result.success) {
      // Check if redirected from checkout
      const from = location.state?.from?.pathname || '/';
      navigate(from);
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
          <h2>Welcome Back</h2>
          <p>Please enter your details to sign in</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
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

          <div className="form-group" style={{ marginBottom: '28px' }}>
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

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={submitting}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
          <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--gray-border)' }}>
            Are you an administrator? <Link to="/admin/login" style={{ color: 'var(--secondary)' }}>Admin Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
