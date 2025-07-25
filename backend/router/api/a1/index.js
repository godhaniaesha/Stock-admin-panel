const express = require("express");

const router = express.Router();

const user = require("./user");
const category = require('./category');
const subcategory = require('./subcategory');
const inventory = require('./inventory');
const coupon = require("./coupon");
const product = require("./product");
const cart = require("./cart");
const wishlist = require("./wishlist");
const order = require("./order");
const payment = require("./payment");
const register = require("./Register");
const forgotPassword = require("./forgotPassword.route");
const dashboard = require("./dashboard")
const saless = require("./sales");



router.use("/user", user); 
router.use('/category', category); 
router.use('/subcategory', subcategory); 
router.use('/inventory', inventory); 
router.use("/register", register); 
router.use("/forgotPassword", forgotPassword); 
router.use("/coupon", coupon); 
router.use("/product", product); 
router.use("/cart", cart); 
router.use("/wishlist", wishlist); 
router.use("/order", order); 
router.use("/payment", payment);
router.use("/dashboard", dashboard);
router.use("/payment", payment); 
router.use("/sales", saless); 



module.exports = router;

