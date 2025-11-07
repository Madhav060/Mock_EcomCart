const Order = require('../models/Order');
const Cart = require('../models/Cart');
// 1. Import the Product model
const Product = require('../models/Product');

// Generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// @desc    Process checkout
// @route   POST /api/checkout
// @access  Private
const processCheckout = async (req, res) => {
  try {
    // === MODIFIED: Get user info from req.user (from 'protect' middleware) ===
    const { name: customerName, email: customerEmail } = req.user;
    const userId = req.user._id;

    // === REMOVED: Validation for req.body.customerName and customerEmail ===
    // We trust req.user, which is guaranteed by the 'protect' middleware.

    // Get cart
    const cart = await Cart.findOne({ userId }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // =================================================================
    // === (Stock validation logic remains unchanged) ===
    // =================================================================
    const stockUpdatePromises = [];
    
    // Use a for...of loop to allow for async checks
    for (const item of cart.items) {
      const product = item.product;
      const requestedQuantity = item.quantity;

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `One of your cart items (ID: ${item.product}) no longer exists.`
        });
      }

      // Final stock check
      if (product.stock < requestedQuantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Only ${product.stock} left.`
        });
      }

      // Decrement stock and add the save promise to the array
      product.stock -= requestedQuantity;
      stockUpdatePromises.push(product.save());
    }

    // Wait for all product stock updates to complete
    await Promise.all(stockUpdatePromises);
    // =================================================================
    // === End of stock logic ===
    // =================================================================


    // Prepare order items
    const orderItems = cart.items.map(item => ({
      productId: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity
    }));

    // Calculate total
    const total = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    // Create order
    const order = await Order.create({
      userId,
      orderNumber: generateOrderNumber(),
      customerName, // This now securely comes from req.user
      customerEmail, // This now securely comes from req.user
      items: orderItems,
      total,
      status: 'completed'
    });

    // Clear cart after successful order
    cart.items = [];
    cart.total = 0;
    await cart.save();

    // Populate product details in order
    await order.populate('items.productId');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        items: order.items,
        total: order.total,
        timestamp: order.createdAt,
        orderId: order._id
      }
    });
  } catch (error) {
    console.error('Error processing checkout:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/checkout/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/checkout
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).populate('items.productId');
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get current user's orders
// @route   GET /api/checkout/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.productId');
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  processCheckout,
  getOrder,
  getOrders,
  getMyOrders
};