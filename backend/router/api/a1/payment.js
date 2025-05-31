const express = require('express');
const router = express.Router();

const { paymentController } = require('../../../controller');

// Create new order
router.post('/add', paymentController.createPayment);

// Get all orders
router.get('/get', paymentController.getAllPayments);

// Get order by ID
router.get('/get/:id', paymentController.getPaymentById);

// Update order
router.put('/update/:id', paymentController.updatePaymentStatus);

// Delete order
router.delete('/delete/:id', paymentController.deletePayment);



module.exports = router;
