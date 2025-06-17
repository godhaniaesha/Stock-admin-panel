const express = require('express');
const router = express.Router();
const {inventoryController} = require('../../../controller');
const auth = require('../../../middleware/auth');

router.post('/create',auth(['admin','seller']), inventoryController.createInventory);
router.get('/getlow', auth(['admin','seller']),inventoryController.getLowInventory);
// router.get('/',auth(['admin','seller']),  inventoryController.getOwnInventory);
router.get('/',auth(['admin','seller']), inventoryController.getInventories);
router.get('/:id', inventoryController.getInventory);
router.put('/:id', inventoryController.updateInventory);
router.delete('/:id', inventoryController.deleteInventory);

module.exports = router;