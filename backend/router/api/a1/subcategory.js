const express = require('express');
const router = express.Router();
const {subcategoryController} = require('../../../controller');
const upload = require('../../../middleware/upload');
const auth = require('../../../middleware/auth');

// Example routes
router.post('/CreateSubcat', auth(['admin','seller']), upload.single("image"), subcategoryController.createSubcategory);
router.get('/getall', subcategoryController.getallsubcategorywithoutaccess);
router.get('/getSubcategories', auth(['admin','seller']), subcategoryController.getSubcategories);
router.get('/:id', auth(['admin','seller']), subcategoryController.getSubcategory);
router.put('/updateSubcategory/:id', auth(['admin','seller']), upload.single("image"), subcategoryController.updateSubcategory);
router.delete('/deleteSubcategory/:id', auth(['admin','seller']), subcategoryController.deleteSubcategory);

module.exports = router;
