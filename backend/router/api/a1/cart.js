const express = require('express');
const router = express.Router();
const {cartController} = require('../../../controller');

router.post('/add', cartController.addToCart);
router.get('/get/:userId', cartController.getCart);
router.put('/update/:id', cartController.updateCartItem);
router.delete('/remove/:id', cartController.removeFromCart);

module.exports = router;
