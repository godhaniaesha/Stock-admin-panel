const express = require('express');
const router = express.Router();

const { productController } = require('../../../controller');
const upload = require("../../../middleware/upload");
const auth = require('../../../middleware/auth');

// Create new product
router.post('/addProduct', auth(['admin', 'seller']), upload.array('images'), productController.createProduct);
router.get('/getall', productController.getallwAccess);

// Get all products
router.get('/getProduct', auth(['admin', 'seller']), productController.getAllProducts);

// Get product by ID
router.get('/get/:id', auth(['admin', 'seller']), productController.getProductById);

// Update product
router.put('/update/:id', auth(['admin', 'seller']), upload.array('images'), productController.updateProduct);

// Delete product
router.delete('/delete/:id', auth(['admin', 'seller']), productController.deleteProduct);

// Get active products only
router.get('/active', productController.getActiveProducts);

module.exports = router;
