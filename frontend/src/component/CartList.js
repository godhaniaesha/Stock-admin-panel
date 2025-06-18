import React, { useEffect, useState } from 'react';
import { MinusIcon, Plus, Trash2, Heart, Code, ChevronDown } from 'lucide-react';
import '../styles/cart.css';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../redux/slice/cart.slice';
import { fetchCoupons } from '../redux/slice/coupon.slice';
import { IMG_URL } from '../utils/baseUrl';
import { toast } from 'react-toastify';

const CartList = () => {
  const { isDarkMode } = useOutletContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems, isLoading } = useSelector((state) => state.cart);
  const { coupons, isLoading: couponsLoading } = useSelector((state) => state.coupon);
  const userId = localStorage.getItem('user');
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const options = ["CODE10 - 10% OFF", "CODE20 - 20% OFF", "SAVE50 - ₹50 OFF"];

  useEffect(() => {
    if (userId) {
      dispatch(getCart(userId));
      dispatch(fetchCoupons());
    }
  }, [dispatch, userId]);

  // Add new useEffect to check localStorage for selected coupon
  useEffect(() => {
    const storedCoupon = localStorage.getItem('selectedCoupon');
    if (storedCoupon && coupons) {
      const parsedCoupon = JSON.parse(storedCoupon);
      const matchingCoupon = coupons.find(coupon => coupon._id === parsedCoupon.id);
      if (matchingCoupon) {
        setSelectedCoupon(matchingCoupon);
      }
    }
  }, [coupons]); // This will run when coupons are loaded

  const handleQuantityChange = (itemId, currentQty, change) => {
    const newQty = currentQty + change;
    const item = cartItems.find(item => item._id === itemId);
    if (newQty > 0) {
      
      // if (newQty > item.quantity) {
        
      //   alert(`Stock limit reached! Only ${item.quantity} items available.`);
      //   return;
      // }
      dispatch(updateCartItem({ id: itemId, quantity: newQty }));
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await dispatch(removeFromCart(itemId)).unwrap();
      // Refresh cart after removal
      if (userId) {
        await dispatch(getCart(userId));
        toast.success('Item removed from cart successfully!');
      }
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      toast.error('Failed to remove item from cart. Please try again.');
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    if (selectedCoupon) {
      localStorage.setItem('selectedCoupon', JSON.stringify({
        id: selectedCoupon._id,
        title: selectedCoupon.title,
        discountPercentage: selectedCoupon.discountPercentage,
        discountAmount: discount
      }));
    } else {
      localStorage.removeItem('selectedCoupon');
    }
    navigate('/checkout');
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  // Function to format amount (remove decimal places)
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
  }, 0) || 0;
  const finalTotal = subtotal + tax + deliveryCharge - discount;

  if (isLoading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="d_cart_container w-100" data-theme={isDarkMode ? 'dark' : 'light'}>
      <div className="d_cart_header">
        <div className="d_cart_title">
          <span>There are {cartItems?.length || 0} products in your cart</span>
          <button className="d_clear_btn" onClick={handleClearCart}>Clear cart</button>
        </div>
      </div>

      <div className="d_cart_content">
        <div className="d_cart_items">
          {cartItems?.map(item => (
            // console.log(item,"item")
            
            <div key={item._id} className="d_cart_item">
              <div className="d_item_image">
                <img src={`${IMG_URL}${item.productId?.images?.[0]}`}
                  alt={item.productId?.productName} />
              </div>

              <div className="d_item_details">
                <div className="d_item_header">
                  <h3>{item.productId?.productName}</h3>
                  <div className="d_item_meta">
                    <span>Color : {item.productId?.color || 'Default'}</span>
                    <span>Size : {item.productId?.size || 'Standard'}</span>
                  </div>
                </div>

                <div className="d_item_actions">
                  <div className="d_quantity_control">
                    <button onClick={() => handleQuantityChange(item._id, item.quantity, -1)}>
                      <MinusIcon size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item._id, item.quantity, 1)}>
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="d_price_info">
                    <span>Items Price</span>
                    <div>
                      <span>${formatAmount(item.productId?.price)}</span>
                      <span className="d_tax">/ ${formatAmount(item.productId?.price * (item.productId?.tax / 100))} Tax</span>
                    </div>
                  </div>
                </div>

                <div className="d_item_footer d-flex justify-content-between align-items-center">
                  <button className="d_remove_btn" onClick={() => handleRemoveItem(item._id)} disabled={isLoading}>
                    <Trash2 size={18} />
                    {isLoading ? 'Removing...' : 'Remove'}
                  </button>
                  <p className='mb-0'>
                    Total: <span>${formatAmount((item.productId?.price * item.quantity) + (item.productId?.price * 0.155))}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="d_cart_sidebar">
          <div className="d_promo_section" style={{ 
            backgroundColor: isDarkMode ? 'var(--dark-card-bg)' : 'var(--accent-color)', 
            borderRadius: '8px', 
            padding: '20px',
            minHeight: isOpen ? '300px' : 'auto',
            transition: 'min-height 0.3s ease'
          }}>
            <h3 style={{ color: isDarkMode ? 'var(--dark-text)' : 'white', marginBottom: '1rem' }}>Apply Coupon</h3>
            <div className="d_promo_input" style={{ position: 'relative' }}>
              {couponsLoading ? (
                <div>Loading coupons...</div>
              ) : (
                <div className="x_custom_dropdown">
                  <div
                    className="x_dropdown_header"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                      backgroundColor: isDarkMode ? 'var(--dark-bg)' : 'white',
                      color: isDarkMode ? 'var(--dark-text)' : 'var(--light-text)',
                      border: `1px solid ${isDarkMode ? 'var(--dark-border)' : 'var(--light-border)'}`
                    }}
                  >
                    <span>
                      {selectedCoupon ? `${selectedCoupon.title} - ${selectedCoupon.discountPercentage}% off` : 'Select Coupon'}
                    </span>
                    <svg
                      className={`x_dropdown_arrow ${isOpen ? 'open' : ''}`}
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      style={{ color: isDarkMode ? 'var(--dark-text-secondary)' : '#666' }}
                    >
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>
                  {isOpen && (
                    <div className="x_dropdown_options" style={{
                      backgroundColor: isDarkMode ? 'var(--dark-bg)' : 'white',
                      border: `1px solid ${isDarkMode ? 'var(--dark-border)' : 'var(--light-border)'}`,
                      boxShadow: isDarkMode ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                      {coupons?.map((coupon) => (
                        <div
                          key={coupon._id}
                          className="x_dropdown_option"
                          onClick={() => {
                            setSelectedCoupon(coupon);
                            setIsOpen(false);
                          }}
                          style={{
                            color: isDarkMode ? 'var(--dark-text)' : 'var(--light-text)',
                            '&:hover': {
                              backgroundColor: 'var(--accent-color)',
                              color: 'white'
                            }
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <span>{coupon.title}</span>
                            <span>{coupon.discountPercentage}% off</span>
                          </div>
                          <small style={{ color: isDarkMode ? 'var(--dark-text-secondary)' : '#666' }}>
                            Valid till: {new Date(coupon.endDate).toLocaleDateString()}
                          </small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            {selectedCoupon && (
              <div className="d_applied_coupon">
                <p>Applied: {selectedCoupon.title} - {selectedCoupon.discountPercentage}% off</p>
                {/* <p>Valid till: {new Date(selectedCoupon.endDate).toLocaleDateString()}</p> */}
                <p>Discount Amount: ${formatAmount(discount)}</p>
              </div>
            )}
          </div>

          <div className="d_cart_summary">
            <h3>Order Summary</h3>
            <div className="d_summary_details">
              <div className="d_summary_row">
                <span>Sub Total :</span>
                <span>${formatAmount(subtotal)}</span>
              </div>
              <div className="d_summary_row">
                <span>Discount :</span>
                <span>- ${formatAmount(discount)}</span>
              </div>
              <div className="d_summary_row">
                <span>Delivery Charge :</span>
                <span>${formatAmount(deliveryCharge)}</span>
              </div>
              <div className="d_summary_row">
                <span>Estimated Tax :</span>
                <span>${formatAmount(tax)}</span>
              </div>
              <div className="d_summary_total">
                <span>Total Amount</span>
                <span>${formatAmount(finalTotal)}</span>
              </div>
            </div>

            <div className="d_cart_actions">
              <button className="d_checkout_btn" onClick={handleCheckout}>Proceed to checkout</button>
                <button className="d_continue_btn" onClick={() => navigate('/products')}>Continue Shopping</button>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .x_custom_dropdown {
            position: relative;
            width: 100%;
          }

          .x_dropdown_header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .x_dropdown_header:hover {
            border-color: var(--accent-color);
          }

          .x_dropdown_arrow {
            transition: transform 0.3s ease;
          }

          .x_dropdown_arrow.open {
            transform: rotate(180deg);
          }

          .x_dropdown_options {
            position: absolute;
            top: calc(100% + 5px);
            left: 0;
            right: 0;
            z-index: 1000;
            max-height: 170px;
            overflow-y: auto;
            background-color: ${isDarkMode ? 'var(--dark-bg)' : 'white'};
            border: 1px solid ${isDarkMode ? 'var(--dark-border)' : 'var(--light-border)'};
            border-radius: 4px;
            box-shadow: ${isDarkMode ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)'};
            scrollbar-width: thin;
            scrollbar-color: ${isDarkMode ? 'var(--dark-border)' : 'var(--light-border)'} ${isDarkMode ? 'var(--dark-bg)' : 'white'};
          }

          /* Webkit scrollbar styling */
          .x_dropdown_options::-webkit-scrollbar {
            width: 6px;
          }

          .x_dropdown_options::-webkit-scrollbar-track {
            background: ${isDarkMode ? 'var(--dark-bg)' : 'white'};
            border-radius: 3px;
          }

          .x_dropdown_options::-webkit-scrollbar-thumb {
            background-color: ${isDarkMode ? 'var(--dark-border)' : 'var(--light-border)'};
            border-radius: 3px;
            border: 2px solid ${isDarkMode ? 'var(--dark-bg)' : 'white'};
          }

          .x_dropdown_options::-webkit-scrollbar-thumb:hover {
            background-color: var(--accent-color);
          }

          .x_dropdown_option {
            padding: 6px 15px;
            cursor: pointer;
            transition: all 0.2s ease;
            color: ${isDarkMode ? 'var(--dark-text)' : 'var(--light-text)'};
            border-bottom: 1px solid ${isDarkMode ? 'var(--dark-border)' : 'var(--light-border)'};
          }

          .x_dropdown_option:last-child {
            border-bottom: none;
          }

          .x_dropdown_option:hover {
            background-color: var(--accent-color);
            color: white !important;
          }

          .x_dropdown_option:hover small {
            color: rgba(255, 255, 255, 0.8) !important;
          }

          .x_dropdown_option:first-child {
            border-radius: 4px 4px 0 0;
          }

          .x_dropdown_option:last-child {
            border-radius: 0 0 4px 4px;
          }

          .d_promo_section {
            position: relative;
            transition: min-height 0.3s ease;
          }

          .d_promo_input {
            position: relative;
            z-index: 1000;
          }
        `}
      </style>
    </div>
  );
};

export default CartList;