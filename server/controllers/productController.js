
const Product = require('../models/Product');
const Log = require('../models/Log');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Add a product
// @route   POST /api/products
// @access  Public
exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    
    // Create log entry
    await Log.create({
      actionType: 'Added',
      productId: product._id,
      productName: product.name
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'No product found'
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Create log entry
    await Log.create({
      actionType: 'Updated',
      productId: product._id,
      productName: updatedProduct.name
    });

    res.status(200).json({
      success: true,
      data: updatedProduct
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'No product found'
      });
    }

    await product.deleteOne();

    // Create log entry
    await Log.create({
      actionType: 'Deleted',
      productId: product._id,
      productName: product.name
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
