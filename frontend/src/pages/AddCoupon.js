import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import moment from 'moment';
import '../styles/x_app.css';
import Calendar from '../component/Calendar';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createCoupon, resetCouponState } from '../redux/slice/coupon.slice';

const AddCoupon = () => {
    const { isDarkMode } = useOutletContext();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [couponData, setCouponData] = useState({
        status: 'active',
        startDate: '',
        endDate: '',
        code: '',
        discountProduct: '',
        discountCountry: '',
        couponLimit: '',
        type: 'free_shipping',
        discountValue: '',
        discountPercentage: ''
    });

    const DayNames = () => (
        <div className="x_week names">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((name, i) => (
                <span key={i} className="x_day">{name}</span>
            ))}
        </div>
    );

    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedField, setSelectedField] = useState(null);

    const handleDateSelect = (day) => {
        const selectedDate = moment(day.date).format('YYYY-MM-DD'); // ✅ Correct format
        setCouponData(prev => ({
            ...prev,
            [selectedField]: selectedDate
        }));
        setShowCalendar(false);
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const dataToSubmit = {
            title: couponData.code,
            status: couponData.status,
            startDate: couponData.startDate,
            endDate: couponData.endDate,
            discountPercentage: parseFloat(couponData.discountPercentage),
        };
    
        try {
            const result = await dispatch(createCoupon(dataToSubmit));
            
            if (createCoupon.fulfilled.match(result)) {
                dispatch(resetCouponState());
    
                // Clear form data
                setCouponData({
                    code: '',
                    status: '',
                    startDate: '',
                    endDate: '',
                    discountPercentage: '',
                });
                navigate('/coupons')
                console.log("Coupon successfully added and form reset.");
            } else {
                console.error("Failed to add coupon:", result.error);
            }
        } catch (error) {
            console.error("Submission error:", error);
        }
    };

    return (
        <div>
            <div className={`x_add_product_container w-100 ${isDarkMode ? 'd_dark' : 'd_light'}`}>
                <div className="x_product_form">
                    <div className="x_product_info">
                        <h2 className="x_product_title">Coupon Status</h2>
                        <div className="x_form_p pt-0">
                            <div className="Z_filter_content Z_filter_content_show d-md-flex d-block p-0 x_d_gap">
                                <Form.Check
                                    type="radio"
                                    name="status"
                                    label="Active"
                                    checked={couponData.status === 'active'}
                                    onChange={() => handleStatusChange('active')}
                                    className="Z_filter_option"
                                />
                                <Form.Check
                                    type="radio"
                                    name="status"
                                    label="In Active"
                                    checked={couponData.status === 'inactive'}
                                    onChange={() => handleStatusChange('inactive')}
                                    className="Z_filter_option"
                                />
                                <Form.Check
                                    type="radio"
                                    name="status"
                                    label="Future Plan"
                                    checked={couponData.status === 'futureplan'}
                                    onChange={() => handleStatusChange('futureplan')}
                                    className="Z_filter_option"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="x_product_form mt-3">
                    <div className="x_product_info">
                        <h2 className="x_product_title">Date Schedule</h2>
                        <div className="x_form_section">
                            <div className='x_form_p'>
                                <div className="x_form_row">
                                    <div className="x_form_group">
                                        <label>Start Date</label>
                                        <div className="x_date_input_wrapper">
                                            <input
                                                type="text"
                                                name="startDate"
                                                value={couponData.startDate}
                                                readOnly
                                                className="x_input"
                                                placeholder="yyyy-mm-dd"
                                            />
                                            <span
                                                className="x_calendar_icon"
                                                onClick={() => {
                                                    setShowCalendar(true);
                                                    setSelectedField('startDate');
                                                }}
                                            >
                                                <i className="fas fa-calendar"></i>
                                            </span>
                                            {showCalendar && selectedField === 'startDate' && (
                                                <div className="x_calendar_popup">
                                                    <Calendar onSelect={handleDateSelect} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="x_form_group">
                                        <label>End Date</label>
                                        <div className="x_date_input_wrapper">
                                            <input
                                                type="text"
                                                name="endDate"
                                                value={couponData.endDate}
                                                readOnly
                                                className="x_input"
                                                placeholder="yyyy-mm-dd"
                                            />
                                            <span
                                                className="x_calendar_icon"
                                                onClick={() => {
                                                    setShowCalendar(true);
                                                    setSelectedField('endDate');
                                                }}
                                            >
                                                <i className="fas fa-calendar"></i>
                                            </span>
                                            {showCalendar && selectedField === 'endDate' && (
                                                <div className="x_calendar_popup">
                                                    <Calendar onSelect={handleDateSelect} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="x_product_form mt-3">
                    <div className="x_product_info">
                        <h2 className="x_product_title">Coupon Information</h2>
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
                                            name="discountPercentage"
                                            placeholder="Discount enter"
                                            value={couponData.discountPercentage}
                                            onChange={handleInputChange}
                                            className="x_input"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="x_btn_wrapper mt-3">
                    <button type="submit" className="x_btn x_btn_create" onClick={handleSubmit}>Create Coupon</button>
                    <button type="button" className="x_btn x_btn_cancel">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AddCoupon;
