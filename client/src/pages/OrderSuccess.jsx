import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Check, ShoppingBag, ListChecks } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const { address, paymentMethod } = state;

  return (
    <div className="container" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="success-card">
        <div className="success-icon-box">
          <Check size={40} strokeWidth={3} />
        </div>
        
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for shopping with ShopEZ. Your order has been registered and is being processed.</p>

        {address && (
          <div style={{ 
            backgroundColor: 'var(--gray-bg)', 
            borderRadius: 'var(--radius-md)', 
            padding: '20px', 
            textAlign: 'left',
            marginBottom: '30px',
            border: '1px solid var(--gray-border)',
            fontSize: '14px'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', color: 'var(--dark)' }}>
              Delivery Details:
            </h3>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>{address.fullName}</div>
            <div style={{ color: 'var(--gray-text)', marginBottom: '8px' }}>
              {address.address}, {address.city}, {address.state} - {address.pincode}
            </div>
            <div>
              <span style={{ color: 'var(--gray-text)' }}>Mobile:</span> {address.mobile}
            </div>
            <div style={{ marginTop: '8px' }}>
              <span style={{ color: 'var(--gray-text)' }}>Payment Mode:</span> {paymentMethod}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/profile" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
            <ListChecks size={18} />
            <span>Order History</span>
          </Link>
          
          <Link to="/products" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
            <ShoppingBag size={18} />
            <span>Keep Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
