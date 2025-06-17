const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');

const { orderController } = require('../../../controller');

// Create new order
router.post('/add', orderController.createOrder);

// Get all orders
router.get('/get', orderController.getAllOrders);

// // Get orders by sellerId
router.get('/seller/:sellerId', orderController.getallorderbyseller);

// Get order by ID
router.get('/get/:id', orderController.getOrderById);

// Update order
router.put('/update/:id', orderController.updateOrder);

// Delete order
router.delete('/delete/:id', orderController.deleteOrder);

// // Get orders by user ID
router.get('/user/:userId', orderController.getOrdersByUser);

// // Get all orders by status
// router.get('/status/:status', orderController.getOrdersByStatus);

module.exports = router;