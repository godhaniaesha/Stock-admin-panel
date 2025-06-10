const express = require('express');
const router = express.Router();
const {inventoryController} = require('../../../controller');

router.post('/create', inventoryController.createInventory);
router.get('/getlow', inventoryController.getLowInventory);
router.get('/', inventoryController.getInventories);
router.get('/:id', inventoryController.getInventory);
router.put('/:id', inventoryController.updateInventory);
router.delete('/:id', inventoryController.deleteInventory);

module.exports = router;