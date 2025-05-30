const express = require('express');
const router = express.Router();
const {categoryController} = require('../../../controller');
// If using multer for file upload
// const upload = require('../middleware/upload'); 

router.post('/createCategory',  categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);
router.put('/:id',  categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;