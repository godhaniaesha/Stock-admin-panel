import React, { useState } from 'react';
import '../styles/checkout.css';
import { CreditCard, Truck, MapPin } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const CheckoutPage = () => {
  const { isDarkMode } = useOutletContext();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    zipCode: '',
    city: '',
    country: '',
    shippingMethod: 'dhl',
    promoCode: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShippingMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      shippingMethod: method
    }));
  };

  return (
    <div className="d_checkout_container" data-theme={isDarkMode ? 'dark' : 'light'}>
      <div className="d_checkout_header">
        <h1>Checkout</h1>
      </div>

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
                  <input
                    type="text"
                    name="firstName"
                    className="d_input"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="d_form_group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="d_input"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="d_form_group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="d_input"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="d_form_group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="d_input"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
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
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="row g-3 mt-2">
                <div className="col-md-4">
                  <div className="d_form_group">
                    <label>Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      className="d_input"
                      placeholder="Enter zip code"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d_form_group">
                    <label>City</label>
                    <select
                      name="city"
                      className="d_input"
                      value={formData.city}
                      onChange={handleInputChange}
                    >
                      <option value="">Choose your city</option>
                      <option value="new-york">New York</option>
                      <option value="london">London</option>
                      <option value="paris">Paris</option>
                      <option value="tokyo">Tokyo</option>
                      <option value="sydney">Sydney</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d_form_group">
                    <label>Country</label>
                    <select
                      name="country"
                      className="d_input"
                      value={formData.country}
                      onChange={handleInputChange}
                    >
                      <option value="">Select your country</option>
                      <option value="us">United States</option>
                      <option value="uk">United Kingdom</option>
                      <option value="fr">France</option>
                      <option value="jp">Japan</option>
                      <option value="au">Australia</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d_checkout_section mt-4">
            <div className="d_section_header">
              <CreditCard className="d_section_icon" />
              <h2 className="d_section_title">Shipping Method</h2>
            </div>
            <div className="d_shipping_methods">
              <label className="d_shipping_option">
                <input
                  type="radio"
                  name="shippingMethod"
                  checked={formData.shippingMethod === 'dhl'}
                  onChange={() => handleShippingMethodChange('dhl')}
                />
                <div className="d_option_content">
                  <img src="/dhl-logo.png" alt="DHL" className="d_courier_logo" />
                  <div className="d_option_details">
                    <span className="d_service_name">DHL Express Delivery</span>
                    <span className="d_delivery_time">Delivery by Tomorrow</span>
                  </div>
                  <div className="d_price_badge">$10.00</div>
                </div>
              </label>

              <label className="d_shipping_option">
                <input
                  type="radio"
                  name="shippingMethod"
                  checked={formData.shippingMethod === 'fedex'}
                  onChange={() => handleShippingMethodChange('fedex')}
                />
                <div className="d_option_content">
                  <img src="/fedex-logo.png" alt="FedEx" className="d_courier_logo" />
                  <div className="d_option_details">
                    <span className="d_service_name">FedEx Priority</span>
                    <span className="d_delivery_time">Delivery by Tomorrow</span>
                  </div>
                  <div className="d_price_badge">$12.00</div>
                </div>
              </label>

              <label className="d_shipping_option">
                <input
                  type="radio"
                  name="shippingMethod"
                  checked={formData.shippingMethod === 'ups'}
                  onChange={() => handleShippingMethodChange('ups')}
                />
                <div className="d_option_content">
                  <img src="/ups-logo.png" alt="UPS" className="d_courier_logo" />
                  <div className="d_option_details">
                    <span className="d_service_name">UPS Standard</span>
                    <span className="d_delivery_time">Delivery in 2-3 Days</span>
                  </div>
                  <div className="d_price_badge">$8.00</div>
                </div>
              </label>
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
                  onChange={handleInputChange}
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
              className="d_checkout_btn" 
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
              onMouseOver={(e) => e.target.style.backgroundColor = '#6c8d80'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'var(--accent-color)'}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;