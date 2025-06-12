const { Cart } = require('../model');
const { Inventory } = require('../model');

const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const addQty = quantity && Number(quantity) > 0 ? Number(quantity) : 1;

        // Check inventory quantity first
        const inventory = await Inventory.findOne({ product: productId });
        if (!inventory) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found in inventory' 
            });
        }

        // Check if requested quantity is available
        if (inventory.quantity < addQty) {
            return res.status(400).json({ 
                success: false, 
                message: `Stock limit reached! Only ${inventory.quantity} items available.` 
            });
        }

        const existing = await Cart.findOne({ userId, productId });

        if (existing) {
            // Check if total quantity (existing + new) is available
            const totalRequestedQty = existing.quantity + addQty;
            if (inventory.quantity < totalRequestedQty) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Stock limit reached! You can only add ${inventory.quantity - existing.quantity} more items.` 
                });
            }

            existing.quantity += addQty;
            const updated = await existing.save();

            return res.status(200).json({ 
                success: true, 
                message: 'Cart quantity updated', 
                data: updated 
            });
        }

        const item = new Cart({ userId, productId, quantity: addQty });
        const savedItem = await item.save();

        res.status(201).json({ 
            success: true, 
            message: 'Added to cart', 
            data: savedItem 
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: 'Error adding to cart', 
            error: error.message 
        });
    }
};

const getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const items = await Cart.find({ userId }).populate('productId');

        const totalProducts = items.length; // 👈 count of unique products

        res.status(200).json({
            success: true,
            data: items,
            totalProducts // 👈 this is what you asked
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving cart',
            error: error.message
        });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const cartItem = await Cart.findById(id);
        if (!cartItem) {
            return res.status(404).json({ 
                success: false, 
                message: 'Cart item not found' 
            });
        }

        // Check inventory quantity
        const inventory = await Inventory.findOne({ product: cartItem.productId });
        if (!inventory) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found in inventory' 
            });
        }

        // Check if requested quantity is available
        if (inventory.quantity < quantity) {
            return res.status(400).json({ 
                success: false, 
                message: `Stock limit reached! Only ${inventory.quantity} items available.` 
            });
        }

        const updated = await Cart.findByIdAndUpdate(
            id, 
            { quantity }, 
            { new: true }
        ).populate('productId');

        res.status(200).json({ 
            success: true, 
            message: 'Cart updated', 
            data: updated 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error updating cart', 
            error: error.message 
        });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        const cartItem = await Cart.findById(id);
        
        if (!cartItem) {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

        // Check if enough quantity is available in inventory
        const inventory = await Inventory.findOne({ product: cartItem.productId });
        if (!inventory) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found in inventory' 
            });
        }

        // Check if enough quantity is available
        if (inventory.quantity < cartItem.quantity) {
            return res.status(400).json({ 
                success: false, 
                message: `Only ${inventory.quantity} items available in stock` 
            });
        }

        // Decrease inventory quantity when order is placed
        inventory.quantity -= cartItem.quantity;
        await inventory.save();

        // Remove from cart
        await Cart.findByIdAndDelete(id);

        res.status(200).json({ 
            success: true, 
            message: 'Order placed successfully and inventory updated' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error processing order', 
            error: error.message 
        });
    }
};

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart
};
