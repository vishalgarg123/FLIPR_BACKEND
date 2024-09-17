const express = require('express');
const { addCart, getCart, updateCart, deleteCart } = require('../controllers/cart-controller');
const {  verifyToken } = require('../middlewares/auth-middleware'); // Ensure the path is correct
const router = express.Router();

// Add to cart
router.post('/add', verifyToken, addCart);

// Update cart
router.put('/update', verifyToken, updateCart);

// Delete from cart
router.delete('/delete', verifyToken, deleteCart);

// Get cart
router.get('/', verifyToken, getCart);

module.exports = router;