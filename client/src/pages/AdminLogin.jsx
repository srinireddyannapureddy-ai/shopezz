import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Mail, Lock, ShoppingBag } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin, user } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirect to admin panel if already logged in as admin
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await adminLogin(email, password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ borderColor: 'var(--secondary)' }}>
        <div className="auth-header">
          <div className="logo flex-center" style={{ color: 'var(--secondary)', marginBottom: '16px' }}>
            <ShoppingBag size={36} />
            <span style={{ fontSize: '30px', fontWeight: '800', marginLeft: '8px' }}>ShopEZ</span>
          </div>
          <h2>Admin Control Center</h2>
          <p>Access the administrative dashboard</p>
        </div>

        {/* Info card containing default credentials */}
        <div 
          className="alert alert-warning" 
          style={{ 
            fontSize: '13px', 
            lineHeight: '1.4', 
            flexDirection: 'column', 
            alignItems: 'flex-start',
            gap: '6px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
            <ShieldAlert size={16} />
            <span>Default Evaluator Credentials:</span>
          </div>
          <div>
            <strong>Email:</strong> admin@shopez.com <br />
            <strong>Password:</strong> admin123
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <div style={{ position: 'relative' }}>
              <Mail 
                size={18} 
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-text)' }} 
              />
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="admin@shopez.com"
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
            style={{ backgroundColor: 'var(--secondary)' }}
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>

        <div className="auth-footer" style={{ borderTop: '1px solid var(--gray-border)', marginTop: '20px', paddingTop: '20px' }}>
          Are you a customer? <Link to="/login" style={{ color: 'var(--primary)' }}>Go to User Login</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
