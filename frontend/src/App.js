import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import OrderHistory from './components/OrderHistory';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Provider store={store}>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Navbar 
            isAuthenticated={isAuthenticated} 
            setIsAuthenticated={setIsAuthenticated} 
          />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<ProductList />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            
            {/* Auth Routes - redirect to home if already logged in */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? (
                  <ProductList />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? (
                  <ProductList />
                ) : (
                  <Register setIsAuthenticated={setIsAuthenticated} />
                )
              } 
            />
            
            {/* Protected Routes - require authentication */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Profile setIsAuthenticated={setIsAuthenticated} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <OrderHistory />
                </ProtectedRoute>
              } 
            />

            {/* 404 Page */}
            <Route 
              path="*" 
              element={
                <div className="container mx-auto px-4 py-16 text-center">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-8">Page not found</p>
                  <a 
                    href="/" 
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Go Home
                  </a>
                </div>
              } 
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;