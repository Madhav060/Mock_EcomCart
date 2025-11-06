const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  total: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate total before saving
cartSchema.pre('save', async function(next) {
  if (this.items.length > 0) {
    await this.populate('items.product');
    this.total = this.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
  } else {
    this.total = 0;
  }
  next();
});

module.exports = mongoose.model('Cart', cartSchema);