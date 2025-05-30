const {Category} = require('../model');

// Create Category
const createCategory = async (req, res) => {
    try {
        const { title, description } = req.body;
        let imageUrl = '';
        if (req.file) {
            imageUrl = req.file.path; // If using multer for file upload
        }
        const category = new Category({ title, description, imageUrl });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get All Categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Single Category
const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Category
const updateCategory = async (req, res) => {
    try {
        const { title, description } = req.body;
        let updateData = { title, description };
        if (req.file) {
            updateData.imageUrl = req.file.path;
        }
        const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Category
const deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}