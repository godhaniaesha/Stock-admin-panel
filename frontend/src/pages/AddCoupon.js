import React, { useEffect, useRef, useState } from 'react';
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
    const calendarRef = useRef(null);

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

    const [selectedField, setSelectedField] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!showCalendar) return;
        const handleClickOutside = (event) => {
            if (
                calendarRef.current &&
                !calendarRef.current.contains(event.target) &&
                !event.target.classList.contains('x_calendar_icon') &&
                !event.target.classList.contains('fa-calendar')
            ) {
                setShowCalendar(false);
                setSelectedField(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showCalendar]);

    const handleDateSelect = (day) => {
        const selectedDate = moment(day.date).startOf('day');
        const today = moment().startOf('day');

        if (selectedField === 'startDate' && selectedDate.isBefore(today)) {
            setErrors(prev => ({ ...prev, startDate: 'Start date cannot be in the past' }));
            return;
        }

        if (selectedField === 'endDate' && couponData.startDate && selectedDate.isBefore(moment(couponData.startDate))) {
            setErrors(prev => ({ ...prev, endDate: 'End date must be after start date' }));
            return;
        }

        setCouponData(prev => ({
            ...prev,
            [selectedField]: selectedDate.format('YYYY-MM-DD')
        }));
        setErrors(prev => ({ ...prev, [selectedField]: null }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const today = moment().startOf('day');
        const start = moment(couponData.startDate);
        const end = moment(couponData.endDate);

        const newErrors = {};

        if (!couponData.code.trim()) {
            newErrors.code = "Coupon code is required";
        }

        if (!couponData.discountPercentage.trim()) {
            newErrors.discountPercentage = "Discount is required";
        }

        if (!couponData.startDate) {
            newErrors.startDate = "Start date is required";
        } else if (start.isBefore(today)) {
            newErrors.startDate = "Start date cannot be in the past";
        }

        if (!couponData.endDate) {
            newErrors.endDate = "End date is required";
        } else if (end.isBefore(start)) {
            newErrors.endDate = "End date must be after start date";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

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
                setCouponData({
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
                navigate('/coupons');
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
                            <div className="Z_filter_content Z_filter_content_show d-flex p-0  justify-content-between flex-wrap">
                                <Form.Check type="radio" name="status" label="Active" checked={couponData.status === 'active'} onChange={() => handleStatusChange('active')} className="Z_filter_option" />
                                <Form.Check type="radio" name="status" label="In Active" checked={couponData.status === 'inactive'} onChange={() => handleStatusChange('inactive')} className="Z_filter_option" />
                                <Form.Check type="radio" name="status" label="Future Plan" checked={couponData.status === 'futureplan'} onChange={() => handleStatusChange('futureplan')} className="Z_filter_option" />
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
                                            <input type="text" name="startDate" value={couponData.startDate} readOnly className="x_input" placeholder="yyyy-mm-dd" />
                                            <span className="x_calendar_icon" onClick={() => {
                                                setShowCalendar(true);
                                                setSelectedField('startDate');
                                            }}>
                                                <i className="fas fa-calendar"></i>
                                            </span>
                                            {showCalendar && selectedField === 'startDate' && (
                                                <div className="x_calendar_popup" ref={calendarRef}>
                                                    <Calendar onSelect={handleDateSelect} selectedDate={couponData.startDate} />
                                                </div>
                                            )}
                                        </div>
                                            {errors.startDate && <small className="text-danger">{errors.startDate}</small>}
                                    </div>

                                    <div className="x_form_group">
                                        <label>End Date</label>
                                        <div className="x_date_input_wrapper">
                                            <input type="text" name="endDate" value={couponData.endDate} readOnly className="x_input" placeholder="yyyy-mm-dd" />
                                            <span className="x_calendar_icon" onClick={() => {
                                                setShowCalendar(true);
                                                setSelectedField('endDate');
                                            }}>
                                                <i className="fas fa-calendar"></i>
                                            </span>
                                            {showCalendar && selectedField === 'endDate' && (
                                                <div className="x_calendar_popup" ref={calendarRef}>
                                                    <Calendar onSelect={handleDateSelect} selectedDate={couponData.endDate} />
                                                </div>
                                            )}
                                        </div>
                                            {errors.endDate && <small className="text-danger">{errors.endDate}</small>}
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
                                        <input type="text" name="code" placeholder="Code enter" value={couponData.code} onChange={handleInputChange} className="x_input" />
                                        {errors.code && <small className="text-danger">{errors.code}</small>}
                                    </div>
                                    <div className="x_form_group">
                                        <label>Discount Percentage</label>
                                        <input type="text" name="discountPercentage" placeholder="Discount enter" value={couponData.discountPercentage} onChange={handleInputChange} className="x_input" />
                                        {errors.discountPercentage && <small className="text-danger">{errors.discountPercentage}</small>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="x_btn_wrapper mt-3">
                    <button type="submit" className="x_btn x_btn_create" onClick={handleSubmit}>Create Coupon</button>
                    <button type="button" className="x_btn x_btn_cancel" onClick={() => navigate('/coupons')}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AddCoupon;
