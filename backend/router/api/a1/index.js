const express = require("express");

const router = express.Router();

const user = require("./user");
const category = require('./category');
const subcategory = require('./subcategory');
const inventory = require('./inventory');


router.use("/user", user);
router.use('/category', category);
router.use('/subcategory', subcategory);
router.use('/inventory', inventory);


module.exports = router;