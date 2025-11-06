import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      {/* Product Image */}
      <div className="h-56 bg-gray-100 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>
      
      {/* Product Info */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs font-semibold text-blue-600 uppercase mb-2">
          {product.category}
        </span>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">
          {product.description}
        </p>
        
        {/* Price and Button */}
        <div className="flex justify-between items-center mt-auto">
          <span className="text-2xl font-bold text-green-600">
            ${product.price.toFixed(2)}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={loading || product.stock === 0}
            className={`
              px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200
              ${added 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
              ${(loading || product.stock === 0) && 'opacity-50 cursor-not-allowed'}
            `}
          >
            {loading ? '...' : added ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
        
        {/* Stock Warning */}
        {product.stock < 10 && product.stock > 0 && (
          <p className="text-xs text-orange-600 font-semibold mt-2">
            Only {product.stock} left!
          </p>
        )}
        {product.stock === 0 && (
          <p className="text-xs text-red-600 font-semibold mt-2">
            Out of Stock
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;