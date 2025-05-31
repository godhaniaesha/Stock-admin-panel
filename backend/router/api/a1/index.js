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
// const coupon = require("./coupon");
// const product = require("./product");
// const cart = require("./cart");
// const wishlist = require("./wishlist");
// const order = require("./order");
// const payment = require("./payment");



router.use("/user", user);
router.use("/coupon", coupon);
router.use("/product", product);
router.use("/cart", cart);
router.use("/wishlist", wishlist);
router.use("/order", order);
router.use("/payment", payment);



module.exports = router;