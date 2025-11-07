import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch
import api from '../services/api';
import { setCartItems } from '../redux/slices/cartSlice'; // Import the action

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const dispatch = useDispatch(); // Get the dispatch function

  // Check if user is logged in
  const isAuthenticated = () => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (!userInfo) return false;
      
      const user = JSON.parse(userInfo);
      return !!(user && user.token);
    } catch {
      return false;
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/products');
      
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    // Check authentication first
    if (!isAuthenticated()) {
      alert('Please login to add items to cart');
      window.location.href = '/login';
      return;
    }

    try {
      setAddingToCart(productId);
      setError(null);

      console.log('Adding product to cart:', productId);
      
      const response = await api.post('/cart', {
        productId: productId,
        quantity: 1
      });

      console.log('✅ Added to cart:', response.data);

      if (response.data.success) {
        alert('Product added to cart successfully!');
        // Dispatch the updated cart items to Redux
        dispatch(setCartItems(response.data.data.items));
      }
    } catch (err) {
      console.error('❌ Error adding to cart:', err);
      
      if (err.response) {
        const message = err.response.data?.message || 'Failed to add to cart';
        
        if (err.response.status === 401) {
          alert('Your session has expired. Please login again.');
          localStorage.removeItem('userInfo');
          window.location.href = '/login';
        } else {
          alert(message);
        }
      } else if (err.request) {
        alert('Cannot connect to server. Please check your connection.');
      } else {
        alert('An error occurred. Please try again.');
      }
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 text-center mb-4">{error}</p>
        <button 
          onClick={fetchProducts}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Our Products
      </h2>
      
      {/* Login Prompt Banner */}
      {!isAuthenticated() && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 mb-8 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white font-medium text-center sm:text-left">
              ⚠️ Please login to add items to cart
            </p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-2 px-6 rounded-lg transition shadow-md"
            >
              Login Now
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div 
            key={product._id} 
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
          >
            {/* Product Image */}
            <div className="relative h-48 bg-gray-200 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
            </div>

            {/* Product Info */}
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
                {product.description}
              </p>

              <div className="mt-auto">
                {/* Price */}
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  ${product.price.toFixed(2)}
                </p>

                {/* Stock Status */}
                <p className={`text-sm font-medium mb-3 ${
                  product.stock === 0 
                    ? 'text-red-600' 
                    : product.stock < 20 
                    ? 'text-yellow-600' 
                    : 'text-green-600'
                }`}>
                  {product.stock === 0 
                    ? '❌ Out of Stock' 
                    : product.stock < 20 
                    ? `⚠️ Only ${product.stock} left!` 
                    : `✓ In Stock (${product.stock})`
                  }
                </p>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product._id)}
                  disabled={addingToCart === product._id || product.stock === 0}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    addingToCart === product._id
                      ? 'bg-blue-400 cursor-wait'
                      : product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {addingToCart === product._id ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </span>
                  ) : product.stock === 0 ? (
                    'Out of Stock'
                  ) : (
                    'Add to Cart'
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && !loading && (
        <div className="text-center py-20">
          <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Check back later for new products!</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;