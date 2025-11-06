import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCartItem, removeFromCart } from '../redux/slices/cartSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const [updating, setUpdating] = useState(false);

  const handleUpdateQuantity = async (newQuantity) => {
    if (newQuantity < 1) return;
    setUpdating(true);
    try {
      await dispatch(updateCartItem({ 
        id: item._id, 
        quantity: newQuantity 
      })).unwrap();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      await dispatch(removeFromCart(item._id)).unwrap();
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const subtotal = item.product.price * item.quantity;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* Product Image */}
      <img 
        src={item.product.image} 
        alt={item.product.name}
        className="w-24 h-24 object-cover rounded-lg"
      />
      
      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {item.product.name}
        </h3>
        <p className="text-green-600 font-semibold">
          ${item.product.price.toFixed(2)}
        </p>
      </div>
      
      {/* Quantity Controls */}
      <div className="flex items-center border border-gray-300 rounded-lg">
        <button
          onClick={() => handleUpdateQuantity(item.quantity - 1)}
          disabled={updating || item.quantity <= 1}
          className="px-3 py-2 bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-l-lg transition-colors"
        >
          -
        </button>
        <span className="px-6 py-2 text-lg font-semibold">
          {item.quantity}
        </span>
        <button
          onClick={() => handleUpdateQuantity(item.quantity + 1)}
          disabled={updating}
          className="px-3 py-2 bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-r-lg transition-colors"
        >
          +
        </button>
      </div>
      
      {/* Subtotal */}
      <div className="text-right">
        <p className="text-xs text-gray-500 mb-1">Subtotal:</p>
        <p className="text-xl font-bold text-gray-800">
          ${subtotal.toFixed(2)}
        </p>
      </div>
      
      {/* Remove Button */}
      <button
        onClick={handleRemove}
        disabled={updating}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;