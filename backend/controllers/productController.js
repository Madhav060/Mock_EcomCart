const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const createProduct = async (req, res) => {
  try {
    let products;

    // If user sends an array, do bulk insert
    if (Array.isArray(req.body)) {
      products = await Product.insertMany(req.body);
    } else {
      // Otherwise, single product
      products = await Product.create(req.body);
    }

    res.status(201).json({
      success: true,
      message: Array.isArray(req.body)
        ? `${products.length} products added successfully`
        : 'Product created successfully',
      data: products,
    });
  } catch (error) {
    console.error('Error creating product(s):', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
}

module.exports = {
  getProducts,
  getProduct,
 createProduct
};