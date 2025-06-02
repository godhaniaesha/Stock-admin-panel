const {Subcategory} = require('../model');
const fs = require('fs');
const path = require('path');

// Create Subcategory
const createSubcategory = async (req, res) => {
    try {
        const { subcategoryTitle, description, category } = req.body;
        
        // Validate required fields
        if (!subcategoryTitle || !category) {
            return res.status(400).json({ 
                error: 'Subcategory title and category are required' 
            });
        }

        let image = '';
        if (req.file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(req.file.mimetype)) {
                // Delete the uploaded file if type is invalid
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ 
                    error: 'Invalid file type. Only JPEG, PNG and JPG are allowed' 
                });
            }

            // Validate file size (5MB max)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (req.file.size > maxSize) {
                // Delete the uploaded file if size is too large
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ 
                    error: 'File size exceeds 5MB limit' 
                });
            }

            image = req.file.path;
        }

        const subcategory = new Subcategory({ 
            subcategoryTitle, 
            description, 
            category, 
            image 
        });
        
        await subcategory.save();
        res.status(201).json(subcategory);
    } catch (err) {
        // If there's an error and a file was uploaded, delete it
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: err.message });
    }
};

// Get All Subcategories
const getSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find().populate('category', 'title');
        res.json(subcategories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Single Subcategory
const getSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id).populate('category', 'title');
        if (!subcategory) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }
        res.json(subcategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Subcategory
const updateSubcategory = async (req, res) => {
    try {
        const { subcategoryTitle, description, category } = req.body;
        
        // Validate required fields
        if (!subcategoryTitle || !category) {
            return res.status(400).json({ 
                error: 'Subcategory title and category are required' 
            });
        }

        let updateData = { subcategoryTitle, description, category };
        
        if (req.file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(req.file.mimetype)) {
                // Delete the uploaded file if type is invalid
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ 
                    error: 'Invalid file type. Only JPEG, PNG and JPG are allowed' 
                });
            }

            // Validate file size (5MB max)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (req.file.size > maxSize) {
                // Delete the uploaded file if size is too large
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ 
                    error: 'File size exceeds 5MB limit' 
                });
            }

            // Get the old subcategory to delete its image
            const oldSubcategory = await Subcategory.findById(req.params.id);
            if (oldSubcategory && oldSubcategory.image) {
                const oldImagePath = path.join(__dirname, '..', oldSubcategory.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            updateData.image = req.file.path;
        }

        const subcategory = await Subcategory.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true }
        ).populate('category', 'title');

        if (!subcategory) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }

        res.json(subcategory);
    } catch (err) {
        // If there's an error and a file was uploaded, delete it
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: err.message });
    }
};

// Delete Subcategory
const deleteSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id);
        
        if (!subcategory) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }

        // Delete the image file if it exists
        if (subcategory.image) {
            const imagePath = path.join(__dirname, '..', subcategory.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Subcategory.findByIdAndDelete(req.params.id);
        res.json({ message: 'Subcategory deleted successfully' });
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
};