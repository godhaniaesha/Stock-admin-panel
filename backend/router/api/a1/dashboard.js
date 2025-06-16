const express = require('express');
const router = express.Router();

const { dashboardController } = require('../../../controller');
const auth = require('../../../middleware/auth');

router.get('/get', auth(['admin',"seller"]), dashboardController.dashboard);
router.get('/Sales_Performance', auth(['admin',"seller"]), dashboardController.Sales_Performance);
router.get('/getAllSellerOrder', auth(['admin',"seller"]), dashboardController.getAllSellerOrder);


module.exports = router;
