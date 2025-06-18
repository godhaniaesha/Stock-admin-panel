import React, { useState, useEffect, useRef } from 'react';
import '../styles/checkout.css';
import { CreditCard, Truck, MapPin, CheckCircle2, ChevronDown } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCart, removeFromCart } from '../redux/slice/cart.slice';
import { fetchCoupons } from '../redux/slice/coupon.slice';
import { createOrder } from '../redux/slice/order.slice';
import { createPayment } from '../redux/slice/payment.slice';
import { BsCreditCard2Front, BsChevronDown, BsChevronRight } from 'react-icons/bs';
import { FaWallet, FaUniversity, FaCalendar } from 'react-icons/fa';
import { SiGooglepay, SiPhonepe, SiPaytm } from 'react-icons/si';
import { MdAccountBalance } from 'react-icons/md';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import Calendar from './Calendar';
import { IMG_URL } from '../utils/baseUrl';

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  address: Yup.string()
    .required('Address is required')
    .min(10, 'Address must be at least 10 characters'),
  zipCode: Yup.string()
    .matches(/^[0-9]{6}$/, 'Zip code must be 6 digits')
    .required('Zip code is required'),
  city: Yup.string()
    .required('City is required'),
  country: Yup.string()
    .required('Country is required'),
  paymentMethod: Yup.string()
    .required('Please select a payment method'),
  cardNumber: Yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) => schema
      .matches(/^[0-9]{16}$/, 'Card number must be 16 digits')
      .required('Card number is required')
  }),
  cardExpiry: Yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) => schema
      .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Invalid expiry date (MM/YY)')
      .required('Expiry date is required')
  }),
  cardCvv: Yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) => schema
      .matches(/^[0-9]{3}$/, 'CVV must be 3 digits')
      .required('CVV is required')
  }),
  cardName: Yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) => schema
      .required('Card holder name is required')
  }),
  upiId: Yup.string().when('paymentMethod', {
    is: 'upi',
    then: (schema) => schema
      .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/, 'Invalid UPI ID')
      .required('UPI ID is required')
  }),
  selectedBank: Yup.string().when('paymentMethod', {
    is: 'netbanking',
    then: (schema) => schema
      .required('Please select a bank')
  })
});

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  zipCode: '',
  city: '',
  country: '',
  paymentMethod: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
  cardName: '',
  upiId: '',
  selectedBank: ''
};

const CheckoutPage = () => {
  const { isDarkMode } = useOutletContext();
  const [formData, setFormData] = useState(initialValues);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = localStorage.getItem('user');
  const { items: cartItems, loading, error } = useSelector((state) => state.cart);
  const { coupons, isLoading: couponsLoading } = useSelector((state) => state.coupon);
  const [orderId, setOrderId] = useState(null);
  const [showExpiryCalendar, setShowExpiryCalendar] = useState(false);
  const expiryCalendarRef = useRef(null);

  useEffect(() => {
    if (userId) {
      dispatch(getCart(userId));
      dispatch(fetchCoupons());
    }
  }, [dispatch, userId]);

  // Add new useEffect to get coupon from localStorage
  useEffect(() => {
    const storedCoupon = localStorage.getItem('selectedCoupon');
    if (storedCoupon) {
      const parsedCoupon = JSON.parse(storedCoupon);
      setSelectedCoupon(parsedCoupon);
    }
  }, []);


  useEffect(() => {
    if (!showExpiryCalendar) return;
    const handleClickOutside = (event) => {
      if (
        expiryCalendarRef.current &&
        !expiryCalendarRef.current.contains(event.target) &&
        !event.target.classList.contains('expiry_calendar_icon') &&
        !event.target.classList.contains('fa-calendar')
      ) {
        setShowExpiryCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExpiryCalendar]);

  const formatAmount = (amount) => {
    return Math.round(amount).toLocaleString();
  };

  // Calculate totals
  const subtotal = cartItems?.reduce((total, item) => {
    const itemTotal = item.productId?.price * item.quantity;
    return total + itemTotal;
  }, 0) || 0;

  const discount = selectedCoupon ? (subtotal * selectedCoupon.discountPercentage / 100) : 0;
  const deliveryCharge = 0;
  const tax = cartItems?.reduce((total, item) => {
    const itemTax = item.productId?.price * item.quantity * (item.productId?.tax / 100);
    return total + itemTax;
  }, 0) || 0; // 15.5% tax
  const finalTotal = subtotal + tax + deliveryCharge - discount;

  const handleCouponChange = (e) => {
    const couponId = e.target.value;
    const coupon = coupons.find(c => c._id === couponId);
    setSelectedCoupon(coupon || null);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log('Form Values:', values);
      console.log('Cart Items:', cartItems);

      // Get coupon from localStorage
      const storedCoupon = localStorage.getItem('selectedCoupon');
      const couponData = storedCoupon ? JSON.parse(storedCoupon) : null;
      console.log('Coupon from localStorage:', couponData);

      if (!cartItems || cartItems.length === 0) {
        console.error('No items in cart');
        return;
      }

      const orderData = {
        userId: userId,
        couponId: couponData ? couponData.id : null,
        // Personal Details
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        // Shipping Details
        address: values.address,
        zipCode: values.zipCode,
        city: values.city,
        country: values.country,
        // Payment Details
        paymentMethod: values.paymentMethod,
        paymentDetails: values.paymentMethod === 'card' ? {
          cardNumber: values.cardNumber,
          cardName: values.cardName
        } : values.paymentMethod === 'upi' ? {
          upiId: values.upiId
        } : {
          bank: values.selectedBank
        },
        // Order Items
        items: cartItems.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price
        })),
        // Amount Details
        totalAmount: subtotal,
        discountAmount: discount,
        deliveryCharge: deliveryCharge,
        tax: tax,
        finalAmount: finalTotal,
        paymentStatus: 'pending',
        status: 'pending'
      };

      console.log('Order Data being sent:', orderData);

      // Create order first
      const orderResponse = await dispatch(createOrder(orderData)).unwrap();
      console.log('Order Response:', orderResponse);

      // After successful order creation, create payment record
      const paymentData = {
        orderId: orderResponse._id,
        amount: finalTotal,
        method: values.paymentMethod,
        status: 'pending'
      };

      console.log('Payment Data being sent:', paymentData);
      const paymentResponse = await dispatch(createPayment(paymentData)).unwrap();
      console.log('Payment Response:', paymentResponse);

      // Remove all items from cart after successful order placement
      for (const item of cartItems) {
        await dispatch(removeFromCart(item._id)).unwrap();
      }

      // Remove selected coupon from localStorage after successful order
      localStorage.removeItem('selectedCoupon');
      setSelectedCoupon(null);

      setOrderId(orderResponse._id);
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Order/Payment creation failed:', error);
      // You might want to show an error message to the user here
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e, setFieldValue) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodChange = (method, setFieldValue) => {
    setFieldValue('paymentMethod', method);
    setFormData(prev => ({
      ...prev,
      paymentMethod: method
    }));
  };

  const handleCardInput = (e, field, setFieldValue) => {
    const { value } = e.target;
    setFieldValue(field, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePaymentMethod = (method, setFieldValue) => {
    if (formData.paymentMethod === method) {
      setFieldValue('paymentMethod', '');
      setFormData(prev => ({
        ...prev,
        paymentMethod: ''
      }));
    } else {
      setFieldValue('paymentMethod', method);
      setFormData(prev => ({
        ...prev,
        paymentMethod: method
      }));
    }
  };

  const handleContinueShopping = () => {
    setShowSuccessModal(false);
    navigate('/products');
  };

  const calendarRef = useRef(null);
  const [selectedField, setSelectedField] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

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

  const handleExpiryDateSelect = (day, setFieldValue) => {
    // Format as MM/YY
    const formatted = moment(day.date).format('MM/YY');
    setFieldValue('cardExpiry', formatted);
    setShowExpiryCalendar(false);
  };

  return (
    <div className="d_checkout_container" data-theme={isDarkMode ? 'dark' : 'light'}>
      <div className="d_checkout_header">
        <h1>Checkout</h1>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form>
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="d_checkout_section">
                  <div className="d_section_header">
                    <MapPin className="d_section_icon" />
                    <h2 className="d_section_title">Personal Details</h2>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="d_form_group">
                        <label>First Name</label>
                        <Field
                          type="text"
                          name="firstName"
                          className={`d_input ${touched.firstName && errors.firstName ? 'is-invalid' : ''}`}
                          placeholder="Enter your first name"
                        />
                        <ErrorMessage name="firstName" component="div" className="error-message" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d_form_group">
                        <label>Last Name</label>
                        <Field
                          type="text"
                          name="lastName"
                          className={`d_input ${touched.lastName && errors.lastName ? 'is-invalid' : ''}`}
                          placeholder="Enter your last name"
                        />
                        <ErrorMessage name="lastName" component="div" className="error-message" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d_form_group">
                        <label>Email Address</label>
                        <Field
                          type="email"
                          name="email"
                          className={`d_input ${touched.email && errors.email ? 'is-invalid' : ''}`}
                          placeholder="Enter your email address"
                        />
                        <ErrorMessage name="email" component="div" className="error-message" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d_form_group">
                        <label>Phone Number</label>
                        <Field
                          type="tel"
                          name="phone"
                          className={`d_input ${touched.phone && errors.phone ? 'is-invalid' : ''}`}
                          placeholder="Enter your phone number"
                        />
                        <ErrorMessage name="phone" component="div" className="error-message" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d_checkout_section mt-4">
                  <div className="d_section_header">
                    <Truck className="d_section_icon" />
                    <h2 className="d_section_title">Shipping Details</h2>
                  </div>
                  <div className="d_shipping_form">
                    <div className="d_form_group">
                      <label>Full Address</label>
                      <textarea
                        name="address"
                        className="d_input"
                        placeholder="Enter your complete shipping address"
                        rows="3"
                        value={formData.address}
                        onChange={(e) => handleInputChange(e, setFieldValue)}
                      ></textarea>
                    </div>
                    <div className="row g-3 mt-2">
                      <div className="col-md-4">
                        <div className="d_form_group">
                          <label>Zip Code</label>
                          <Field
                            type="text"
                            name="zipCode"
                            className={`d_input ${touched.zipCode && errors.zipCode ? 'is-invalid' : ''}`}
                            placeholder="Enter zip code"
                          />
                          <ErrorMessage name="zipCode" component="div" className="error-message" />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="d_form_group">
                          <label>City</label>
                          <Field
                            type="text"
                            name="city"
                            className={`d_input ${touched.city && errors.city ? 'is-invalid' : ''}`}
                            placeholder="Enter your city"
                          />
                          <ErrorMessage name="city" component="div" className="error-message" />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="d_form_group">
                          <label>Country</label>
                          <Field
                            type="text"
                            name="country"
                            className={`d_input ${touched.country && errors.country ? 'is-invalid' : ''}`}
                            placeholder="Enter your country"
                          />
                          <ErrorMessage name="country" component="div" className="error-message" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d_checkout_section mt-4">
                  <div className="d_section_header">
                    <CreditCard className="d_section_icon" />
                    <h2 className="d_section_title">Payment Method</h2>
                  </div>
                  <div className="d_payment_methods">
                    {/* Credit/Debit Card */}
                    <div className={`d_payment_option ${values.paymentMethod === 'card' ? 'open' : ''}`}>
                      <div
                        className="d_payment_header"
                        onClick={() => togglePaymentMethod('card', setFieldValue)}
                      >
                        <div className="d_payment_title">
                          <input
                            type="radio"
                            name="paymentMethod"
                            className="Z_radio_custom"
                            checked={values.paymentMethod === 'card'}
                            onChange={() => handlePaymentMethodChange('card', setFieldValue)}
                          />
                          <span>Credit/Debit Card</span>
                        </div>
                        <span className="d_accordion_icon">
                          {values.paymentMethod === 'card' ? (
                            <BsChevronDown size={20} />
                          ) : (
                            <BsChevronRight size={20} />
                          )}
                        </span>
                      </div>
                      {values.paymentMethod === 'card' && (
                        <div className="d_payment_details x_product_form">
                          <div className="d_form_group">
                            <label>Card Number</label>
                            <Field
                              type="text"
                              name="cardNumber"
                              className={`d_input ${touched.cardNumber && errors.cardNumber ? 'is-invalid' : ''}`}
                              placeholder="1234567890123456"
                              maxLength="16"
                            />
                            <ErrorMessage name="cardNumber" component="div" className="error-message" />
                          </div>
                          <div className="d_card_row">
                            <div className="d_form_group">
                              <label>Expiry Date</label>
                              <Field
                                type="text"
                                name="cardExpiry"
                                className={`d_input ${touched.cardExpiry && errors.cardExpiry ? 'is-invalid' : ''}`}
                                placeholder="MM/YY"
                                maxLength="5"
                              />
                              {/* <input
                                type="text"
                                name="cardExpiry"
                                className={`d_input ${touched.cardExpiry && errors.cardExpiry ? 'is-invalid' : ''}`}
                                placeholder="MM/YY"
                                maxLength="5"
                                readOnly
                              />
                              <span
                                className="expiry_calendar_icon"
                                style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }}
                                onClick={() => setShowExpiryCalendar((prev) => !prev)}
                              >
                              <FaCalendar />
                              </span>
                              {showExpiryCalendar && (
                                <div className="x_calendar_popup" ref={expiryCalendarRef}>
                                  <Calendar
                                    onSelect={(day) => handleExpiryDateSelect(day, setFieldValue)}
                                    selectedDate={values.cardExpiry ? moment(values.cardExpiry, 'MM/YY').toDate() : undefined}
                                    mode="month" // Optional: if you want month/year picker only
                                  />
                                </div>
                              )} */}
                              {/* <div className="x_date_input_wrapper">
                                            <input
                                                type="text"
                                                name="startDate"
                                                value={touched.cardExpiry}
                                                readOnly
                                                className="x_input"
                                                placeholder="yyyy-mm-dd"
                                            />
                                            <span
                                                className="x_calendar_icon"
                                                onClick={() => {
                                                    if (showCalendar && selectedField === 'cardExpiry') {
                                                        setShowCalendar(false);
                                                        setSelectedField(null);
                                                    } else {
                                                        setShowCalendar(true);
                                                        setSelectedField('cardExpiry');
                                                    }
                                                }}
                                            >
                                                <i className="fas fa-calendar"></i>
                                            </span>
                                            {showCalendar && selectedField === 'cardExpiry' && (
                                                <div className="x_calendar_popup" ref={calendarRef}>
                                                    <Calendar
                                                        onSelect={handleExpiryDateSelect}
                                                        selectedDate={touched.cardExpiry} // Pass selected date as prop
                                                    />
                                                </div>
                                            )}
                                        </div> */}
                              <ErrorMessage name="cardExpiry" component="div" className="error-message" />
                            </div>
                            <div className="d_form_group">
                              <label>CVV</label>
                              <Field
                                type="password"
                                name="cardCvv"
                                className={`d_input ${touched.cardCvv && errors.cardCvv ? 'is-invalid' : ''}`}
                                placeholder="123"
                                maxLength="3"
                              />
                              <ErrorMessage name="cardCvv" component="div" className="error-message" />
                            </div>
                          </div>
                          <div className="d_form_group">
                            <label>Card Holder Name</label>
                            <Field
                              type="text"
                              name="cardName"
                              className={`d_input ${touched.cardName && errors.cardName ? 'is-invalid' : ''}`}
                              placeholder="John Doe"
                            />
                            <ErrorMessage name="cardName" component="div" className="error-message" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* UPI */}
                    <div className={`d_payment_option ${values.paymentMethod === 'upi' ? 'open' : ''}`}>
                      <div
                        className="d_payment_header"
                        onClick={() => togglePaymentMethod('upi', setFieldValue)}
                      >
                        <div className="d_payment_title">
                          <input
                            type="radio"
                            name="paymentMethod"
                            className="Z_radio_custom"
                            checked={values.paymentMethod === 'upi'}
                            onChange={() => handlePaymentMethodChange('upi', setFieldValue)}
                          />
                          <span>UPI</span>
                        </div>
                        <span className="d_accordion_icon">
                          {values.paymentMethod === 'upi' ? (
                            <BsChevronDown size={20} />
                          ) : (
                            <BsChevronRight size={20} />
                          )}
                        </span>
                      </div>
                      {values.paymentMethod === 'upi' && (
                        <div className="d_payment_details">
                          <div className="d_form_group">
                            <label>UPI ID</label>
                            <Field
                              type="text"
                              name="upiId"
                              className={`d_input ${touched.upiId && errors.upiId ? 'is-invalid' : ''}`}
                              placeholder="username@upi"
                            />
                            <ErrorMessage name="upiId" component="div" className="error-message" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Net Banking */}
                    <div className={`d_payment_option ${values.paymentMethod === 'netbanking' ? 'open' : ''}`}>
                      <div
                        className="d_payment_header"
                        onClick={() => togglePaymentMethod('netbanking', setFieldValue)}
                      >
                        <div className="d_payment_title">
                          <input
                            type="radio"
                            name="paymentMethod"
                            className="Z_radio_custom"
                            checked={values.paymentMethod === 'netbanking'}
                            onChange={() => handlePaymentMethodChange('netbanking', setFieldValue)}
                          />
                          <span>Net Banking</span>
                        </div>
                        <span className="d_accordion_icon">
                          {values.paymentMethod === 'netbanking' ? (
                            <BsChevronDown size={20} />
                          ) : (
                            <BsChevronRight size={20} />
                          )}
                        </span>
                      </div>
                      {values.paymentMethod === 'netbanking' && (
                        <div className="d_payment_details">
                          <div className="d_form_group">
                            <label>Select Bank</label>
                            <Field
                              as="select"
                              name="selectedBank"
                              className={`d_input ${touched.selectedBank && errors.selectedBank ? 'is-invalid' : ''}`}
                            >
                              <option value="">Select your bank</option>
                              <option value="hdfc">HDFC Bank</option>
                              <option value="icici">ICICI Bank</option>
                              <option value="sbi">State Bank of India</option>
                              <option value="axis">Axis Bank</option>
                              <option value="kotak">Kotak Mahindra Bank</option>
                            </Field>
                            <ErrorMessage name="selectedBank" component="div" className="error-message" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="d_order_summary">
                  <div className="d_summary_header">
                    <h2>Order Summary</h2>
                    <span className="d_items_count">{cartItems?.length || 0} Items</span>
                  </div>

                  <div className="d_promo_section">
                    <h3 style={{ color: 'white', marginBottom: '1rem' }}>Applied Coupon</h3>
                    {selectedCoupon && (
                      <div className="d_coupon_info" style={{ marginTop: '10px' }}>
                        <p>Applied: {selectedCoupon.title} - {selectedCoupon.discountPercentage}% off</p>
                        <p>Discount Amount: ${formatAmount(discount)}</p>
                      </div>
                    )}
                  </div>

                  <div className="d_summary_items">
                    {cartItems?.map(item => (
                      <div key={item._id} className="d_summary_item">
                        <img
                          src={`${IMG_URL}${item.productId?.images?.[0]}`}
                          alt={item.productId?.productName}
                          className="d_item_thumbnail"
                        />
                        <div className="d_item_info">
                          <h4>{item.productId?.productName}</h4>
                          <div className="d_item_meta">
                            <span>Size: {item.productId?.size || 'Standard'}</span>
                            <span>Color: {item.productId?.color || 'Default'}</span>
                          </div>
                          <div className="d_item_price">
                            <span>${item.productId?.price?.toFixed(2)}</span>
                            <div className="d_quantity_badge">Qty: {item.quantity}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="d_summary_calculations">
                    <div className="d_calc_row">
                      <span>Subtotal</span>
                      <span>${formatAmount(subtotal)}</span>
                    </div>
                    <div className="d_calc_row">
                      <span>Discount</span>
                      <span>- ${formatAmount(discount)}</span>
                    </div>
                    <div className="d_calc_row">
                      <span>Shipping</span>
                      <span>${formatAmount(deliveryCharge)}</span>
                    </div>
                    <div className="d_calc_row">
                      <span>Tax</span>
                      <span>${formatAmount(tax)}</span>
                    </div>
                    <div className="d_calc_row d_total">
                      <span>Total</span>
                      <span>${formatAmount(finalTotal)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="d_checkout_btn"
                    disabled={isSubmitting || loading || !cartItems?.length}
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      backgroundColor: 'var(--accent-color)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      marginTop: '20px'
                    }}
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="d_modal_overlay">
          <div className="d_success_modal">
            <div className="d_success_icon">
              <CheckCircle2 size={60} color="#4CAF50" />
            </div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your purchase. Your order has been received.</p>
            <div className="d_order_details">
              <p>Order Number: #{orderId}</p>
              <p>A confirmation email has been sent to your email address.</p>
            </div>
            <button
              className="d_continue_btn"
              onClick={handleContinueShopping}
              style={{ cursor: 'pointer' }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;