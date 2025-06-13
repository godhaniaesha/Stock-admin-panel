const express = require('express');
const router = express.Router();

const { dashboardController } = require('../../../controller');
const auth = require('../../../middleware/auth');

router.get('/get', auth(['admin',"seller"]), dashboardController.dashboard);


module.exports = router;
