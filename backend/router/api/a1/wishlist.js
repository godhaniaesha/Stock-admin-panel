const express = require('express');
const router = express.Router();
const {wishlistController} = require('../../../controller');

router.post('/addWishlist', wishlistController.addToWishlist);
router.get('/getWishlist/:userId', wishlistController.getWishlist);
router.get('/getAllWishlists', wishlistController.getAllWishlists);
router.delete('/removeWishlist/:id', wishlistController.removeFromWishlist);

module.exports = router;