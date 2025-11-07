import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api';
import { setCartItems, selectCartItems } from '../redux/slices/cartSlice';
import toast from 'react-hot-toast'; // <-- Import toast
import { useNavigate } from 'react-router-dom'; // <-- Import useNavigate

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null); // Use this for all cart operations
  const dispatch = useDispatch();
  const navigate = useNavigate(); // <-- Get navigate function

  const cartItems = useSelector(selectCartItems);

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
    if (!isAuthenticated()) {
      toast.error('Please login to add items to cart'); // <-- Use toast
      navigate('/login'); // <-- Navigate
      return;
    }

    try {
      setAddingToCart(productId);
      setError(null);

      const response = await api.post('/cart', {
        productId: productId,
        quantity: 1
      });

      if (response.data.success) {
        dispatch(setCartItems(response.data.data.items));
        toast.success('Product added to cart!'); // <-- Use toast
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      
      if (err.response) {
        const message = err.response.data?.message || 'Failed to add to cart';
        
        if (err.response.status === 401) {
          toast.error('Your session has expired. Please login again.'); // <-- Use toast
          localStorage.removeItem('userInfo');
          navigate('/login'); // <-- Navigate
        } else {
          toast.error(message); // <-- Use toast
        }
      } else if (err.request) {
        toast.error('Cannot connect to server. Please check your connection.'); // <-- Use toast
      } else {
        toast.error('An error occurred. Please try again.'); // <-- Use toast
      }
    } finally {
      setAddingToCart(null);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      setAddingToCart(cartItemId); 
      const response = await api.delete(`/cart/${cartItemId}`);
      if (response.data.success) {
        dispatch(setCartItems(response.data.data.items));
        toast.success('Item removed from cart'); // <-- Use toast
      }
    } catch (err) {
      console.error('Error removing item:', err);
      toast.error('Failed to remove item'); // <-- Use toast
    } finally {
      setAddingToCart(null);
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity, productId) => {
    if (newQuantity < 1) {
      await handleRemoveItem(cartItemId);
      return;
    }

    try {
      setAddingToCart(productId); 
      const response = await api.put(`/cart/${cartItemId}`, {
        quantity: newQuantity
      });

      if (response.data.success) {
        dispatch(setCartItems(response.data.data.items));
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      toast.error(err.response?.data?.message || 'Failed to update quantity'); // <-- Use toast
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
              onClick={() => navigate('/login')}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-2 px-6 rounded-lg transition shadow-md"
            >
              Login Now
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const cartItem = cartItems.find(item => item.product?._id === product._id);
          const isProcessing = addingToCart === product._id || addingToCart === cartItem?._id;

          return (
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

                  {/* Conditional Rendering: Show quantity controls or "Add to Cart" button */}
                  {isAuthenticated() && cartItem ? (
                    <div className="flex items-center justify-between">
                      <span className="text-lg text-gray-700 font-medium">Quantity:</span>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(cartItem._id, cartItem.quantity - 1, product._id)}
                          disabled={isProcessing}
                          className="px-3 py-2 bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-l-lg transition-colors"
                        >
                          -
                        </button>
                        <span className="px-5 py-2 text-lg font-semibold w-16 text-center">
                          {isProcessing ? (
                            <svg className="animate-spin h-5 w-5 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            cartItem.quantity
                          )}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(cartItem._id, cartItem.quantity + 1, product._id)}
                          disabled={isProcessing || cartItem.quantity >= product.stock}
                          className="px-3 py-2 bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-r-lg transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      disabled={isProcessing || product.stock === 0}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                        isProcessing
                          ? 'bg-blue-400 cursor-wait'
                          : product.stock === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                      }`}
                    >
                      {isProcessing ? (
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
                  )}
                </div>
              </div>
            </div>
          )
        })}
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