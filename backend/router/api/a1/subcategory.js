const express = require('express');
const router = express.Router();
const {subcategoryController} = require('../../../controller');

 
// Example routes
router.post('/', subcategoryController.createSubcategory);
router.get('/', subcategoryController.getSubcategories);
router.get('/:id', subcategoryController.getSubcategory);
router.put('/:id', subcategoryController.updateSubcategory);
router.delete('/:id', subcategoryController.deleteSubcategory);

module.exports = router;