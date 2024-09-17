const orderModel = require('../models/order-model'); // Ensure the path is correct

// Function to place a new order
exports.placeorder = async (req, res) => {
  try {
    const { userId, products, shippingDetails, totalPrice } = req.body;

    if (!userId || !products || !shippingDetails || !totalPrice) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newOrder = new orderModel({
      userId,
      products,
      shippingDetails,
      totalPrice,
      status: 'Pending',
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Function to get all orders
exports.getallorder = async (req, res) => {
  try {
    const orders = await orderModel.find()
      .populate({
        path: 'userId',
        select: 'name email',
      })
      .populate({
        path: 'products.productId',
        select: 'name price',
      });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Function to get orders by customerId
exports.getorderbyId = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      return res.status(400).json({ message: 'Customer ID is required' });
    }

    const orders = await orderModel.find({ userId: customerId })
      .populate({
        path: 'userId',
        select: 'name email',
      })
      .populate({
        path: 'products.productId',
        select: 'name price',
      });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this customer' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders for customer:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
