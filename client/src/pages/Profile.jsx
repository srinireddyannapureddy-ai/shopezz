import React, { useState, useEffect, useContext } from 'react';
import { User, ShoppingBag, Mail, Calendar, Eye } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('orders'); // 'info' or 'orders'

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await api.get('/api/orders/user');
        setOrders(response.data);
      } catch (err) {
        console.error('Failed to load user orders:', err);
        setError('Could not load your order history.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserOrders();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container" style={{ minHeight: '80vh' }}>
      <div className="profile-layout">
        
        {/* Left: Sidebar profile details */}
        <aside className="profile-sidebar">
          <div className="profile-avatar-box">
            <div className="profile-avatar">
              {getInitials(user?.username)}
            </div>
            <h2 className="profile-username">{user?.username || 'User'}</h2>
            <p className="profile-email">{user?.email}</p>
          </div>

          <div 
            className={`profile-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={18} />
            <span>Order History ({orders.length})</span>
          </div>

          <div 
            className={`profile-tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <User size={18} />
            <span>Profile Information</span>
          </div>
        </aside>

        {/* Right: Main content panel */}
        <main className="profile-main-content">
          {activeTab === 'orders' ? (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Your Orders</h2>
              
              {loading ? (
                <div className="flex-center" style={{ height: '200px' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    border: '3px solid var(--primary-light)',
                    borderTopColor: 'var(--primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                </div>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gray-text)' }}>
                  <p>You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="shopez-table-wrapper">
                  <table className="shopez-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Name</th>
                        <th>Qty</th>
                        <th>Subtotal</th>
                        <th>Order Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => {
                        const product = order.productId;
                        if (!product) return null;
                        
                        const finalPrice = product.price * (1 - (product.discount || 0) / 100);
                        const subtotal = finalPrice * order.quantity;

                        return (
                          <tr key={order._id}>
                            <td>
                              <img src={product.image} alt={product.title} className="table-product-img" />
                            </td>
                            <td style={{ fontWeight: '600', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {product.title}
                            </td>
                            <td style={{ fontWeight: '600' }}>{order.quantity}</td>
                            <td style={{ fontWeight: '700', color: 'var(--primary)' }}>
                              ${subtotal.toFixed(2)}
                            </td>
                            <td>{formatDate(order.orderDate)}</td>
                            <td>
                              <span className={`status-badge ${order.status.toLowerCase()}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Profile Information</h2>
              
              <div style={{ display: 'grid', gap: '20px', maxWidth: '500px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', backgroundColor: 'var(--gray-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-border)' }}>
                  <User size={20} style={{ color: 'var(--primary)' }} />
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--gray-text)', fontWeight: '600' }}>USERNAME</div>
                    <div style={{ fontWeight: '700' }}>{user?.username}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', backgroundColor: 'var(--gray-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-border)' }}>
                  <Mail size={20} style={{ color: 'var(--primary)' }} />
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--gray-text)', fontWeight: '600' }}>EMAIL ADDRESS</div>
                    <div style={{ fontWeight: '700' }}>{user?.email}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', backgroundColor: 'var(--gray-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-border)' }}>
                  <Calendar size={20} style={{ color: 'var(--primary)' }} />
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--gray-text)', fontWeight: '600' }}>ROLE</div>
                    <div style={{ fontWeight: '700', textTransform: 'capitalize' }}>{user?.role}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
