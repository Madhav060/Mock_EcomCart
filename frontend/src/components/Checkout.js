import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../services/api'; // Use the authenticated api utility
import { clearCart } from '../redux/slices/cartSlice'; // We still need this to clear the redux state

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // === (Cart state remains unchanged) ===
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [cartLoading, setCartLoading] = useState(true);
  
  // === MODIFIED: Remove formData, add user state ===
  const [user, setUser] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderData, setOrderData] = useState(null);

  // === MODIFIED: Fetch cart AND user info on load ===
  useEffect(() => {
    // 1. Get user info from localStorage first
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      } else {
        // If no user, redirect to login immediately
        alert('You must be logged in to check out.');
        navigate('/login');
        return; // Stop execution
      }
    } catch (e) {
      console.error('Failed to parse user info', e);
      localStorage.removeItem('userInfo');
      navigate('/login');
      return; // Stop execution
    }

    // 2. If user exists, fetch their cart
    const fetchCart = async () => {
      try {
        setCartLoading(true);
        setError(null);
        
        const response = await api.get('/cart');
        
        if (response.data.success) {
          const cart = response.data.data;
          setCartItems(cart.items || []);
          
          const cartTotal = (cart.items || []).reduce((sum, item) => {
             const price = item.product?.price || 0;
             const quantity = item.quantity || 0;
             return sum + (price * quantity);
          }, 0);
          setTotal(cartTotal);
        }
      } catch (err) {
        console.error('Error fetching cart for checkout:', err);
        if (err.response?.status === 401) {
          // This will be caught by the api interceptor, but good to have
          navigate('/login');
        } else {
          setError('Failed to load cart data. Please try again.');
        }
      } finally {
        setCartLoading(false);
      }
    };
    
    fetchCart();
  }, [navigate]);


  // === REMOVED: handleChange function is no longer needed ===

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // === REMOVED: All form validation ===

    // === (Cart empty check remains unchanged) ===
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      setLoading(false);
      return;
    }

    try {
      // === MODIFIED: Send an empty object. Backend uses token. ===
      const response = await api.post(
        '/checkout',
        {} // Send empty object
      );

      // (Rest of the function remains unchanged)
      dispatch(clearCart());
      setCartItems([]);
      setTotal(0);

      setOrderComplete(true);
      setOrderData(response.data.data);
      setLoading(false);

      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'Failed to process checkout. Please try again.');
      setLoading(false);
    }
  };

  // --- RENDER LOGIC ---

  if (orderComplete && orderData) {
    // (This part was correct, no changes needed)
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {/* ... Order success message ... */}
             <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Order Placed Successfully!
              </h2>
              <p className="text-gray-600 mb-4">
                Thank you for your purchase, {orderData.customerName}
              </p>
              <p className="text-sm text-gray-500">
                Order confirmation sent to {orderData.customerEmail}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="text-left">
                <div className="flex justify-between items-center mb-4 pb-4 border-b">
                  <span className="text-sm text-gray-600">Order Number</span>
                  <span className="font-mono font-semibold">{orderData.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center mb-4 pb-4 border-b">
                  <span className="text-sm text-gray-600">Order Date</span>
                  <span className="font-medium">
                    {new Date(orderData.timestamp).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${orderData.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Redirecting to order history in 3 seconds...
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/orders')}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View Order History
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartLoading || !user) { // Show loading if cart OR user is loading
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !cartLoading) {
    // (This part was correct, no changes needed)
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
           <div className="bg-gray-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Add some products to your cart before checking out
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Info Display */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Customer Information</h2>

            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {/* === MODIFIED: Display user info instead of form === */}
            <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg border">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Checking out as
                </label>
                <p className="text-lg font-semibold text-gray-900">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-lg text-gray-900">{user.email}</p>
              </div>
            </div>
            {/* === END MODIFICATION === */}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* === REMOVED: Form inputs === */}

              <div className="pt-6 border-t">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {/* (Cart items map remains unchanged) */}
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-4">
                  <img
                    src={item.product?.image || 'https://via.placeholder.com/80'}
                    alt={item.product?.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{item.product?.name}</h3>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    <p className="font-semibold text-blue-600">
                      ${(item.product?.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              {/* (Totals display remains unchanged) */}
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="border-t pt-2 flex justify-between items-center">
                <span className="text-xl font-bold">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;