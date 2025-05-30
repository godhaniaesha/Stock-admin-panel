const {Subcategory} = require('../model');

// Create Subcategory
const createSubcategory = async (req, res) => {
    try {
        const { subcategoryTitle, description, category } = req.body;
        let imageUrl = '';
        if (req.file) {
            imageUrl = req.file.path;
        }
        const subcategory = new Subcategory({ subcategoryTitle, description, category, imageUrl });
        await subcategory.save();
        res.status(201).json(subcategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get All Subcategories
const getSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find();
        res.json(subcategories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Single Subcategory
const getSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id);
        res.json(subcategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Subcategory
const updateSubcategory = async (req, res) => {
    try {
        const { subcategoryTitle, description, category } = req.body;
        let updateData = { subcategoryTitle, description, category };
        if (req.file) {
            updateData.imageUrl = req.file.path;
        }
        const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(subcategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Subcategory
const deleteSubcategory = async (req, res) => {
    try {
        await Subcategory.findByIdAndDelete(req.params.id);
        res.json({ message: 'Subcategory deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createSubcategory,
    getSubcategories,
    getSubcategory,
    updateSubcategory,
    deleteSubcategory
}