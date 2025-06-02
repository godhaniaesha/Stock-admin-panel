const express = require('express');
const router = express.Router();
const {subcategoryController} = require('../../../controller');
const upload = require('../../../middleware/upload');

// Example routes
router.post('/createSubcategory', upload.single("image"), subcategoryController.createSubcategory);
router.get('/getSubcategories', subcategoryController.getSubcategories);
router.get('/:id', subcategoryController.getSubcategory);
router.put('/updateSubcategory/:id', upload.single("image"), subcategoryController.updateSubcategory);
router.delete('/deleteSubcategory/:id', subcategoryController.deleteSubcategory);

module.exports = router;