const { Cart } = require('../model');

const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const addQty = quantity && Number(quantity) > 0 ? Number(quantity) : 1;

        const existing = await Cart.findOne({ userId, productId });

        if (existing) {
            existing.quantity += addQty;
            const updated = await existing.save();
            return res.status(200).json({ success: true, message: 'Cart quantity updated', data: updated });
        }

        const item = new Cart({ userId, productId, quantity: addQty });
        const savedItem = await item.save();

        res.status(201).json({ success: true, message: 'Added to cart', data: savedItem });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error adding to cart', error: error.message });
    }
};


const getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const items = await Cart.find({ userId }).populate('productId');

        res.status(200).json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving cart', error: error.message });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const updated = await Cart.findByIdAndUpdate(id, { quantity }, { new: true });

        if (!updated) {
            return res.status(404).json({ success: false, message: 'Cart item not found' });
        }

        res.status(200).json({ success: true, message: 'Cart updated', data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating cart', error: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        const removed = await Cart.findByIdAndDelete(id);

        if (!removed) {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

        res.status(200).json({ success: true, message: 'Removed from cart' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error removing from cart', error: error.message });
    }
};

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart
};
