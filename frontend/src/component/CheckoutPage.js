import React, { useState } from 'react';
import '../styles/checkout.css';
import { CreditCard, Truck, MapPin, CheckCircle2 } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { BsCreditCard2Front, BsChevronDown, BsChevronRight } from 'react-icons/bs';
import { FaWallet, FaUniversity } from 'react-icons/fa';
import { SiGooglepay, SiPhonepe, SiPaytm } from 'react-icons/si';
import { MdAccountBalance } from 'react-icons/md';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

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
  const navigate = useNavigate();

  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Form submitted:', values);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setShowSuccessModal(true);
    }, 1500);
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
                        <div className="d_payment_details">
                          <div className="d_form_group">
                            <label>Card Number</label>
                            <Field
                              type="text"
                              name="cardNumber"
                              className={`d_input ${touched.cardNumber && errors.cardNumber ? 'is-invalid' : ''}`}
                              placeholder="1234 5678 9012 3456"
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
                    <span className="d_items_count">3 Items</span>
                  </div>

                  <div className="d_promo_section">
                    <h3 style={{ color: 'white', marginBottom: '1rem' }}>Have a Promo Code ?</h3>
                    <div className="d_promo_input">
                      <input
                        type="text"
                        name="promoCode"
                        placeholder="Enter your promo code"
                        className="d_input"
                        style={{ flex: 1 }}
                        value={formData.promoCode}
                        onChange={(e) => handleInputChange(e, setFieldValue)}
                      />
                      <button className="d_apply_btn">Apply</button>
                    </div>
                  </div>

                  <div className="d_summary_items">
                    {/* Product items */}
                    <div className="d_summary_item">
                      <img src="/path/to/tshirt.jpg" alt="T-shirt" className="d_item_thumbnail" />
                      <div className="d_item_info">
                        <h4>Men Black Slim Fit T-shirt</h4>
                        <div className="d_item_meta">
                          <span>Size: M</span>
                          <span>Color: Black</span>
                        </div>
                        <div className="d_item_price">
                          <span>$83.00</span>
                          <div className="d_quantity_badge">Qty: 1</div>
                        </div>
                      </div>
                    </div>
                    {/* Add more items as needed */}
                  </div>

                  <div className="d_summary_calculations">
                    <div className="d_calc_row">
                      <span>Subtotal</span>
                      <span>$777.00</span>
                    </div>
                    <div className="d_calc_row">
                      <span>Discount</span>
                      <span className="d_discount">-$60.00</span>
                    </div>
                    <div className="d_calc_row">
                      <span>Shipping</span>
                      <span>$50.00</span>
                    </div>
                    <div className="d_calc_row">
                      <span>Tax (5.5%)</span>
                      <span>$30.00</span>
                    </div>
                    <div className="d_calc_row d_total">
                      <span>Total</span>
                      <span>$737.00</span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="d_checkout_btn" 
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '15px',
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
                    {isSubmitting ? 'Processing...' : 'Placed order'}
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
              <p>Order Number: #{Math.floor(Math.random() * 1000000)}</p>
              <p>A confirmation email has been sent to your email address.</p>
            </div>
            <button 
              className="d_continue_btn"
              onClick={handleContinueShopping}
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