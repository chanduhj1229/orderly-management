
const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  actionType: {
    type: String,
    enum: ['Added', 'Updated', 'Deleted'],
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Log', LogSchema);
