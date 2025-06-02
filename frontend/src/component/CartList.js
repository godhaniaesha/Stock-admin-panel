    import React from 'react';
    import { MinusIcon, Plus, Trash2, Heart, Code } from 'lucide-react';
    import '../styles/cart.css';
import { useOutletContext } from 'react-router-dom';

    const CartList = () => {
      const { isDarkMode } = useOutletContext();
        const cartItems = [
            {
              id: 1,
              name: 'Men Black Slim Fit T-shirt',
              color: 'Dark',
              size: 'M',
              price: 80.00,
              tax: 3.00,
              image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            },
            {
              id: 2,
              name: 'Dark Green Cargo Pent',
              color: 'Dark Green',
              size: 'M',
              price: 330.00,
              tax: 4.00,
              image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            },
            {
              id: 3,
              name: 'Men Dark Brown Wallet',
              color: 'Brown',
              size: 'S',
              price: 132.00,
              tax: 5.00,
              image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            }
          ];
      
        return (
          <div className="d_cart_container w-100" data-theme={isDarkMode ? 'dark' : 'light'}>
            <div className="d_cart_header">
              <div className="d_cart_title">
                <span>There are 4 product in your cart</span>
                <button className="d_clear_btn">Clear cart</button>
              </div>
            </div>
      
            <div className="d_cart_content">
              <div className="d_cart_items">
                {cartItems.map(item => (
                  <div key={item.id} className="d_cart_item">
                    <div className="d_item_image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    
                    <div className="d_item_details">
                      <div className="d_item_header">
                        <h3>{item.name}</h3>
                        <div className="d_item_meta">
                          <span>Color : {item.color}</span>
                          <span>Size : {item.size}</span>
                        </div>
                      </div>
                      
                      <div className="d_item_actions">
                        <div className="d_quantity_control">
                          <button><MinusIcon size={16} /></button>
                          <span>1</span>
                          <button><Plus size={16} /></button>
                        </div>
                        
                        <div className="d_price_info">
                          <span>Items Price</span>
                          <div>
                            <span>${item.price.toFixed(2)}</span>
                            <span className="d_tax">/ ${item.tax.toFixed(2)} Tax</span>
                          </div>
                        </div>
                      </div>
      
                      <div className="d_item_footer  d-flex justify-content-between align-items-center">
                        <button className="d_remove_btn">
                          <Trash2 size={18} />
                          Remove
                        </button>
                        <p className='mb-0'>
                            Total: <span>${(item.price + item.tax).toFixed(2)}</span>
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
                      <span>$777.00</span>
                    </div>
                    <div className="d_summary_row">
                      <span>Discount :</span>
                      <span>$60.00</span>
                    </div>
                    <div className="d_summary_row">
                      <span>Delivery Charge :</span>
                      <span>$00.00</span>
                    </div>
                    <div className="d_summary_row">
                      <span>Estimated Tax (15.5%) :</span>
                      <span>$20.00</span>
                    </div>
                    <div className="d_summary_total">
                      <span>Total Amount</span>
                      <span>$737.00</span>
                    </div>
                  </div>
      
                  <div className="d_estimated_delivery">
                    <span>📦 Estimated Delivery by 25 April, 2024</span>
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