const {Inventory} = require('../model');

// Create Inventory
const createInventory = async (req, res) => {
    try {
        const { category, subcategory, product, quantity, lowStockLimit } = req.body;
        const inventory = new Inventory({ category, subcategory, product, quantity, lowStockLimit });
        await inventory.save();
        res.status(201).json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get All Inventory
const getInventories = async (req, res) => {
    try {
        const inventories = await Inventory.find();
        res.json(inventories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Single Inventory
const getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id);
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Inventory
const updateInventory = async (req, res) => {
    try {
        const { category, subcategory, product, quantity, lowStockLimit } = req.body;
        const updateData = { category, subcategory, product, quantity, lowStockLimit };
        const inventory = await Inventory.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Inventory
const deleteInventory = async (req, res) => {
    try {
        await Inventory.findByIdAndDelete(req.params.id);
        res.json({ message: 'Inventory deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createInventory,
    getInventories,
    getInventory,
    updateInventory,
    deleteInventory
}