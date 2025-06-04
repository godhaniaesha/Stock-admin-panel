const { Coupon } = require('../model');

// Create new coupon
const createCoupon = async (req, res) => {
    try {
        const { title, status, startDate, endDate, discountPercentage } = req.body;
        // console.log(req.body,"coupon");
        
        // Check if coupon with same title already exists
        const existingCoupon = await Coupon.findOne({ title: title });
        
        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: 'Coupon with this title already exists'
            });
        }
        
        const newCoupon = new Coupon({
            title,
            status,
            startDate,
            endDate,
            discountPercentage
        });

        const savedCoupon = await newCoupon.save();
        
        res.status(201).json({
            success: true,
            message: 'Coupon created successfully',
            data: savedCoupon
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating coupon',
            error: error.message
        });
    }
};

// Get all coupons
const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            message: 'Coupons retrieved successfully',
            data: coupons,
            count: coupons.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving coupons',
            error: error.message
        });
    }
};

// Get coupon by ID
const getCouponById = async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findById(id);
        
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Coupon retrieved successfully',
            data: coupon
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving coupon',
            error: error.message
        });
    }
};

// Update coupon
const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, status, startDate, endDate, discountPercentage } = req.body;
        
        // Check if another coupon with same title exists (excluding current coupon)
        const existingCoupon = await Coupon.findOne({ 
            title: title, 
            _id: { $ne: id } 
        });
        
        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: 'Coupon with this title already exists'
            });
        }
        
        const updatedCoupon = await Coupon.findByIdAndUpdate(
            id,
            {
                title,
                status,
                startDate,
                endDate,
                discountPercentage
            },
            { new: true, runValidators: true }
        );
        
        if (!updatedCoupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Coupon updated successfully',
            data: updatedCoupon
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating coupon',
            error: error.message
        });
    }
};

// Delete coupon
const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCoupon = await Coupon.findByIdAndDelete(id);
        
        if (!deletedCoupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Coupon deleted successfully',
            data: deletedCoupon
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting coupon',
            error: error.message
        });
    }
};

// Get active coupons only
const getActiveCoupons = async (req, res) => {
    try {
        const now = new Date();
        const activeCoupons = await Coupon.find({
            status: 'active',
            startDate: { $lte: now },
            endDate: { $gte: now }
        }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            message: 'Active coupons retrieved successfully',
            data: activeCoupons,
            count: activeCoupons.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving active coupons',
            error: error.message
        });
    }
};

module.exports = {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon,
    getActiveCoupons
};
