import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById } from '../redux/slice/order.slice';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useOutletContext } from 'react-router-dom';
import {
  FaBox,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaTag,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaPercent
} from 'react-icons/fa';
import { MdOutlineLocalShipping } from 'react-icons/md';
import { IMG_URL } from '../utils/baseUrl';

const OrderDetailPage = () => {
  const { isDarkMode } = useOutletContext();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedOrder, isLoading, error } = useSelector(state => state.order);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'd_badge-warning';
      case 'confirmed': return 'd_badge-info';
      case 'shipped': return 'd_badge-primary';
      case 'delivered': return 'd_badge-success';
      case 'cancelled': return 'd_badge-danger';
      default: return 'd_badge-secondary';
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!selectedOrder) {
    return <div>No order found</div>;
  }

  return (
    <div className={`d_order-detail-container w-100 ${isDarkMode ? 'd_dark-theme' : 'd_light-theme'}`}>
      <style>{`
        :root {
          /* Dark theme colors */
          --dark-bg: #22282e;
          --dark-card-bg: #282f36;
          --dark-text: #ccd1d6;
          --dark-text-secondary: #dadee2;
          --dark-border: rgba(255, 255, 255, 0.1);
          --accent-color: #6A9C89;
          --accent-hover-color: #5b8a78; /* Slightly darker for hover */
          
          /* Light theme colors */
          --light-bg: #f3f3f3;
          --light-card-bg: #ffffff;
          --light-text: #282f36;
          --light-text-secondary: #5a6270;
          --light-border: rgba(12, 12, 12, 0.08);
        }

        .d_order-detail-container {
          min-height: 100vh;
          padding-top: 2rem;
          padding-bottom: 0.5rem;
          transition: all 0.3s ease;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .d_dark-theme {
          background-color: var(--dark-bg);
          color: var(--dark-text);
        }

        .d_light-theme {
          background-color: var(--light-bg);
          color: var(--light-text);
        }

        .d_card {
          border-radius: 12px;
          border: none;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
        }

        .d_dark-theme .d_card {
          background-color: var(--dark-card-bg);
          border: 1px solid var(--dark-border);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }

        .d_light-theme .d_card {
          background-color: var(--light-card-bg);
          border: 1px solid var(--light-border);
        }

        .d_card-header {
          border-bottom: 1px solid;
          border-radius: 12px 12px 0 0 !important;
          padding: 1.25rem 1.5rem;
          font-weight: 600;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .d_dark-theme .d_card-header {
          background-color: var(--dark-card-bg);
          border-color: var(--dark-border);
          color: var(--dark-text-secondary);
        }

        .d_light-theme .d_card-header {
          background-color: var(--light-card-bg);
          border-color: var(--light-border);
          color: var(--light-text);
        }
        
        .d_card-header .icon {
          color: var(--accent-color);
          font-size: 1.4rem;
        }

        .d_order-header {
          background: linear-gradient(135deg, var(--accent-color), var(--accent-hover-color));
          color: white;
          border-radius: 12px;
          padding: 2.5rem;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .d_order-header::before {
          content: '';
          position: absolute;
          top: -20px;
          right: -20px;
          width: 120px;
          height: 120px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          transform: rotate(45deg);
        }
        .d_order-detail-container .d_card{
          height:auto !important;
        }
        .d_order-id {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          letter-spacing: 0.5px;
        }

        .d_order-date {
          opacity: 0.9;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }

        .d_badge {
          padding: 0.6rem 1.2rem;
          border-radius: 25px;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .d_badge-warning { background-color:rgb(120, 207, 164); color: #343a40; }
        .d_badge-info { background-color: #17a2b8; color: #fff; }
        .d_badge-primary { background-color: #007bff; color: #fff; }
        .d_badge-success { background-color: #28a745; color: #fff; }
        .d_badge-danger { background-color: #dc3545; color: #fff; }
        .d_badge-secondary { background-color: #6c757d; color: #fff; }

        .d_product-item {
          padding: 1.2rem 1.5rem;
          border-bottom: 1px solid;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .d_product-item:last-child {
          border-bottom: none;
        }

        .d_dark-theme .d_product-item {
          border-color: var(--dark-border);
        }

        .d_light-theme .d_product-item {
          border-color: var(--light-border);
        }

        .d_product-image {
          width: 90px;
          height: 90px; 
          object-fit: cover;
          border-radius: 8px;
          background-color: var(--light-bg); /* Use light-bg for image placeholder */
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: #ccc;
          flex-shrink: 0;
        }
            .d_product-image img{
            border-radius: 8px;
            width: 90px !important; 
            height: 90px !important;
          }
        .d_dark-theme .d_product-image {
          background-color: rgba(255, 255, 255, 0.05);
        }

        .d_product-name {
          font-weight: 700;
          margin-bottom: 0.25rem;
          font-size: 1.05rem;
        }
        .d_product-description {
          font-size: 0.9rem;
          color: var(--dark-text-secondary); /* Use secondary text color */
          margin-bottom: 0.25rem;
        }
        .d_dark-theme .d_product-description {
            color: var(--dark-text-secondary);
        }
        .d_light-theme .d_product-description {
            color: var(--light-text-secondary);
        }
        .d_product-sku {
          font-size: 0.8rem;
          color: #888;
        }
        .d_product-price-qty {
          text-align: right;
          white-space: nowrap;
        }
        .d_product-price-qty .price {
          font-weight: 700;
          font-size: 1.1rem;
        }
        .d_product-price-qty .qty {
          font-size: 0.9rem;
          color: #888;
        }

        .d_info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px dashed; /* Changed to dashed for subtle look */
        }

        .d_dark-theme .d_info-row {
          border-color: var(--dark-border);
        }

        .d_light-theme .d_info-row {
          border-color: var(--light-border);
        }

        .d_info-row:last-of-type { /* Use last-of-type to target the last one specifically */
          border-bottom: none;
        }

        .d_info-label {
          font-weight: 500;
          opacity: 0.85;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .d_info-label .icon {
            font-size: 1rem;
            color: var(--accent-color);
        }

        .d_info-value {
          font-weight: 600;
          text-align: right;
        }

        /* NEW Refined Shipping Address Styles (Based on image feedback) */
        .d_shipping-address-panel {
            padding: 1.5rem; /* Consistent padding */
        }

        .d_shipping-address-panel .recipient-name {
            font-size: 1.2rem;
            font-weight: 600; /* Slightly less bold than previous, more harmonious */
            margin-bottom: 1rem; /* More space below name */
            display: flex;
            align-items: center;
            gap: 12px;
            color: var(--dark-text); /* Ensure good contrast */
            border-bottom: 1px solid var(--dark-border); /* Subtle line below name */
            padding-bottom: 1rem; /* Padding for the line */
        }
        .d_light-theme .d_shipping-address-panel .recipient-name {
            color: var(--light-text);
            border-color: var(--light-border);
        }

        .d_shipping-address-panel .recipient-name .icon {
            font-size: 1.4rem; /* Adjusted icon size */
            color: var(--accent-color);
            flex-shrink: 0;
        }

        .d_shipping-address-panel .address-block {
            line-height: 1.7; /* Improved line height for readability */
            font-size: 0.95rem;
            margin-bottom: 1.5rem; /* Generous space before contact */
            color: var(--dark-text-secondary);
        }
        .d_light-theme .d_shipping-address-panel .address-block {
            color: var(--light-text-secondary);
        }
        .d_shipping-address-panel .address-line {
            display: block; /* Ensure each span takes a new line */
        }

        .d_shipping-address-panel .contact-info-item {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.9rem;
            margin-bottom: 0.75rem; /* Space between contact lines */
            color: var(--dark-text); /* Using primary text for contact for clarity */
        }
        .d_light-theme .d_shipping-address-panel .contact-info-item {
            color: var(--light-text);
        }

        .d_shipping-address-panel .contact-info-item .icon {
            color: var(--accent-color);
            font-size: 1.05rem; /* Slightly larger icons for contact */
            flex-shrink: 0;
        }
        .d_shipping-address-panel .contact-info-item span {
            word-break: break-all;
        }
        .d_shipping-address-panel .contact-info-item:last-child {
            margin-bottom: 0;
        }


        .d_total-row {
          font-size: 1.3rem;
          font-weight: 700;
          padding: 1.2rem 0;
          border-top: 2px solid var(--accent-color);
          margin-top: 1rem;
          color: var(--accent-color);
        }
        .d_dark-theme .d_total-row {
            color: var(--accent-color); /* Ensure accent color in dark mode too */
        }

        @media (max-width: 768px) {
          .d_order-detail-container {
            padding-top: 1.5rem;
          }
          .d_order-detail-container .d_card{ 
            padding: 8px;
          }
          .d_order-header {
            padding: 1.5rem;
          }
          
          .d_order-id {
            font-size: 1.4rem;
          }
          
          .d_product-image {
            width: 70px;
            height: 70px;
          }

          .d_product-image img {
            width: 70px !important; 
            height: 70px !important;
          }

          .d_product-item {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 1rem;
            padding: 10px;
          }

          .d_product-info {
            flex: 1 1 calc(100% - 90px);
            min-width: 0;
          }

          .d_product-price-qty {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 0.5rem;
          }

          .d_info-row {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .d_info-label {
            margin-bottom: 0;
          }

          .d_info-value {
            text-align: right;
          }

          .d_card {
            margin-bottom: 1rem;
          }

          .d_shipping-address-panel .recipient-name {
            font-size: 1.1rem;
          }

          .d_shipping-address-panel .address-block {
            font-size: 0.9rem;
          }

          .d_shipping-address-panel .contact-info-item {
            font-size: 0.85rem;
          }

          .d_total-row {
            font-size: 1.2rem;
          }
        }
          
      `}</style>
      <div className="p-3">
        {/* Order Header */}
        <div className="d_order-header">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="d_order-id">Order #{selectedOrder._id.slice(-8).toUpperCase()}</div>
              <div className="d_order-date"><FaCalendarAlt /> Placed on {formatDate(selectedOrder.createdAt)}</div>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <span className={`d_badge ${getStatusBadgeClass(selectedOrder.status)}`}>
                <FaBox /> {selectedOrder.status}
              </span>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            {/* Order Items */}
            <div className="d_card">
              <div className="d_card-header">
                <FaBox className="icon" /> Order Items ({selectedOrder.items.length})
              </div>
              <div className="card-body p-0">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="d_product-item justify-content-between ">
                    <div className="d-flex gap-3">
                      <div className="d_product-image">
                        {/* Defensive check for item.productId and item.productId.images */}
                        {item.productId && item.productId.images && item.productId.images.length > 0 ? (
                          <img
                            src={`${IMG_URL}${item.productId.images[0]}`}
                            alt={item.productId.productName || 'Product Image'} // Fallback alt text
                            className="img-fluid"
                          />
                        ) : (
                          // Fallback if product data or image is missing
                          <div className="d_product-image d-flex align-items-center justify-content-center">
                            <FaBox style={{ fontSize: '2rem', color: '#ccc' }} /> {/* Placeholder icon */}
                          </div>
                        )}
                      </div>
                      <div className="d_product-info">
                        <h6 className="d_product-name">{item.productId ? item.productId.productName : 'Unknown Product'}</h6>
                        <p className="d_product-description">{item.productId ? item.productId.description : 'N/A'}</p>
                        <small className="d_product-sku">SKU: {item.productId ? item.productId.sku : 'N/A'}</small>
                      </div>
                    </div>

                    <div className="d_product-price-qty">
                      <div className="price">₹{item.productId ? item.productId.price : '0.00'}</div>
                      <div className="qty">Qty: {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="d_card">
              <div className="d_card-header">
                <FaMapMarkerAlt className="icon" /> Shipping Address
              </div>
              <div className="d_shipping-address-panel">
                <div className="recipient-name">
                  <FaUser className="icon" /> {selectedOrder.firstName} {selectedOrder.lastName}
                </div>
                <div className="address-block">
                  {selectedOrder.address.split('\n').map((line, index) => (
                    <span key={index} className="address-line">{line}</span>
                  ))}
                  <span className="address-line">{selectedOrder.city}, {selectedOrder.zipCode}</span>
                  <span className="address-line">{selectedOrder.country}</span>
                </div>
                <div className="contact-info-item">
                  <FaEnvelope className="icon" /> <span>{selectedOrder.email}</span>
                </div>
                <div className="contact-info-item">
                  <FaPhone className="icon" /> <span>{selectedOrder.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            {/* Order Summary */}
            <div className="d_card">
              <div className="d_card-header">
                <FaMoneyBillWave className="icon" /> Order Summary
              </div>
              <div className="card-body">
                <div className="d_info-row">
                  <span className="d_info-label">Subtotal:</span>
                  <span className="d_info-value">₹{selectedOrder.totalAmount}</span>
                </div>
                <div className="d_info-row">
                  <span className="d_info-label">Discount:</span>
                  <span className="d_info-value text-success">-₹{selectedOrder.discountAmount}</span>
                </div>
                <div className="d_info-row">
                  <span className="d_info-label">Delivery Charge:</span>
                  <span className="d_info-value">₹{selectedOrder.deliveryCharge}</span>
                </div>
                <div className="d_info-row">
                  <span className="d_info-label">Tax:</span>
                  <span className="d_info-value">₹{selectedOrder.tax}</span>
                </div>
               <div className="d_info-row d_total-row">
  <span className="d_info-label">Total Amount:</span>
  <span className="d_info-value">₹{selectedOrder.finalAmount.toFixed(2)}</span>
</div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="d_card">
              <div className="d_card-header">
                <FaCreditCard className="icon" /> Payment Details
              </div>
              <div className="card-body">
                <div className="d_info-row">
                  <span className="d_info-label">Payment Method:</span>
                  <span className="d_info-value text-capitalize">{selectedOrder.paymentMethod}</span>
                </div>
                {selectedOrder.paymentDetails && selectedOrder.paymentDetails.bank && (
                  <div className="d_info-row">
                    <span className="d_info-label">Bank:</span>
                    <span className="d_info-value text-uppercase">{selectedOrder.paymentDetails.bank}</span>
                  </div>
                )}
                <div className="d_info-row">
                  <span className="d_info-label">Payment Status:</span>
                  <span className={`d_badge ${getStatusBadgeClass(selectedOrder.paymentStatus)}`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Coupon Details */}
            {selectedOrder.couponId && (
              <div className="d_card">
                <div className="d_card-header">
                  <FaTag className="icon" /> Coupon Applied
                </div>
                <div className="card-body">
                  <div className="d_info-row">
                    <span className="d_info-label">Coupon Code:</span>
                    <span className="d_info-value">{selectedOrder.couponId.title}</span>
                  </div>
                  <div className="d_info-row">
                    <span className="d_info-label">Discount:</span>
                    <span className="d_info-value text-success"> {selectedOrder.couponId.discountPercentage}% OFF</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;