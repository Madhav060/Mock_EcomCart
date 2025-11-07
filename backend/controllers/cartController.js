const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    let cart = await Cart.findOne({ userId }).populate('items.product');
    
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id.toString();

    // Validate input
    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide productId and quantity'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // === STOCK LOGIC IMPROVEMENT ===
    // Get or create cart first
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
      
    let newQuantity;
    if (existingItemIndex > -1) {
      // Item exists, calculate new total quantity
      newQuantity = cart.items[existingItemIndex].quantity + quantity;
    } else {
      // New item
      newQuantity = quantity;
    }

    // Check stock against the *total* quantity
    if (product.stock < newQuantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${product.stock} available.`
      });
    }

    // Update or add the item
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity: newQuantity });
    }
    // === END OF STOCK LOGIC IMPROVEMENT ===

    await cart.save();
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params; // cart item _id
    const { quantity } = req.body;
    const userId = req.user._id.toString();

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === id
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // === STOCK CHECK ON UPDATE ===
    const product = await Product.findById(cart.items[itemIndex].product);
    if (product.stock < quantity) {
       return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${product.stock} available.`
      });
    }
    // === END STOCK CHECK ===

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Cart updated',
      data: cart
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params; // cart item _id
    const userId = req.user._id.toString();

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== id);
    await cart.save();
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    cart.total = 0;
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      data: cart
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};