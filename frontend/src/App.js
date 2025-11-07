import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux'; // Import useDispatch
import store from './redux/store';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // <-- Import Footer
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import OrderHistory from './components/OrderHistory';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import api from './services/api'; // Import the api service
import { setCartItems, clearCart } from './redux/slices/cartSlice'; // Import Redux actions

/**
 * We create an AppContent component that lives inside the Provider
 * This allows us to use hooks like useDispatch.
 */
function AppContent() {
  const dispatch = useDispatch();
  // Check auth state from localStorage on initial load
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        return !!user.token; // Set to true if token exists
      }
    } catch (error) {
      console.error('Failed to parse userInfo:', error);
      localStorage.removeItem('userInfo');
    }
    return false; // Default to false
  });

  // Effect to fetch cart on auth change
  useEffect(() => {
    if (isAuthenticated) {
      const fetchInitialCart = async () => {
        try {
          const response = await api.get('/cart');
          if (response.data.success) {
            dispatch(setCartItems(response.data.data.items || []));
          }
        } catch (cartError) {
          console.error('Failed to fetch initial cart:', cartError);
          // Check if it was an auth error
          if (cartError.response?.status === 401) {
             // The API interceptor will handle the redirect, 
             // but we should still clear local state.
             dispatch(clearCart());
             setIsAuthenticated(false);
          }
        }
      };
      fetchInitialCart();
    } else {
      // If user logs out or auth status changes to false, clear the cart in Redux
      dispatch(clearCart());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <Router>
      <div className="App min-h-screen bg-gray-50 flex flex-col"> {/* <-- Updated layout classes */}
        <Navbar 
          isAuthenticated={isAuthenticated} 
          setIsAuthenticated={setIsAuthenticated} 
        />
        
        <main className="flex-grow"> {/* <-- Added main and flex-grow */}
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
        </main>

        <Footer /> {/* <-- Added Footer */}
      </div>
    </Router>
  );
}

// The main App component just provides the Redux store
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;