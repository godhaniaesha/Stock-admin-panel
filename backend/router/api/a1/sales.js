const express = require('express');
const router = express.Router();

const { salesController } = require('../../../controller');


router.get("/totalSales", salesController.getTotalSales);
router.get("/totalOrders", salesController.getTotalOrders);
router.get("/averageOrderValue", salesController.getAverageOrderValue);
router.get("/conversionRate", salesController.getConversionRate);

module.exports = router;