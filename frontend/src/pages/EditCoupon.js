import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import moment from 'moment';
import '../styles/x_app.css';
import Calendar from '../component/Calendar';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCouponById, updateCoupon, resetCouponState } from '../redux/slice/coupon.slice';
import { toast } from 'react-toastify'; // Import toast

const EditCoupon = () => {
    const { isDarkMode } = useOutletContext();
    const { id } = useParams();
    const navigate = useNavigate();

    console.log("Coupon ID from useParams:", id);

    const dispatch = useDispatch();
    const { selectedCoupon, isLoading, error } = useSelector((state) => state.coupon);
    // You don't necessarily need separate updateStatus and updateError if you rely on the main isLoading/error
    // from the slice, as long as your slice updates them appropriately during the update lifecycle.
    // const updateStatus = useSelector((state) => state.coupon.isLoading);
    // const updateError = useSelector((state) => state.coupon.error);

    console.log("Redux State - selectedCoupon:", selectedCoupon);
    console.log("Redux State - isLoading:", isLoading);
    console.log("Redux State - Error:", error);

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

    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedField, setSelectedField] = useState(null);

    // --- EFFECT TO FETCH COUPON DATA ---
    useEffect(() => {
        if (id) {
            console.log(`Dispatching fetchCouponById for ID: ${id}`);
            dispatch(fetchCouponById(id));
        } else {
            console.log("ID is undefined, cannot fetch coupon data.");
        }
    }, [id, dispatch]);

    // --- EFFECT TO POPULATE FORM WITH FETCHED DATA ---
    useEffect(() => {
        if (selectedCoupon) {
            console.log("selectedCoupon data received from Redux, populating form:", selectedCoupon);
            setCouponData({
                status: selectedCoupon.status || 'active',
                startDate: selectedCoupon.startDate ? moment(selectedCoupon.startDate).format('YYYY-MM-DD') : '',
                endDate: selectedCoupon.endDate ? moment(selectedCoupon.endDate).format('YYYY-MM-DD') : '',
                code: selectedCoupon.title || '', // Assuming 'title' from your API object maps to 'code'
                discountProduct: selectedCoupon.discountProduct || '',
                discountCountry: selectedCoupon.discountCountry || '',
                couponLimit: selectedCoupon.couponLimit || '',
                type: selectedCoupon.type || 'free_shipping',
                discountValue: selectedCoupon.discountValue || '',
                discountPercentage: selectedCoupon.discountPercentage || ''
            });
        } else {
            console.log("No selectedCoupon data in Redux state yet, or selectedCoupon is null.");
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
        }
    }, [selectedCoupon]);

    const handleDateSelect = (day) => {
        const selectedDate = moment(day.date).format('YYYY-MM-DD');
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
        console.log("Attempting to update with data:", couponData);
        try {
            await dispatch(updateCoupon({ id, formData: couponData })).unwrap();
            console.log("Coupon updated successfully!");
            toast.success("Coupon updated successfully!"); // Success toast
            navigate('/coupons'); // Redirect to the coupons list page
            dispatch(resetCouponState()); // Reset any loading/error states in the slice
        } catch (err) {
            console.error("Failed to update coupon:", err);
            toast.error(`Failed to update coupon: ${err}`); // Error toast
            // The error state in Redux is already set by the rejected action,
            // so you might not need to display it again if your global error handler exists.
            // But for specific user feedback, a toast is good.
        }
    };

    // Conditional rendering for loading and error states during initial fetch
    if (isLoading && !selectedCoupon) { // Only show loading if actively fetching and no coupon yet
        return <div className="loading-message">Loading coupon data...</div>;
    }

    if (error && !selectedCoupon) { // Only show error if fetch failed and no coupon data
        return <div className="error-message">Error: {error}</div>;
    }

    // Render form only if selectedCoupon data is available after successful fetch
    if (!selectedCoupon) {
        return <div className="loading-message">No coupon data found for this ID.</div>;
    }

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
                                    checked={couponData.status === 'future'}
                                    onChange={() => handleStatusChange('future')}
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
                    <button type="submit" className="x_btn x_btn_create" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" className="x_btn x_btn_cancel" onClick={() => navigate('/coupons')}>Cancel</button>
                </div >
            </div >
        </div >
    );
};

export default EditCoupon;