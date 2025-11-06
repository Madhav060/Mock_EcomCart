const express = require('express');
const router = express.Router();
const {
  processCheckout,
  getOrder,
  getOrders,
  getMyOrders
} = require('../controllers/checkoutController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.post('/', protect, processCheckout);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);

module.exports = router;