import React from 'react';
import '../styles/checkout.css';
import { CreditCard, Truck, MapPin } from 'lucide-react';

const CheckoutPage = ({ isDarkMode }) => {
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
                  <input type="text" className="d_input" placeholder="John" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="d_form_group">
                  <label>Last Name</label>
                  <input type="text" className="d_input" placeholder="Doe" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="d_form_group">
                  <label>Email Address</label>
                  <input type="email" className="d_input" placeholder="john@example.com" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="d_form_group">
                  <label>Phone Number</label>
                  <input type="tel" className="d_input" placeholder="+1 234 567 890" />
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
                <textarea className="d_input" placeholder="Enter your full address" rows="3"></textarea>
              </div>
              <div className="row g-3 mt-2">
                <div className="col-md-4">
                  <div className="d_form_group">
                    <label>Zip Code</label>
                    <input type="text" className="d_input" placeholder="12345" />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d_form_group">
                    <label>City</label>
                    <select className="d_input">
                      <option value="">Select City</option>
                      <option value="new-york">New York</option>
                      <option value="london">London</option>
                      <option value="paris">Paris</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d_form_group">
                    <label>Country</label>
                    <select className="d_input">
                      <option value="">Select Country</option>
                      <option value="us">United States</option>
                      <option value="uk">United Kingdom</option>
                      <option value="fr">France</option>
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
                <input type="radio" name="shipping" defaultChecked />
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
                <input type="radio" name="shipping" />
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
                <input type="radio" name="shipping" />
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
                <input type="text" placeholder="CODE123" className="d_input" style={{ flex: 1 }} />
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

            <button className="d_checkout_btn">Proceed to Payment</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;