const express = require('express');
const  router = express.Router();
const {categoryController} = require('../../../controller');
const upload = require('../../../middleware/upload');
const auth = require('../../../middleware/auth');
// If using multer for file upload
// const upload = require('../middleware/upload'); 

router.post('/createCategory',auth(['admin','seller']),  upload.single("image"),categoryController.createCategory);
router.get('/getall', categoryController.getallcategorywithoutaccess);
router.get('/', auth(['admin','seller']), categoryController.getCategories);
router.get('/:id',auth(['admin','seller']), categoryController.getCategory);
router.put('/:id',  upload.single("image"), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;