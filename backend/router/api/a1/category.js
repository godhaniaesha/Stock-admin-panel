const express = require('express');
const  router = express.Router();
const {categoryController} = require('../../../controller');
const upload = require('../../../middleware/upload');
const auth = require('../../../middleware/auth');
// If using multer for file upload
// const upload = require('../middleware/upload'); 

router.post('/createCategory',  upload.single("image"),categoryController.createCategory);
router.get('/', auth(['admin','seller']), categoryController.getCategories);
router.get('/:id', categoryController.getCategory);
router.put('/:id',  upload.single("image"), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;