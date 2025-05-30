const {Wishlist} = require('../model');

const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

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
    const items = await Wishlist.find({ userId }).populate('productId');

    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving wishlist', error: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
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
  removeFromWishlist
};
