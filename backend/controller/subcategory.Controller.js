const { Subcategory } = require('../model');
const fs = require('fs');
const path = require('path');
const SubcategoryModel = require('../model/subcategory.model');

// Create Subcategory
// const createSubcategory = async (req, res) => {
//     try {
//         const { subcategoryTitle, description, category } = req.body;

//         // Validate required fields
//         if (!subcategoryTitle || !category) {
//             return res.status(400).json({
//                 error: 'Subcategory title and category are required'
//             });
//         }

//         let image = '';
//         if (req.file) {
//             // Validate file type
//             const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//             if (!allowedTypes.includes(req.file.mimetype)) {
//                 // Delete the uploaded file if type is invalid
//                 fs.unlinkSync(req.file.path);
//                 return res.status(400).json({
//                     error: 'Invalid file type. Only JPEG, PNG and JPG are allowed'
//                 });
//             }

//             // Validate file size (5MB max)
//             const maxSize = 5 * 1024 * 1024; // 5MB in bytes
//             if (req.file.size > maxSize) {
//                 // Delete the uploaded file if size is too large
//                 fs.unlinkSync(req.file.path);
//                 return res.status(400).json({
//                     error: 'File size exceeds 5MB limit'
//                 });
//             }

//             image = req.file.path;
//         }
//         // Normalize for consistent check
//         const formattedTitle = subcategoryTitle.charAt(0).toUpperCase() + subcategoryTitle.slice(1).toLowerCase();

//         const existing = await SubcategoryModel.findOne({ subcategoryTitle: formattedTitle })
//             .collation({ locale: 'en', strength: 2 });

//         if (existing) {
//             return res.status(400).json({ message: 'Subcategory title already exists' });
//         }
//         const subcategory = new Subcategory({
//             subcategoryTitle: formattedTitle,
//             description,
//             category,
//             image
//         });

//         await subcategory.save();
//         res.status(201).json(subcategory);
//     } catch (err) {
//         // If there's an error and a file was uploaded, delete it
//         if (req.file) {
//             fs.unlinkSync(req.file.path);
//         }
//         res.status(500).json({ error: err.message });
//     }
// };

const createSubcategory = async (req, res) => {
    try {
        const { subcategoryTitle, description, category } = req.body;
        // Validate required fields
        if (!subcategoryTitle || !category) {
            return res.status(400).json({
                error: 'Subcategory title and category are required',
                type: 'ValidationError'
            });
        }
        let image = '';
        if (req.file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(req.file.mimetype)) {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({
                    error: 'Invalid file type. Only JPEG, PNG and JPG are allowed',
                    type: 'FileTypeError'
                });
            }

            // Validate file size (5MB max)
            const maxSize = 5 * 1024 * 1024;
            if (req.file.size > maxSize) {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({
                    error: 'File size exceeds 5MB limit',
                    type: 'FileSizeError'
                });
            }

            image = req.file.path;
        }
        // Normalize for consistent check
        const formattedTitle = subcategoryTitle.charAt(0).toUpperCase() + subcategoryTitle.slice(1).toLowerCase();
        const existing = await SubcategoryModel.findOne({ subcategoryTitle: formattedTitle })
            .collation({ locale: 'en', strength: 2 });
        if (existing) {
            return res.status(409).json({
                error: 'Duplicate Error: Subcategory with this title already exists.',
                type: 'DuplicateError'
            });
        }
        // Get userId from req.user (set by auth middleware)
        const userId = req.user ? req.user._id : null;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const subcategory = new Subcategory({
            subcategoryTitle: formattedTitle,
            description,
            category,
            image,
            userId
        });
        await subcategory.save();
        res.status(201).json(subcategory);
    } catch (err) {
        // If there's an error and a file was uploaded, delete it
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        // Handle duplicate key error from MongoDB
        if (err.code === 11000) {
            return res.status(409).json({
                error: 'Duplicate Error: Subcategory with this title already exists.',
                type: 'DuplicateError'
            });
        }
        let message = 'Subcategory creation failed.';
        if (err.name === 'ValidationError') {
            message = 'Validation Error: ' + Object.values(err.errors).map(e => e.message).join(', ');
        } else if (err.message) {
            message = err.message;
        }
        res.status(500).json({ error: message, type: err.name || 'Error' });
    }
};

// Get All Subcategories
const getSubcategories = async (req, res) => {
    try {
        const user = req.user;
        let query = {};
        if (user.role === 'admin') {
            // Admin can see all subcategories
        } else if (user.role === 'seller') {
            query.userId = user._id;
        } else {
            return res.status(403).json({ error: "Access denied" });
        }
        const subcategories = await Subcategory.find(query).populate('category', 'title');
        res.json(subcategories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Single Subcategory
const getSubcategory = async (req, res) => {
    try {
        const user = req.user;
        let query = { _id: req.params.id };
        if (user.role === 'admin') {
            // Admin can see any subcategory
        } else if (user.role === 'seller') {
            query.userId = user._id;
        } else {
            return res.status(403).json({ error: "Access denied" });
        }
        const subcategory = await Subcategory.findOne(query).populate('category', 'title');
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
const getallsubcategorywithoutaccess = async (req, res) => {
    try {
        const subcategories = await Subcategory.find().populate('category', 'title');
        res.json(subcategories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
module.exports = {
    createSubcategory,
    getSubcategories,
    getSubcategory,
    updateSubcategory,
    deleteSubcategory,
    getallsubcategorywithoutaccess
};