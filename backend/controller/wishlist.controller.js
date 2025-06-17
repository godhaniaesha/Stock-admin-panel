const { Wishlist } = require('../model');
const mongoose = require('mongoose');

const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    console.log(userId, productId, "userId, productId");

    // Validate if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Validate if productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    const existing = await Wishlist.findOne({ userId, productId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Product already in wishlist' });
    }

    const item = new Wishlist({ userId, productId });
    const savedItem = await item.save();

    res.status(201).json({ success: true, message: 'Added to wishlist', data: savedItem });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error adding to wishlist', error: error.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const items = await Wishlist.find({ userId }).populate('productId');
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving wishlist', error: error.message });
  }
};

const getAllWishlists = async (req, res) => {
  try {
    const items = await Wishlist.find()
      .populate({
        path: 'productId',
        populate: { path: 'categoryId' }
      })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    // Add CategoryData field to each item
    const itemsWithCategory = items.map(item => ({
      ...item.toObject(),
      CategoryData: item.productId?.categoryId || null
    }));

    res.status(200).json({
      success: true,
      data: itemsWithCategory,
      count: itemsWithCategory.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving all wishlists',
      error: error.message
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wishlist item ID format'
      });
    }

    const removed = await Wishlist.findByIdAndDelete(id);

    if (!removed) {
      return res.status(404).json({ success: false, message: 'Item not found in wishlist' });
    }

    res.status(200).json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing from wishlist', error: error.message });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  getAllWishlists
};
