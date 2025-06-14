const {Product} = require('../model');
const Category = require('../model/category.model');
const Subcategory = require('../model/subcategory.model');
const Users = require('../model/Register.model');
const fs = require('fs');
const path = require('path');
// Create a new product
// const createProduct = async (req, res) => {
//     try {
//         const productData = req.body;
//         console.log(req.body);
        

//         const existingSku = await Product.findOne({ sku: productData.sku });
//         if (existingSku) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Product with this SKU already exists'
//             });
//         }

//         const existingTag = await Product.findOne({ tagNumber: productData.tagNumber });
//         if (existingTag) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Product with this tag number already exists'
//             });
//         }

//         const newProduct = new Product(productData);
//         const savedProduct = await newProduct.save();

//         res.status(201).json({
//             success: true,
//             message: 'Product created successfully',
//             data: savedProduct
//         });
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: 'Error creating product',
//             error: error.message
//         });
//     }
// };
const createProduct = async (req, res) => {
    try {
        const productData = req.body;
        const images = req.files; // images from multer

        console.log('Product Data:', productData);
        console.log('Uploaded Images:', images);

        // Check for duplicate SKU
        const existingSku = await Product.findOne({ sku: productData.sku });
        if (existingSku) {
            return res.status(400).json({
                success: false,
                message: 'Product with this SKU already exists'
            });
        }

        // Check for duplicate Tag
        const existingTag = await Product.findOne({ tagNumber: productData.tagNumber });
        if (existingTag) {
            return res.status(400).json({
                success: false,
                message: 'Product with this tag number already exists'
            });
        }

        // Save image paths to DB
        if (images && images.length > 0) {
            const imagePaths = images.map((img) => {
                // Convert backslashes to forward slashes and remove any double slashes
                return img.path.replace(/\\/g, '/').replace(/\/+/g, '/');
            });
            productData.images = imagePaths;
        }

        const newProduct = new Product(productData);
        const savedProduct = await newProduct.save();

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: savedProduct
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate({
                path: 'categoryId',
                model: 'Category',
                select: 'title description image'
            })
            .populate({
                path: 'subcategoryId',
                model: 'Subcategory',
                select: 'subcategoryTitle description image'
            })
            .populate({
                path: 'sellerId',
                model: 'usersaa',
                select: 'username email phone role'
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            data: products,
            count: products.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving products',
            error: error.message
        });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Product retrieved successfully',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving product',
            error: error.message
        });
    }
};

// Update product
// const updateProduct = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updateData = req.body;

//         const existingSku = await Product.findOne({ sku: updateData.sku, _id: { $ne: id } });
//         if (existingSku) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Another product with this SKU already exists'
//             });
//         }

//         const existingTag = await Product.findOne({ tagNumber: updateData.tagNumber, _id: { $ne: id } });
//         if (existingTag) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Another product with this tag number already exists'
//             });
//         }

//         const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
//             new: true,
//             runValidators: true
//         });

//         if (!updatedProduct) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Product not found'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'Product updated successfully',
//             data: updatedProduct
//         });
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: 'Error updating product',
//             error: error.message
//         });
//     }
// };
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const images = req.files; // New uploaded files, if any

        // Parse JSON strings back to objects
        if (typeof updateData.tags === 'string') {
            try {
                updateData.tags = JSON.parse(updateData.tags);
            } catch (e) {
                updateData.tags = [];
            }
        }
        if (typeof updateData.sizes === 'string') {
            try {
                updateData.sizes = JSON.parse(updateData.sizes);
            } catch (e) {
                updateData.sizes = [];
            }
        }
        if (typeof updateData.colors === 'string') {
            try {
                updateData.colors = JSON.parse(updateData.colors);
            } catch (e) {
                updateData.colors = [];
            }
        }

        // Convert string boolean to actual boolean
        if (typeof updateData.isActive === 'string') {
            updateData.isActive = updateData.isActive === 'true';
        }

        // Check for duplicate SKU (excluding current product)
        const existingSku = await Product.findOne({ sku: updateData.sku, _id: { $ne: id } });
        if (existingSku) {
            return res.status(400).json({
                success: false,
                message: 'Another product with this SKU already exists'
            });
        }

        // Check for duplicate Tag Number (excluding current product)
        const existingTag = await Product.findOne({ tagNumber: updateData.tagNumber, _id: { $ne: id } });
        if (existingTag) {
            return res.status(400).json({
                success: false,
                message: 'Another product with this tag number already exists'
            });
        }

        // Handle image updates
        if (images && images.length > 0) {
            // If new images are uploaded, use them
            const newImagePaths = images.map(img => {
                return img.path.replace(/\\/g, '/').replace(/\/+/g, '/');
            });
            updateData.images = newImagePaths;
        } else if (updateData.existingImage) {
            // If no new images but existing image is provided, keep it
            updateData.images = [updateData.existingImage];
        }
        // Remove the existingImage field as it's not part of the schema
        delete updateData.existingImage;

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            data: deletedProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};

// Get active products only
const getActiveProducts = async (req, res) => {
    try {
        const activeProducts = await Product.find({ isActive: true }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Active products retrieved successfully',
            data: activeProducts,
            count: activeProducts.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving active products',
            error: error.message
        });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getActiveProducts
};
