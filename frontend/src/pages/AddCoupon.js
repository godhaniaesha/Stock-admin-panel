import React, { useState } from 'react';
import '../styles/x_app.css';

const AddCoupon = () => {
    const [couponData, setCouponData] = useState({
        status: 'active',
        startDate: '',
        endDate: '',
        code: '',
        discountProduct: '',
        discountCountry: '',
        couponLimit: '',
        type: 'free_shipping',
        discountValue: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCouponData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStatusChange = (status) => {
        setCouponData(prev => ({
            ...prev,
            status
        }));
    };

    const handleTypeChange = (type) => {
        setCouponData(prev => ({
            ...prev,
            type
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your submit logic here
        console.log(couponData);
    };

    return (
        <div className="x_product_page_container">
            <div className="x_add_product_container">
                <div className="x_product_form">
                    <div className="x_product_info">
                        <h2 className="x_product_title">Coupon Status</h2>
                        <div className="x_form_p">
                            {/* Coupon Status */}
                            <div className="x_form_section">
                                <div className="x_radio_group d-flex justify-content-around">
                                    <label className="x_radio_label">
                                        <input
                                            type="radio"
                                            name="status"
                                            checked={couponData.status === 'active'}
                                            onChange={() => handleStatusChange('active')}
                                        />
                                        Active
                                    </label>
                                    <label className="x_radio_label">
                                        <input
                                            type="radio"
                                            name="status"
                                            checked={couponData.status === 'inactive'}
                                            onChange={() => handleStatusChange('inactive')}
                                        />
                                        In Active
                                    </label>
                                    <label className="x_radio_label">
                                        <input
                                            type="radio"
                                            name="status"
                                            checked={couponData.status === 'future'}
                                            onChange={() => handleStatusChange('future')}
                                        />
                                        Future Plan
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="x_product_form mt-3">
                    <div className="x_product_info">
                        <h2 className="x_product_title">Date Schedule</h2>
                        {/* Date Schedule */}
                        <div className="x_form_section"> <div className='x_form_p'>
                            <div className="x_form_row">
                                <div className="x_form_group">
                                    <label>Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={couponData.startDate}
                                        onChange={handleInputChange}
                                        className="x_input"
                                    />
                                </div>
                                <div className="x_form_group">
                                    <label>End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={couponData.endDate}
                                        onChange={handleInputChange}
                                        className="x_input"
                                    />
                                </div>
                            </div>
                        </div>
                        </div>

                    </div>
                </div>

                <div className="x_product_form mt-3">
                    <div className="x_product_info">
                    <h2 className="x_product_title">Coupon Information</h2>
                {/* Coupon Information */}
                <div className="x_form_section">
                <div className='x_form_p'>
                    <div className="x_form_row">
                        <div className="x_form_group">
                            <label>Coupons Code</label>
                            <input
                                type="text"
                                name="code"
                                placeholder="Code enter"
                                value={couponData.code}
                                onChange={handleInputChange}
                                className="x_input"
                            />
                        </div>
                        <div className="x_form_group">
                            <label>Discount Percentage</label>
                            <input
                                type="text"
                                name="Discount"
                                placeholder="Discount enter"
                                value={couponData.Discount}
                                onChange={handleInputChange}
                                className="x_input"
                            />
                        </div>
                    </div>
                    
                    </div>
                </div>
            </div>
        </div>
            </div >

    <div className="x_btn_wrapper ">
        <button type="submit" className="x_btn x_btn_create" onClick={handleSubmit}>Create Coupon</button>
    </div>
        </div >
    );
};

export default AddCoupon;