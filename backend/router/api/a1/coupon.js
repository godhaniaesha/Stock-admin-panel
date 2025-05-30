const express = require('express');
const router = express.Router();

const { couponController } = require('../../../controller');

// Create new product
router.post('/add', couponController.createCoupon);

// Get all products
router.get('/get', couponController.getAllCoupons);

// Get product by ID
router.get('/get/:id', couponController.getCouponById);

// Update product
router.put('/update/:id', couponController.updateCoupon);

// Delete product
router.delete('/delete/:id', couponController.deleteCoupon);

// Get active products only
router.get('/active', couponController.getActiveCoupons);

module.exports = router;
// createCoupon,
// getAllCoupons,
// getCouponById,
// updateCoupon,
// deleteCoupon,
// getActiveCoupons