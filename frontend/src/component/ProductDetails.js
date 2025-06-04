import React, { useState, useEffect } from 'react';
import { BsLightningFill } from 'react-icons/bs';
// Import icons from a chosen library (e.g., Font Awesome)
import { FaHeart, FaRegHeart, FaShoppingCart, FaShippingFast, FaUndo, FaStar, FaPlay, FaPause, FaLock } from 'react-icons/fa';
import { GiStarFormation } from 'react-icons/gi';
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';
import { MdStars } from 'react-icons/md';


const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('#E6D5B8');
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [autoSlide, setAutoSlide] = useState(true);

  const images = [
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h:500&fit=crop",
    "https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?w=400&h=500&fit=crop"
  ];

  // Auto slide effect
  useEffect(() => {
    if (autoSlide) {
      const interval = setInterval(() => {
        setSelectedImage(prev => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoSlide, images.length]);

  const handleImageClick = (index) => {
    setSelectedImage(index);
    setAutoSlide(false);
    setTimeout(() => setAutoSlide(true), 10000); // Resume auto-slide after 10 seconds
  };

  const nextImage = () => {
    setSelectedImage(prev => (prev + 1) % images.length);
    setAutoSlide(false);
    setTimeout(() => setAutoSlide(true), 10000);
  };

  const prevImage = () => {
    setSelectedImage(prev => (prev - 1 + images.length) % images.length);
    setAutoSlide(false);
    setTimeout(() => setAutoSlide(true), 10000);
  };

  const colors = ['#E6D5B8', '#CDE8D5', '#F2F0F4', '#D5B2E0', '#FA92C7'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const ratingData = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 7 },
    { stars: 2, percentage: 2 },
    { stars: 1, percentage: 1 }
  ];

  return (
    <div style={{
      background: 'var(--dark-bg)',
      color: 'var(--dark-text)',
      minHeight: '100vh',
      padding: '2rem 1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <style jsx>{`
        :root {
          --dark-bg: #22282e;
          --dark-card-bg: #282f36;
          --dark-text: #ccd1d6;
          --dark-text-secondary: #dadee2;
          --dark-border: rgba(255, 255, 255, 0.1);
          --accent-color: #7ba68e;
          --accent-hover-color: #638679;
          --light-bg: #f3f3f3;
          --light-card-bg: #fbf7f7;
          --light-text: #282f36;
          --light-text-secondary: #282f36;
          --light-border: rgba(12, 12, 12, 0.034);
        }

        .product-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }

        .image-section {
          position: sticky;
          top: 2rem;
        }

        .main-image {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 1rem;
          background: var(--dark-card-bg);
          aspect-ratio: 5/5;
          cursor: zoom-in;
        }

        .main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .main-image:hover img {
          transform: scale(1.05);
        }

        .image-controls {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: all 0.3s ease;
          opacity: 0;
        }

        .main-image:hover .image-controls {
          opacity: 1;
        }

        .image-controls:hover {
          background: rgba(0, 0, 0, 0.8);
          transform: translateY(-50%) scale(1.1);
        }

        .prev-btn {
          left: 10px;
        }

        .next-btn {
          right: 10px;
        }

        .image-indicators {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
        }

        .indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .indicator.active {
          background: var(--accent-color);
          transform: scale(1.3);
        }

        .auto-slide-toggle {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex; /* Added for icon alignment */
          align-items: center; /* Added for icon alignment */
          gap: 5px; /* Spacing between icon and text */
        }

        .auto-slide-toggle:hover {
          background: rgba(0, 0, 0, 0.9);
        }

        .zoom-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          cursor: zoom-out;
        }

        .zoom-image {
          max-width: 90%;
          max-height: 90%;
          object-fit: contain;
          border-radius: 8px;
        }

        .thumbnail-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.75rem;
          max-height: 100px;
          overflow-x: auto;
          padding: 5px;
        }

        .thumbnail-grid::-webkit-scrollbar {
          height: 4px;
        }

        .thumbnail-grid::-webkit-scrollbar-track {
          background: var(--dark-card-bg);
          border-radius: 2px;
        }

        .thumbnail-grid::-webkit-scrollbar-thumb {
          background: var(--accent-color);
          border-radius: 2px;
        }

        .thumbnail {
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.3s ease;
          background: var(--dark-card-bg);
        }

        .thumbnail:hover {
          border-color: var(--accent-color);
          transform: translateY(-2px);
        }

        .thumbnail.active {
          border-color: var(--accent-color);
          box-shadow: 0 0 20px rgba(123, 166, 142, 0.3);
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .details-section {
          padding-left: 1rem;
        }

        .product-badge {
          background: linear-gradient(135deg, var(--accent-color), var(--accent-hover-color));
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-size: 0.8rem;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 1rem;
        }

        .product-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--dark-text-secondary);
        }

        .product-id {
          color: #888;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .product-description {
          color: var(--dark-text);
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .stats-card {
          background: var(--dark-card-bg);
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border: 1px solid var(--dark-border);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--accent-color);
          display: block;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .option-section {
          margin-bottom: 2rem;
        }

        .option-label {
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--dark-text-secondary);
        }

        .size-options {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .size-btn {
          padding: 0.75rem 1.25rem;
          border: 2px solid var(--dark-border);
          background: var(--dark-card-bg);
          color: var(--dark-text);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .size-btn:hover {
          border-color: var(--accent-color);
          transform: translateY(-2px);
        }

        .size-btn.active {
          border-color: var(--accent-color);
          background: var(--accent-color);
          color: white;
        }

        .color-options {
          display: flex;
          gap: 1rem;
        }

        .color-dot {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid transparent;
          transition: all 0.3s ease;
          position: relative;
        }

        .color-dot:hover {
          transform: scale(1.1);
        }

        .color-dot.active {
          border-color: white;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }

        .info-card {
          background: var(--dark-card-bg);
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 1px solid var(--dark-border);
        }

        .info-title {
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--dark-text-secondary);
        }

        .info-table {
          width: 100%;
        }

        .info-table tr {
          border-bottom: 1px solid var(--dark-border);
        }

        .info-table td {
          padding: 0.75rem 0;
          vertical-align: top;
        }

        .info-table td:first-child {
          font-weight: 500;
          color: #888;
          width: 30%;
        }

        .rating-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .rating-score {
          background: var(--accent-color);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .rating-text {
          color: #888;
        }

        .rating-bars {
          margin-bottom: 1.5rem;
        }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .rating-stars {
          color: #888;
          font-size: 0.9rem;
          width: 60px;
          display: flex; /* Added for icon alignment */
          align-items: center; /* Added for icon alignment */
          gap: 3px; /* Spacing between icon and text */
        }

        .progress-bar-bg {
          flex: 1;
          height: 8px;
          background: #333;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-color), var(--accent-hover-color));
          transition: width 0.8s ease;
        }

        .review-item {
          padding: 1rem 0;
          border-bottom: 1px solid var(--dark-border);
        }

        .reviewer-name {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--dark-text-secondary);
        }

        .review-text {
          color: var(--dark-text);
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .review-images {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .review-image {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          object-fit: cover;
          border: 1px solid var(--dark-border);
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          margin: 2rem 0;
        }

        .primary-btn {
          flex: 1;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, var(--accent-color), var(--accent-hover-color));
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
          display: flex; /* Added for icon alignment */
          align-items: center; /* Added for icon alignment */
          justify-content: center; /* Center content */
          gap: 8px; /* Spacing between icon and text */
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(123, 166, 142, 0.3);
        }

        .secondary-btn {
          padding: 1rem;
          background: var(--dark-card-bg);
          color: var(--dark-text);
          border: 2px solid var(--dark-border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1.2rem;
        }

        .secondary-btn:hover {
          border-color: var(--accent-color);
          transform: translateY(-2px);
        }

        .secondary-btn.active {
          background: var(--accent-color);
          color: white;
          border-color: var(--accent-color);
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1rem 0;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          background: var(--dark-card-bg);
          border-radius: 10px;
          border: 1px solid var(--dark-border);
        }

        .quantity-btn {
          background: none;
          border: none;
          color: var(--dark-text);
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.2s ease;
        }

        .quantity-btn:hover {
          background: var(--accent-color);
          color: white;
        }

        .quantity-input {
          background: none;
          border: none;
          color: var(--dark-text);
          text-align: center;
          width: 60px;
          padding: 0.5rem;
          font-size: 1rem;
        }

        .quantity-input:focus {
          outline: none;
        }

        .feature-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 1rem 0;
        }

        .feature-tag {
          background: rgba(123, 166, 142, 0.1);
          color: var(--accent-color);
          padding: 0.3rem 0.8rem;
          border-radius: 15px;
          font-size: 0.8rem;
          border: 1px solid rgba(123, 166, 142, 0.3);
          display: flex; /* Added for icon alignment */
          align-items: center; /* Added for icon alignment */
          gap: 5px; /* Spacing between icon and text */
        }

        .shipping-info {
          background: var(--dark-card-bg);
          border-radius: 12px;
          padding: 1rem;
          margin: 1rem 0;
          border-left: 4px solid var(--accent-color);
        }

        .shipping-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .shipping-row:last-child {
          margin-bottom: 0;
        }

        .pulse-animation {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .slide-animation {
          animation: slideIn 0.5s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 768px) {
          .product-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .image-section {
            position: static;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .product-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="product-container">
        {/* Image Section */}
        <div className="image-section">
          <div className="product-badge"><MdStars></MdStars>  Premium Quality</div>
          <div className="main-image" onClick={() => setShowZoom(true)}>
            <img src={images[selectedImage]} alt="Product" className="slide-animation" />
            
            {/* Navigation Controls */}
            <button className="image-controls prev-btn" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
              <IoMdArrowDropleft />
            </button>
            <button className="image-controls next-btn" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
              <IoMdArrowDropright />
            </button>
            
            {/* Auto-slide toggle */}
            <button 
              className="auto-slide-toggle"
              onClick={(e) => { e.stopPropagation(); setAutoSlide(!autoSlide); }}
            >
              {autoSlide ? <><FaPause /> Pause</> : <><FaPlay /> Play</>}
            </button>
            
            {/* Image indicators */}
            <div className="image-indicators">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`indicator ${selectedImage === index ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); handleImageClick(index); }}
                />
              ))}
            </div>
          </div>
          
          <div className="thumbnail-grid">
            {images.map((img, index) => (
              <div
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => handleImageClick(index)}
              >
                <img src={img} alt={`View ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="details-section">
          <h1 className="product-title">Cotton Rich Jersey Slim Blazer</h1>
          <p className="product-id">Product ID: GY345912</p>
          
          <p className="product-description">
            Elevate your wardrobe with this sophisticated cotton-rich jersey slim blazer. 
            Perfect for both professional and casual occasions, featuring premium materials 
            and expert craftsmanship for lasting comfort and style.
          </p>

          <div className="stats-card">
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">$120.40</span>
                <span className="stat-label">Price</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">987</span>
                <span className="stat-label">Orders</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">104</span>
                <span className="stat-label">In Stock</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">$12.5K</span>
                <span className="stat-label">Revenue</span>
              </div>
            </div>
          </div>

          <div className="option-section">
            <div className="option-label">Size</div>
            <div className="size-options">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="option-section">
            <div className="option-label">Color</div>
            <div className="color-options">
              {colors.map((color) => (
                <div
                  key={color}
                  className={`color-dot ${selectedColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Feature Tags */}
          <div className="feature-tags">
            <span className="feature-tag"><FaShippingFast /> Free Shipping</span>
            <span className="feature-tag"><FaUndo /> Easy Returns</span>
            <span className="feature-tag"><GiStarFormation></GiStarFormation> Premium Quality</span>
            <span className="feature-tag"><BsLightningFill></BsLightningFill> Fast Delivery</span>
          </div>

          {/* Quantity Selector */}
          <div className="quantity-selector">
            <div className="option-label">Quantity:</div>
            <div className="quantity-controls">
              <button 
                className="quantity-btn" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                −
              </button>
              <input 
                type="number" 
                className="quantity-input" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
              />
              <button 
                className="quantity-btn" 
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="primary-btn pulse-animation">
              <FaShoppingCart /> Add to Cart
            </button>
            <button 
              className={`secondary-btn ${isWishlist ? 'active' : ''}`}
              onClick={() => setIsWishlist(!isWishlist)}
            >
              {isWishlist ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>

          {/* Shipping Info */}
          <div className="shipping-info">
            <div className="shipping-row">
              <span><FaShippingFast /> Standard Delivery</span>
              <span>3-5 Business Days</span>
            </div>
            <div className="shipping-row">
              <span><BsLightningFill></BsLightningFill> Express Delivery</span>
              <span>1-2 Business Days</span>
            </div>
            <div className="shipping-row">
              <span><FaLock /> Secure Payment</span>
              <span>SSL Encrypted</span>
            </div>
          </div>

          <div className="info-card">
            <h3 className="info-title">Product Details</h3>
            <table className="info-table">
              <tbody>
                <tr>
                  <td>Material</td>
                  <td>100% Cotton Rich Jersey</td>
                </tr>
                <tr>
                  <td>Fit</td>
                  <td>Slim Fit Design</td>
                </tr>
                <tr>
                  <td>Length</td>
                  <td>72cm (Size 12)</td>
                </tr>
                <tr>
                  <td>Lining</td>
                  <td>55% Polyester, 45% Viscose</td>
                </tr>
                <tr>
                  <td>Care</td>
                  <td>Machine Washable</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="info-card">
            <h3 className="info-title">Ratings & Reviews</h3>
            <div className="rating-header">
              <div className="rating-score">4.7</div>
              <div className="rating-text">Based on 5,438 ratings</div>
            </div>
            
            <div className="rating-bars">
              {ratingData.map((rating) => (
                <div key={rating.stars} className="rating-row">
                  <div className="rating-stars">{rating.stars} <FaStar /></div>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill"
                      style={{ width: `${rating.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="review-item">
              <div className="reviewer-name">Houston Flatley-Hudson</div>
              <div className="review-text">
                Amazing quality and perfect fit! The material feels premium and the tailoring is excellent. 
                Definitely worth the investment for a versatile piece that works for both work and casual occasions.
              </div>
              <div className="review-images">
                <img src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=50&h=50&fit=crop" alt="Review" className="review-image" />
                <img src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=50&h=50&fit=crop" alt="Review" className="review-image" />
              </div>
              <div className="review-date">June 02, 2025</div>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Overlay */}
      {showZoom && (
        <div className="zoom-overlay" onClick={() => setShowZoom(false)}>
          <img src={images[selectedImage]} alt="Zoomed Product" className="zoom-image" />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;