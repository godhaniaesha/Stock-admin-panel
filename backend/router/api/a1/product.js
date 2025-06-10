const express = require('express');
const router = express.Router();

const { productController } = require('../../../controller');
const upload = require("../../../middleware/upload");

// Create new product
router.post('/addProduct', upload.array('images') ,productController.createProduct);

// Get all products
router.get('/getProduct', productController.getAllProducts);

// Get product by ID
router.get('/get/:id', productController.getProductById);

// Update product
router.put('/update/:id',upload.array('images'), productController.updateProduct);

// Delete product
router.delete('/delete/:id', productController.deleteProduct);

// Get active products only
router.get('/active', productController.getActiveProducts);

module.exports = router;
