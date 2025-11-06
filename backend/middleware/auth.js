const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Validate token exists and is not undefined/null
      if (!token || token === 'undefined' || token === 'null') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token format. Please login again.'
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found. Please login again.'
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User account is deactivated'
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      
      let message = 'Not authorized, token failed';
      
      if (error.name === 'JsonWebTokenError') {
        message = 'Invalid token. Please login again.';
      } else if (error.name === 'TokenExpiredError') {
        message = 'Token expired. Please login again.';
      }
      
      return res.status(401).json({
        success: false,
        message,
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. No token provided. Please login.'
    });
  }
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized as admin'
    });
  }
};

module.exports = { protect, admin };