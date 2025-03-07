
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please add a product price']
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  }
}, {
  timestamps: true // Automatically create createdAt and updatedAt fields
});

module.exports = mongoose.model('Product', ProductSchema);
