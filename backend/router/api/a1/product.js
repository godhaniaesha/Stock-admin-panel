const express = require('express');
const router = express.Router();

const { productController } = require('../../../controller');

// Create new product
router.post('/add', productController.createProduct);

// Get all products
router.get('/get', productController.getAllProducts);

// Get product by ID
router.get('/get/:id', productController.getProductById);

// Update product
router.put('/update/:id', productController.updateProduct);

// Delete product
router.delete('/delete/:id', productController.deleteProduct);

// Get active products only
router.get('/active', productController.getActiveProducts);

module.exports = router;
