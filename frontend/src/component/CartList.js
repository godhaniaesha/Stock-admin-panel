import React, { useEffect } from 'react';
import { MinusIcon, Plus, Trash2, Heart, Code } from 'lucide-react';
import '../styles/cart.css';
import { useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../redux/slice/cart.slice';

const CartList = () => {
  const { isDarkMode } = useOutletContext();
  const dispatch = useDispatch();
  const { items: cartItems, loading, error } = useSelector((state) => state.cart);
  const userId = localStorage.getItem('user');

  useEffect(() => {
    if (userId) {
      dispatch(getCart(userId));
    }
  }, [dispatch, userId]);

  const handleQuantityChange = (itemId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty > 0) {
      dispatch(updateCartItem({ id: itemId, quantity: newQty }));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-5 text-danger">Error: {error}</div>;
  }

  // Calculate totals
  const subtotal = cartItems?.reduce((total, item) => total + (item.productId?.price * item.quantity), 0) || 0;
  const discount = 60; // This could be dynamic based on promo code
  const deliveryCharge = 0;
  const tax = subtotal * 0.155; // 15.5% tax
  const finalTotal = subtotal + tax + deliveryCharge - discount;

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
            <div key={item._id} className="d_cart_item">
              <div className="d_item_image">
                <img src={item.productId?.images?.[0] || 'https://via.placeholder.com/400x400'} alt={item.productId?.productName} />
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
                      <span>${item.productId?.price?.toFixed(2)}</span>
                      <span className="d_tax">/ ${(item.productId?.price * 0.155).toFixed(2)} Tax</span>
                    </div>
                  </div>
                </div>

                <div className="d_item_footer d-flex justify-content-between align-items-center">
                  <button className="d_remove_btn" onClick={() => handleRemoveItem(item._id)}>
                    <Trash2 size={18} />
                    Remove
                  </button>
                  <p className='mb-0'>
                    Total: <span>${((item.productId?.price * item.quantity) + (item.productId?.price * 0.155)).toFixed(2)}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="d_cart_sidebar">
          <div className="d_promo_section">
            <h3>Have a Promo Code ?</h3>
            <div className="d_promo_input">
              <input type="text" placeholder="CODE123" />
              <button className="d_apply_btn">Apply</button>
            </div>
          </div>

          <div className="d_cart_summary">
            <h3>Order Summary</h3>
            <div className="d_summary_details">
              <div className="d_summary_row">
                <span>Sub Total :</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="d_summary_row">
                <span>Discount :</span>
                <span>${discount.toFixed(2)}</span>
              </div>
              <div className="d_summary_row">
                <span>Delivery Charge :</span>
                <span>${deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="d_summary_row">
                <span>Estimated Tax (15.5%) :</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="d_summary_total">
                <span>Total Amount</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="d_estimated_delivery">
              <span>📦 Estimated Delivery by {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
            </div>

            <div className="d_cart_actions">
              <button className="d_continue_btn">Continue Shopping</button>
              <button className="d_checkout_btn">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartList;