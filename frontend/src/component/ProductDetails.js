import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, resetCurrentProduct } from '../redux/slice/product.slice';
import { BsLightningFill } from 'react-icons/bs';
// Import icons from a chosen library (e.g., Font Awesome)
import { FaHeart, FaRegHeart, FaShoppingCart, FaShippingFast, FaUndo, FaStar, FaPlay, FaPause, FaLock } from 'react-icons/fa';
import { GiStarFormation } from 'react-icons/gi';
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';
import { MdStars } from 'react-icons/md';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct, isLoading, error: productError } = useSelector((state) => state.product);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [autoSlide, setAutoSlide] = useState(true);

  const images = [
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
  ];

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
    return () => {
      dispatch(resetCurrentProduct());
    };
  }, [dispatch, productId]);

  useEffect(() => {
    if (currentProduct) {
      if (currentProduct.availableSizes && currentProduct.availableSizes.length > 0) {
        setSelectedSize(currentProduct.availableSizes[0]);
      } else if (currentProduct.weight) { // Fallback to weight if availableSizes is not present
        setSelectedSize(currentProduct.weight);
      }
      if (currentProduct.availableColors && currentProduct.availableColors.length > 0) {
        setSelectedColor(currentProduct.availableColors[0]);
      }
      setSelectedImageIndex(0);
    }
  }, [currentProduct]);

  const productImages = currentProduct?.images?.map(img => `http://localhost:2221/${img}`) || [];

  // Auto slide effect
  useEffect(() => {
    if (autoSlide && productImages.length > 1) {
      const interval = setInterval(() => {
        setSelectedImageIndex(prev => (prev + 1) % productImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoSlide, productImages.length]);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setAutoSlide(false);
    setTimeout(() => setAutoSlide(true), 10000); // Resume auto-slide after 10 seconds
  };

  const nextImage = () => {
    if (productImages.length === 0) return;
    setSelectedImageIndex(prev => (prev + 1) % productImages.length);
    setAutoSlide(false);
    setTimeout(() => setAutoSlide(true), 10000);
  };

  const prevImage = () => {
    if (productImages.length === 0) return;
    setSelectedImageIndex(prev => (prev - 1 + productImages.length) % productImages.length);
    setAutoSlide(false);
    setTimeout(() => setAutoSlide(true), 10000);
  };

  const availableSizes = currentProduct?.availableSizes || (currentProduct?.weight ? [currentProduct.weight] : []);
  const availableColors = currentProduct?.availableColors || [];

  const ratingData = [
    { stars: 5, percentage: currentProduct?.ratingBreakdown?.fiveStarPercentage || 0 },
    { stars: 4, percentage: currentProduct?.ratingBreakdown?.fourStarPercentage || 0 },
    { stars: 3, percentage: currentProduct?.ratingBreakdown?.threeStarPercentage || 0 },
    { stars: 2, percentage: currentProduct?.ratingBreakdown?.twoStarPercentage || 0 },
    { stars: 1, percentage: currentProduct?.ratingBreakdown?.oneStarPercentage || 0 }
  ];
  const reviews = currentProduct?.reviews || [];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--dark-bg)', color: 'var(--dark-text)' }}>
        Loading product details...
      </div>
    );
  }

  if (productError) {
    toast.error(`Error: ${productError}`);
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--dark-bg)', color: 'var(--dark-text)' }}>
        Error loading product. Please try again later.
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--dark-bg)', color: 'var(--dark-text)' }}>
        Product not found.
      </div>
    );
  }

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
          <div className="main-image" onClick={() => productImages.length > 0 && setShowZoom(true)}>
            {productImages.length > 0 ? (
              <img src={productImages[selectedImageIndex]} alt={currentProduct.productName} className="slide-animation" />
            ) : (
              <img src="https://via.placeholder.com/500x500?text=No+Image" alt="Placeholder" />
            )}
            
            {productImages.length > 1 && (<>
            <button className="image-controls prev-btn" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
              <IoMdArrowDropleft />
            </button>
            <button className="image-controls next-btn" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
              <IoMdArrowDropright />
            </button>
            
            <button 
              className="auto-slide-toggle"
              onClick={(e) => { e.stopPropagation(); setAutoSlide(!autoSlide); }}
            >
              {autoSlide ? <><FaPause /> Pause</> : <><FaPlay /> Play</>}
            </button>
            
            <div className="image-indicators">
              {productImages.map((_, index) => (
                <div
                  key={index}
                  className={`indicator ${selectedImageIndex === index ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); handleImageClick(index); }}
                />
              ))}
            </div>
            </>)}
          </div>
          
          {productImages.length > 1 && (
          <div className="thumbnail-grid">
            {productImages.map((img, index) => (
              <div
                key={index}
                className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                onClick={() => handleImageClick(index)}
              >
                <img src={img} alt={`View ${index + 1} of ${currentProduct.productName}`} />
              </div>
            ))}
          </div>
          )}
        </div>

        {/* Details Section */}
        <div className="details-section">
          <h1 className="product-title">{currentProduct.productName}</h1>
          <p className="product-id">Product ID: {currentProduct.SKU || currentProduct._id}</p>
          
          <p className="product-description">
            {currentProduct.description || 'No description available.'}
          </p>

          <div className="stats-card">
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">$120.40</span>
                <span className="stat-label">${currentProduct.price?.toFixed(2)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{currentProduct.stock}</span>
                <span className="stat-label">In Stock</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{currentProduct.averageRating || 'N/A'} <FaStar size={14}/></span>
                <span className="stat-label">Rating</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{reviews.length || 0}</span>
                <span className="stat-label">Reviews</span>
              </div>
            </div>
          </div>

          {availableSizes.length > 0 && (
          <div className="option-section">
            <div className="option-label">Size</div>
            <div className="size-options">
              {availableSizes.map((size) => (
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
          )}
       
          {/* Feature Tags */}
          {currentProduct.tags && currentProduct.tags.length > 0 && (
          <div className="feature-tags">
            {currentProduct.tags.map(tag => (
              <span className="feature-tag" key={tag}><GiStarFormation /> {tag}</span>
            ))}
          </div>
          )}

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
                {currentProduct.material && <tr><td>Material</td><td>{currentProduct.material}</td></tr>}
                {currentProduct.fit && <tr><td>Fit</td><td>{currentProduct.fit}</td></tr>}
                {currentProduct.dimensions && <tr><td>Dimensions</td><td>{currentProduct.dimensions}</td></tr>}
                {currentProduct.weight && <tr><td>Weight</td><td>{currentProduct.weight}</td></tr>}
                {currentProduct.careInstructions && <tr><td>Care</td><td>{currentProduct.careInstructions}</td></tr>}
                {currentProduct.brand && <tr><td>Brand</td><td>{currentProduct.brand}</td></tr>}
                {currentProduct.originCountry && <tr><td>Origin</td><td>{currentProduct.originCountry}</td></tr>}
                {currentProduct.specifications && Object.entries(currentProduct.specifications).map(([key, value]) => (
                    <tr key={key}>
                        <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                        <td>{value}</td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(currentProduct.averageRating || reviews.length > 0) && (
          <div className="info-card">
            <h3 className="info-title">Ratings & Reviews</h3>
            {currentProduct.averageRating && (
            <div className="rating-header">
              <div className="rating-score">{currentProduct.averageRating.toFixed(1)}</div>
              <div className="rating-text">Based on {reviews.length} rating{reviews.length !== 1 && 's'}</div>
            </div>
            )}
            
            {currentProduct.ratingBreakdown && (
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
            )}

            {reviews.map((review, index) => (
              <div key={review._id || index} className="review-item">
                <div className="reviewer-name">{review.userName || review.userId?.name || 'Anonymous'}</div>
                 <div className="d-flex align-items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                        <FaStar key={i} color={i < review.rating ? '#ffc107' : '#e0e0e0'} />
                    ))}
                </div>
                <div className="review-text">{review.comment}</div>
                {review.images && review.images.length > 0 && (
                  <div className="review-images">
                    {review.images.map((img, imgIdx) => (
                      <img key={imgIdx} src={`http://localhost:2221/${img}`} alt={`Review image ${imgIdx + 1}`} className="review-image" />
                    ))}
                  </div>
                )}
                <div className="review-date">{new Date(review.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>

      {/* Zoom Overlay */}
      {showZoom && productImages.length > 0 && (
        <div className="zoom-overlay" onClick={() => setShowZoom(false)}>
          <img src={productImages[selectedImageIndex]} alt={`Zoomed ${currentProduct.productName}`} className="zoom-image" />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;