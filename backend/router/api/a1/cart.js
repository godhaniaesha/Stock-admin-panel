const express = require('express');
const router = express.Router();
const {cartController} = require('../../../controller');

router.post('/addCart', cartController.addToCart);
router.get('/getCart/:userId', cartController.getCart);
router.put('/updateCart/:id', cartController.updateCartItem);
router.delete('/removeCart/:id', cartController.removeFromCart);

module.exports = router;
