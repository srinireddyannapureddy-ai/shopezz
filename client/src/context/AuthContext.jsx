import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('shopez_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync state with localStorage on load
  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem('shopez_user');
      const storedToken = localStorage.getItem('shopez_token');
      
      if (storedUser && storedToken) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } catch (e) {
          // JSON parsing failed, clear corrupted data
          localStorage.removeItem('shopez_user');
          localStorage.removeItem('shopez_token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // Login User
  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token: userToken, ...userData } = response.data;
      
      localStorage.setItem('shopez_token', userToken);
      localStorage.setItem('shopez_user', JSON.stringify(userData));
      
      setToken(userToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message };
    }
  };

  // Register User
  const register = async (username, email, password, confirmPassword) => {
    try {
      const response = await api.post('/api/auth/register', {
        username,
        email,
        password,
        confirmPassword
      });
      const { token: userToken, ...userData } = response.data;

      localStorage.setItem('shopez_token', userToken);
      localStorage.setItem('shopez_user', JSON.stringify(userData));

      setToken(userToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed.';
      return { success: false, message };
    }
  };

  // Admin Login
  const adminLogin = async (email, password) => {
    try {
      const response = await api.post('/api/admin/login', { email, password });
      const { token: adminToken, ...adminData } = response.data;

      localStorage.setItem('shopez_token', adminToken);
      localStorage.setItem('shopez_user', JSON.stringify(adminData));

      setToken(adminToken);
      setUser(adminData);
      return { success: true };
    } catch (error) {
      console.error('Admin Login error:', error);
      const message = error.response?.data?.message || 'Admin login failed.';
      return { success: false, message };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('shopez_token');
    localStorage.removeItem('shopez_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        adminLogin,
        logout,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
