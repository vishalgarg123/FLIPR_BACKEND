const cartModel = require('../models/cart-model');
const productModel = require('../models/product-model');
const mongoose = require('mongoose');

// Add cart
exports.addCart = async (req, res) => {
  const { userId, products } = req.body;

  try {
    // Validate the input
    if (!userId || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'User ID and a non-empty array of products are required' });
    }

    // Find the user's cart, or create a new one if it doesn't exist
    let cart = await cartModel.findOne({ userId });
    if (!cart) {
      cart = new cartModel({ userId, products: [] });
    }

    // Process each product
    for (const productData of products) {
      const { productId, quantity } = productData;

      // Validate each product's data
      if (!productId || !quantity) {
        return res.status(400).json({ error: 'Each product must have a Product ID and quantity' });
      }

      // Convert the quantity to a number to prevent string concatenation issues
      const parsedQuantity = parseInt(quantity, 10);
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        return res.status(400).json({ error: 'Quantity must be a positive integer for each product' });
      }

      // Find the product by ID
      const product = await productModel.findById(productId);
      if (!product) return res.status(404).json({ error: `Product with ID ${productId} not found` });

      // Check if the product is already in the cart
      const existingProductIndex = cart.products.findIndex(p => p.productId.equals(productId));
      if (existingProductIndex > -1) {
        // If the product is already in the cart, update the quantity
        cart.products[existingProductIndex].quantity += parsedQuantity;
      } else {
        // Otherwise, add the new product to the cart
        cart.products.push({ productId, quantity: parsedQuantity });
      }
    }

    // Save the updated cart
    await cart.save();

    // Send a success response
    res.status(200).json({ message: 'Products added/updated in cart', cart });

  } catch (err) {
    // Handle server errors
    console.error('Error: ', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};


// Update cart
exports.updateCart = async (req, res) => {
  try {
    const { userId, products } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Products must be a non-empty array' });
    }

    // Validate each product in the products array
    for (const product of products) {
      const { productId, quantity } = product;

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: `Invalid product ID format: ${productId}` });
      }

      if (typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ error: `Invalid quantity for product ID: ${productId}` });
      }
    }

    // Find the user's cart, or create a new one if it doesn't exist
    let cart = await cartModel.findOne({ userId });
    if (!cart) {
      cart = new cartModel({ userId, products: [] });
    }

    // Process each product
    for (const productData of products) {
      const { productId, quantity } = productData;

      const productIndex = cart.products.findIndex(p => p.productId.toString() === productId.toString());

      if (quantity === 0) {
        // Remove product from the cart if quantity is 0
        if (productIndex >= 0) {
          cart.products.splice(productIndex, 1);
        }
      } else {
        // Update quantity if product is already in the cart, or add it if not
        if (productIndex >= 0) {
          cart.products[productIndex].quantity = quantity;
        } else {
          cart.products.push({ productId, quantity });
        }
      }
    }

    // Save the updated cart
    await cart.save();

    // Send a success response with the updated cart
    res.status(200).json({
      message: 'Cart updated successfully',
      cart: cart.products
    });

  } catch (err) {
    // Handle server errors
    console.error('Error: ', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};


// Get cart
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const cart = await cartModel.findOne({ userId }).populate('products.productId');
    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ message: 'Cart is empty' });
    }

    const totalAmount = cart.products.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);

    return res.json({
      cart: cart.products,
      totalAmount
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Delete from cart
exports.deleteCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid user ID or product ID format' });
    }

    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId.toString());
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    cart.products.splice(productIndex, 1);
    await cart.save();

    return res.json({
      message: 'Product removed from cart successfully',
      cart: cart.products
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
};
