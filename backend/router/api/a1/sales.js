const express = require('express');
const router = express.Router();

const { salesController } = require('../../../controller');
const auth = require('../../../middleware/auth');


// router.get("/totalSales", salesController.getTotalSales);
// router.get("/totalOrders", salesController.getTotalOrders);
// router.get("/averageOrderValue", salesController.getAverageOrderValue);
// router.get("/conversionRate", salesController.getConversionRate);
// router.get("/salesOverTime", salesController.getSalesOverTime);
router.get("/salesMetrics",auth(['admin','seller']), salesController.getSalesMetrics);
// router.get("/salesOverTime1",auth(['admin','seller']), salesController.getOrdersAndSales);
router.get("/getAllSalesOrders",auth(['admin','seller']), salesController.getAllSalesOrders);
router.get("/getProductMovement",auth(['admin','seller']), salesController.getProductMovement);
module.exports = router;