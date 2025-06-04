 const {Product} = require('../model');

// Create a new product
const createProduct = async (req, res) => {
    try {
        const productData = req.body;
        console.log(req.body);
        

        const existingSku = await Product.findOne({ sku: productData.sku });
        if (existingSku) {
            return res.status(400).json({
                success: false,
                message: 'Product with this SKU already exists'
            });
        }

        const existingTag = await Product.findOne({ tagNumber: productData.tagNumber });
        if (existingTag) {
            return res.status(400).json({
                success: false,
                message: 'Product with this tag number already exists'
            });
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
        const products = await Product.find().sort({ createdAt: -1 });

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
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const existingSku = await Product.findOne({ sku: updateData.sku, _id: { $ne: id } });
        if (existingSku) {
            return res.status(400).json({
                success: false,
                message: 'Another product with this SKU already exists'
            });
        }

        const existingTag = await Product.findOne({ tagNumber: updateData.tagNumber, _id: { $ne: id } });
        if (existingTag) {
            return res.status(400).json({
                success: false,
                message: 'Another product with this tag number already exists'
            });
        }

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
