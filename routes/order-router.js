const express = require('express');
const { placeorder, getallorder, getorderbyId } = require('../controllers/order-controller'); // Adjust path if necessary
const {  verifyToken } = require('../middlewares/auth-middleware');
const router = express.Router();

router.post('/placeorder',verifyToken, placeorder);
router.get('/getallorders',verifyToken, getallorder);
router.get('/orders/customer/:customerId',verifyToken, getorderbyId);

module.exports = router;