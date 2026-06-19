import React, { useState, useEffect, useContext } from 'react';
import { Users, BarChart3, ShoppingBag, Landmark, Plus, Edit2, Trash2, CheckCircle2, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  // Tabs: 'dashboard' | 'products' | 'orders'
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Dashboard Metrics State
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0
  });
  
  // Products Management State
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null when adding new
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    gender: 'Unisex',
    price: '',
    discount: '',
    stock: '',
    image: ''
  });

  // Orders Management State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // General loading states
  const [metricsLoading, setMetricsLoading] = useState(true);

  // Load Dashboard Metrics
  const fetchMetrics = async () => {
    setMetricsLoading(true);
    try {
      const response = await api.get('/api/admin/dashboard');
      setMetrics(response.data);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setMetricsLoading(false);
    }
  };

  // Load Products list
  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await api.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  // Load Orders list
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await api.get('/api/orders/all');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchMetrics();
  }, []);

  // Fetch tab-specific data on tab switch
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchMetrics();
    } else if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  // Product actions: Edit / Delete / Create
  const handleOpenProductModal = (prod = null) => {
    if (prod) {
      // Edit mode
      setEditingProduct(prod);
      setProductForm({
        title: prod.title,
        description: prod.description,
        category: prod.category,
        gender: prod.gender || 'Unisex',
        price: prod.price,
        discount: prod.discount,
        stock: prod.stock,
        image: prod.image
      });
    } else {
      // Create mode
      setEditingProduct(null);
      setProductForm({
        title: '',
        description: '',
        category: 'Electronics',
        gender: 'Unisex',
        price: '',
        discount: '0',
        stock: '10',
        image: ''
      });
    }
    setProductModalOpen(true);
  };

  const handleProductFormSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...productForm,
      price: parseFloat(productForm.price),
      discount: parseInt(productForm.discount) || 0,
      stock: parseInt(productForm.stock) || 10
    };

    try {
      if (editingProduct) {
        // Update product
        await api.put(`/api/products/${editingProduct._id}`, payload);
        alert('Product updated successfully.');
      } else {
        // Create product
        await api.post('/api/products', payload);
        alert('Product created successfully.');
      }
      setProductModalOpen(false);
      fetchProducts();
      fetchMetrics();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert(error.response?.data?.message || 'Error saving product.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/products/${id}`);
        alert('Product deleted successfully.');
        fetchProducts();
        fetchMetrics();
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Error deleting product.');
      }
    }
  };

  // Order actions: Update status
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await api.put('/api/orders/status', { orderId, status: newStatus });
      alert('Order status updated successfully.');
      fetchOrders();
      fetchMetrics();
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Error updating order status.');
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container" style={{ minHeight: '80vh', paddingBottom: '60px' }}>
      <h1 className="section-title" style={{ marginTop: '24px' }}>Admin Panel</h1>

      <div className="profile-layout">
        {/* Left Side: Navigation tabs */}
        <aside className="profile-sidebar" style={{ width: '250px' }}>
          <div className="profile-avatar-box">
            <div className="profile-avatar" style={{ backgroundColor: 'var(--secondary)' }}>
              AD
            </div>
            <h2 className="profile-username">ShopEZ Admin</h2>
            <p className="profile-email">{user?.email}</p>
          </div>

          <div 
            className={`profile-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart3 size={18} />
            <span>Dashboard Metrics</span>
          </div>

          <div 
            className={`profile-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <ShoppingBag size={18} />
            <span>Manage Products</span>
          </div>

          <div 
            className={`profile-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <CheckCircle2 size={18} />
            <span>All Orders</span>
          </div>
        </aside>

        {/* Right Side: Tab panel contents */}
        <main className="profile-main-content">
          
          {/* TAB 1: METRICS DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Overview Metrics</h2>
              
              {metricsLoading ? (
                <div className="flex-center" style={{ height: '200px' }}>
                  <div style={{ width: '30px', height: '30px', border: '3px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                </div>
              ) : (
                <div className="admin-metrics-grid">
                  {/* Users Count */}
                  <div className="metric-card">
                    <div className="metric-info">
                      <h4>Total Users</h4>
                      <div className="metric-val">{metrics.totalUsers}</div>
                    </div>
                    <div className="metric-icon-box blue">
                      <Users size={24} />
                    </div>
                  </div>

                  {/* Products Count */}
                  <div className="metric-card">
                    <div className="metric-info">
                      <h4>Products</h4>
                      <div className="metric-val">{metrics.totalProducts}</div>
                    </div>
                    <div className="metric-icon-box cyan">
                      <ShoppingBag size={24} />
                    </div>
                  </div>

                  {/* Orders Count */}
                  <div className="metric-card">
                    <div className="metric-info">
                      <h4>Orders</h4>
                      <div className="metric-val">{metrics.totalOrders}</div>
                    </div>
                    <div className="metric-icon-box yellow">
                      <CheckCircle2 size={24} />
                    </div>
                  </div>

                  {/* Total Revenue */}
                  <div className="metric-card">
                    <div className="metric-info">
                      <h4>Revenue</h4>
                      <div className="metric-val">${metrics.revenue.toFixed(2)}</div>
                    </div>
                    <div className="metric-icon-box green">
                      <Landmark size={24} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MANAGE PRODUCTS (CRUD) */}
          {activeTab === 'products' && (
            <div>
              <div className="flex-between" style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Catalog Products</h2>
                <button 
                  className="btn-primary" 
                  onClick={() => handleOpenProductModal()}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px' }}
                >
                  <Plus size={16} /> Add Product
                </button>
              </div>

              {productsLoading ? (
                <div className="flex-center" style={{ height: '200px' }}>
                  <div style={{ width: '30px', height: '30px', border: '3px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                </div>
              ) : (
                <div className="shopez-table-wrapper">
                  <table className="shopez-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((prod) => (
                        <tr key={prod._id}>
                          <td>
                            <img src={prod.image} alt={prod.title} className="table-product-img" />
                          </td>
                          <td style={{ fontWeight: '600', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {prod.title}
                          </td>
                          <td>{prod.category}</td>
                          <td style={{ fontWeight: '700' }}>${prod.price.toFixed(2)}</td>
                          <td style={{ fontWeight: '600' }}>{prod.stock}</td>
                          <td>
                            <button 
                              className="action-btn"
                              onClick={() => handleOpenProductModal(prod)}
                              title="Edit Product"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button 
                              className="action-btn delete"
                              onClick={() => handleDeleteProduct(prod._id)}
                              title="Delete Product"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ALL ORDERS */}
          {activeTab === 'orders' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>System Orders</h2>

              {ordersLoading ? (
                <div className="flex-center" style={{ height: '200px' }}>
                  <div style={{ width: '30px', height: '30px', border: '3px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                </div>
              ) : (
                <div className="shopez-table-wrapper">
                  <table className="shopez-table">
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Product Name</th>
                        <th>Qty</th>
                        <th>Shipping Address</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((ord) => {
                        const userObj = ord.userId;
                        const prodObj = ord.productId;
                        
                        return (
                          <tr key={ord._id}>
                            <td style={{ fontWeight: '600' }}>
                              {userObj ? userObj.username : 'Deleted User'}
                            </td>
                            <td style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {prodObj ? prodObj.title : 'Deleted Product'}
                            </td>
                            <td style={{ fontWeight: '600' }}>{ord.quantity}</td>
                            <td style={{ fontSize: '12px', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={`${ord.address.address}, ${ord.address.city}, ${ord.address.state} - ${ord.address.pincode}`}>
                              {ord.address.fullName} ({ord.address.mobile}) <br />
                              {ord.address.address}, {ord.address.city}
                            </td>
                            <td>{formatDate(ord.orderDate)}</td>
                            <td>
                              <select
                                className="select-status"
                                value={ord.status}
                                onChange={(e) => handleOrderStatusChange(ord._id, e.target.value)}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* POPUP MODAL: Add / Edit Product */}
      {productModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>
                {editingProduct ? 'Edit Catalog Product' : 'Add New Product'}
              </h3>
              <button 
                onClick={() => setProductModalOpen(false)}
                style={{ fontSize: '20px', color: 'var(--gray-text)', fontWeight: '700' }}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleProductFormSubmit}>
              <div className="modal-body">
                {/* Title */}
                <div className="form-group">
                  <label htmlFor="modal-title">Product Title *</label>
                  <input
                    type="text"
                    id="modal-title"
                    className="form-input"
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    required
                  />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label htmlFor="modal-desc">Description *</label>
                  <textarea
                    id="modal-desc"
                    className="form-input"
                    rows="3"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    required
                  ></textarea>
                </div>

                {/* Category & Gender */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="modal-cat">Category *</label>
                    <select
                      id="modal-cat"
                      className="form-input"
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Mobiles">Mobiles</option>
                      <option value="Groceries">Groceries</option>
                      <option value="Sports Equipment">Sports Equipment</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="modal-gender">Gender Target</label>
                    <select
                      id="modal-gender"
                      className="form-input"
                      value={productForm.gender}
                      onChange={(e) => setProductForm({ ...productForm, gender: e.target.value })}
                    >
                      <option value="Unisex">Unisex</option>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                    </select>
                  </div>
                </div>

                {/* Price, Discount & Stock */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="modal-price">Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      id="modal-price"
                      className="form-input"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="modal-discount">Discount (%)</label>
                    <input
                      type="number"
                      id="modal-discount"
                      className="form-input"
                      value={productForm.discount}
                      onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="modal-stock">Stock *</label>
                    <input
                      type="number"
                      id="modal-stock"
                      className="form-input"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div className="form-group" style={{ marginBottom: '0' }}>
                  <label htmlFor="modal-image">Image URL *</label>
                  <input
                    type="url"
                    id="modal-image"
                    className="form-input"
                    placeholder="https://unsplash.com/photo-..."
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setProductModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
