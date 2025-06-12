import React from 'react';
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

const OrderDetailPage = () => {
    const { isDarkMode } = useOutletContext();

    const orderData = {
        "_id": "68492a1b642dfa2833398ef9",
        "userId": {
            "username": "dsgdg",
            "email": "dsfgdfa@gmail.com",
            "phone": "8160503291"
        },
        "couponId": {
            "title": "New23",
            "discountPercentage": 80,
            "startDate": "2025-06-04T00:00:00.000Z",
            "endDate": "2025-06-17T00:00:00.000Z"
        },
        "firstName": "krupali",
        "lastName": "kumbhani",
        "email": "krupali.kalathiyainfotech@gmail.com",
        "phone": "8160503291",
        "address": "hjsdgfgas\nmk llhu",
        "zipCode": "395006",
        "city": "dhsfhsh",
        "country": "India",
        "paymentMethod": "netbanking",
        "paymentDetails": {
            "bank": "sbi"
        },
        "items": [
            {
                "productId": {
                    "productName": "Cartoon T-Shirt Set",
                    "description": "Soft cotton t-shirt and shorts with cartoon print for toddlers.",
                    "price": 1200,
                    "images": ["KAssets/images/1749621655972-123674959-Cartoon T-Shirt Set.jpg"],
                    "sku": "SKU600578487",
                    "stock": 85
                },
                "quantity": 1
            },
            {
                "productId": {
                    "productName": "Kids Jeans",
                    "description": "Comfortable and durable jeans for kids, suitable for daily wear.",
                    "price": 700,
                    "images": ["KAssets/images/1749622287746-580686371-Kids Jeans.jpg"],
                    "sku": "SKU249914154",
                    "stock": 60
                },
                "quantity": 1
            }
        ],
        "totalAmount": 1900,
        "discountAmount": 0,
        "deliveryCharge": 50,
        "tax": 294.5,
        "finalAmount": 2244.5,
        "paymentStatus": "pending",
        "status": "pending",
        "createdAt": "2025-06-11T07:02:51.392Z"
    };

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
          padding: 2rem 0;
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

        .d_order-id {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          letter-spacing: 0.5px;
        }

        .d_order-date {
          opacity: 0.9;
          font-size: 1rem;
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

        .d_address-details {
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        .d_address-details strong {
            font-size: 1.1rem;
            display: block;
            margin-bottom: 0.5rem;
        }
        .d_address-details span {
            display: block;
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
            padding: 1rem;
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
            font-size: 1.5rem;
          }
          .d_product-item {
              flex-direction: column;
              align-items: flex-start;
              text-align: left;
          }
          .d_product-price-qty {
              width: 100%;
              text-align: left;
              margin-top: 0.5rem;
          }
          .d_info-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .d_info-label {
            margin-bottom: 0.25rem;
          }
          .d_info-value {
            width: 100%;
            text-align: left;
          }
        }
      `}</style>

            <div className="p-3">
                {/* Order Header */}
                <div className="d_order-header">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <div className="d_order-id">Order #{orderData._id.slice(-8).toUpperCase()}</div>
                            <div className="d_order-date"><FaCalendarAlt /> Placed on {formatDate(orderData.createdAt)}</div>
                        </div>
                        <div className="col-md-4 text-md-end mt-3 mt-md-0">
                            <span className={`d_badge ${getStatusBadgeClass(orderData.status)}`}>
                                <FaBox /> {orderData.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-8">
                        {/* Order Items */}
                        <div className="d_card">
                            <div className="d_card-header">
                                <FaBox className="icon" /> Order Items ({orderData.items.length})
                            </div>
                            <div className="card-body p-0">
                                {orderData.items.map((item, index) => (
                                    <div key={index} className="d_product-item">
                                        <div className="d_product-image">
                                            {/* In a real app, you'd use item.productId.images[0] */}
                                            📷
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="d_product-name">{item.productId.productName}</h6>
                                            <p className="d_product-description">{item.productId.description}</p>
                                            <small className="d_product-sku">SKU: {item.productId.sku}</small>
                                        </div>
                                        <div className="d_product-price-qty">
                                            <div className="price">₹{item.productId.price}</div>
                                            <div className="qty">Qty: {item.quantity}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="d_card shadow-sm border rounded p-4 mb-4">
                            <div className="d_card-header border-bottom pb-3 mb-3 d-flex align-items-center">
                                <FaMapMarkerAlt className="icon me-2" />
                                <h5 className="mb-0">Shipping Address</h5>
                            </div>
                            <div className="card-body p-0">
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <div className="d_address-details">
                                            <strong><FaUser className="me-1" /> {orderData.firstName} {orderData.lastName}</strong>
                                            {orderData.address.split('\n').map((line, index) => (
                                                <p key={index} className="mb-0">{line}</p>
                                            ))}
                                            <p className="mb-0">{orderData.city}, {orderData.zipCode}</p>
                                            <p className="mb-0">{orderData.country}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="d_info-row d-flex align-items-center mb-2">
                                            <span className="d_info-label me-2"><FaEnvelope /> Email:</span>
                                            <span className="d_info-value">{orderData.email}</span>
                                        </div>
                                        <div className="d_info-row d-flex align-items-center">
                                            <span className="d_info-label me-2"><FaPhone /> Phone:</span>
                                            <span className="d_info-value">{orderData.phone}</span>
                                        </div>
                                    </div>
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
                                    <span className="d_info-value">₹{orderData.totalAmount}</span>
                                </div>
                                <div className="d_info-row">
                                    <span className="d_info-label">Discount:</span>
                                    <span className="d_info-value text-success">-₹{orderData.discountAmount}</span>
                                </div>
                                <div className="d_info-row">
                                    <span className="d_info-label">Delivery Charge:</span>
                                    <span className="d_info-value">₹{orderData.deliveryCharge}</span>
                                </div>
                                <div className="d_info-row">
                                    <span className="d_info-label">Tax:</span>
                                    <span className="d_info-value">₹{orderData.tax}</span>
                                </div>
                                <div className="d_info-row d_total-row">
                                    <span className="d_info-label">Total Amount:</span>
                                    <span className="d_info-value">₹{orderData.finalAmount}</span>
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
                                    <span className="d_info-value text-capitalize">{orderData.paymentMethod}</span>
                                </div>
                                {orderData.paymentDetails.bank && (
                                    <div className="d_info-row">
                                        <span className="d_info-label">Bank:</span>
                                        <span className="d_info-value text-uppercase">{orderData.paymentDetails.bank}</span>
                                    </div>
                                )}
                                <div className="d_info-row">
                                    <span className="d_info-label">Payment Status:</span>
                                    <span className={`d_badge ${getStatusBadgeClass(orderData.paymentStatus)}`}>
                                        {orderData.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Coupon Details */}
                        {orderData.couponId && (
                            <div className="d_card">
                                <div className="d_card-header">
                                    <FaTag className="icon" /> Coupon Applied
                                </div>
                                <div className="card-body">
                                    <div className="d_info-row">
                                        <span className="d_info-label">Coupon Code:</span>
                                        <span className="d_info-value">{orderData.couponId.title}</span>
                                    </div>
                                    <div className="d_info-row">
                                        <span className="d_info-label">Discount:</span>
                                        <span className="d_info-value text-success"><FaPercent /> {orderData.couponId.discountPercentage}% OFF</span>
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