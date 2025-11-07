import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 1. Import the centralized 'api' instance instead of 'axios'
import api from '../services/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // 2. Use the 'api' instance (no headers needed)
      // 3. Use the correct endpoint '/checkout/myorders'
      const response = await api.get('/checkout/myorders');
      
      // 4. Access the 'data' array from the response object
      setOrders(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load order history');
      setLoading(false);
      if (err.response?.status === 401) {
        // 5. Remove the correct 'userInfo' key on auth failure
        localStorage.removeItem('userInfo');
        navigate('/login');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900">No orders yet</h3>
          <p className="mt-2 text-gray-500">Start shopping to see your order history</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow-md rounded-lg overflow-hidden border">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    {/* 6. Use the correct 'orderNumber' field */}
                    <p className="font-mono text-sm font-medium">{order.orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4">
                <h3 className="font-semibold mb-3">Items ({order.items?.length || 0})</h3>
                <div className="space-y-3">
                  {/* 7. Use item._id for a stable React key instead of index */}
                  {order.items?.map((item) => (
                    <div key={item._id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${item.price?.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">
                          ${(item.price * item.quantity).toFixed(2)} total
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="px-6 py-4 bg-gray-50 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Customer</p>
                    <p className="text-sm">{order.customerName}</p>
                    {/* 8. Use the correct 'customerEmail' field */}
                    <p className="text-sm text-gray-600">{order.customerEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 font-medium mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${order.total?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;