const express = require('express');
const router = express.Router();
const {wishlistController} = require('../../../controller');

router.post('/add', wishlistController.addToWishlist);
router.get('/get/:userId', wishlistController.getWishlist);
router.delete('/remove/:id', wishlistController.removeFromWishlist);

module.exports = router;
