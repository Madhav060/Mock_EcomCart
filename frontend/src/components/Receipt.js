import React from 'react';

const Receipt = ({ order, onClose }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 text-center rounded-t-2xl">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-2">Order Confirmed!</h2>
          <p className="text-green-100">Thank you for your purchase</p>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Order Details */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
              Order Details
            </h3>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-semibold">Order Number:</span> {order.orderNumber}</p>
              <p><span className="font-semibold">Date:</span> {formatDate(order.timestamp)}</p>
              <p><span className="font-semibold">Customer:</span> {order.customerName}</p>
              <p><span className="font-semibold">Email:</span> {order.customerEmail}</p>
            </div>
          </div>

          {/* Items Ordered */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
              Items Ordered
            </h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-green-600">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Amount</h3>
            <h2 className="text-4xl font-bold text-green-600">${order.total.toFixed(2)}</h2>
          </div>

          {/* Confirmation Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-gray-700 mb-2">
              A confirmation email has been sent to <span className="font-semibold">{order.customerEmail}</span>
            </p>
            <p className="text-gray-600 text-sm">Your order will be processed shortly.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 rounded-b-2xl">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg shadow-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;