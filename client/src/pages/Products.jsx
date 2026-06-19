import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import SidebarFilters from '../components/SidebarFilters';

const Products = () => {
  const location = useLocation();
  
  // State for products list
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [sort, setSort] = useState('Popular');
  const [gender, setGender] = useState('All');

  // Parse URL parameters
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category') || '';
  const search = queryParams.get('search') || '';

  // Reset local filters if category changes in URL
  useEffect(() => {
    // Keep local states or reset gender on category change
    setGender('All');
  }, [category]);

  // Fetch products based on filters
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/api/products', {
          params: {
            category,
            search,
            gender: gender !== 'All' ? gender : undefined,
            sort
          }
        });
        setProducts(response.data);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [category, search, gender, sort]);

  return (
    <div className="container" style={{ minHeight: '80vh' }}>
      <div className="products-layout">
        {/* Sidebar Filters */}
        <SidebarFilters
          selectedSort={sort}
          onSortChange={setSort}
          selectedGender={gender}
          onGenderChange={setGender}
        />

        {/* Main Products Listing */}
        <main className="main-products-area">
          <div className="flex-between" style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700' }}>
              {category ? `${category} Products` : search ? `Search Results for "${search}"` : 'All Products'}
              <span style={{ fontSize: '14px', color: 'var(--gray-text)', marginLeft: '12px', fontWeight: '500' }}>
                ({products.length} {products.length === 1 ? 'item' : 'items'} found)
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="flex-center" style={{ height: '300px', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid var(--primary-light)',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
              <span style={{ color: 'var(--gray-text)', fontWeight: '600' }}>Loading products...</span>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try adjusting your search filters or browse other categories.</p>
              <button 
                className="btn-primary" 
                onClick={() => {
                  setSort('Popular');
                  setGender('All');
                }}
                style={{ padding: '10px 24px' }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid-products">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
