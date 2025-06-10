const {Category} = require('../model');
const fs = require('fs');
const path = require('path');

// Create Category
const createCategory = async (req, res) => {
    try {
        const { title, description } = req.body;
        let image = '';
        if (req.file) {
            image = req.file.path; // If using multer for file upload
        }
        const category = new Category({ title, description, image });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        // Improved error message
        let message = 'Category creation failed.';
        if (err.name === 'ValidationError') {
            message = 'Validation Error: ' + Object.values(err.errors).map(e => e.message).join(', ');
        } else if (err.code === 11000) {
            message = 'Duplicate Error: Category with this title already exists.';
        } else if (err.message) {
            message = err.message;
        }
        res.status(500).json({ error: message, type: err.name || 'Error' });
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
        // console.log("Update request body:", req.body);
        // console.log("Update request file:", req.file);

        let updateData = { title, description };
        
        if (req.file) {
            updateData.image = req.file.path;
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        console.log("Updated category:", category);
        res.json(category);
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Delete Category
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Delete the image file if it exists
        if (category.image) {
            const imagePath = path.join(__dirname, '..', category.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Delete the category from database
        await Category.findByIdAndDelete(req.params.id);
        res.json({ 
            success: true,
            message: 'Category deleted successfully',
            deletedCategory: category
        });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}