import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, resetCurrentProduct } from '../redux/slice/product.slice';
import { BsLightningFill } from 'react-icons/bs';
// Import icons from a chosen library (e.g., Font Awesome)
import { FaHeart, FaRegHeart, FaShoppingCart, FaShippingFast, FaUndo, FaStar, FaPlay, FaPause, FaLock } from 'react-icons/fa';
import { GiStarFormation } from 'react-icons/gi';
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';
import { MdStars } from 'react-icons/md';
import { toast } from 'react-toastify';
import { IMG_URL } from '../utils/baseUrl';

const ProductDetail = () => {
  const { id: productId } = useParams();
  const { isDarkMode } = useOutletContext();
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

  const productImages = currentProduct?.images?.map(img => `${IMG_URL}${img}`) || [];

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
    }}
      className={`Z_product_section ${isDarkMode ? 'd_dark' : 'd_light'}`}
    >
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
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem; /* Increased gap for more breathing room */
          align-items: start;
          padding: 1rem; /* Increased padding */
          background: var(--dark-card-bg); /* Use card background for container */
          border-radius: 12px; /* Softer rounded corners */
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); /* More prominent shadow */
        }

        .image-section {
          position: sticky;
          top: 1rem; /* Adjust sticky position */
          background: var(--dark-card-bg);
          padding: 1rem;
          border-radius: 12px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2); /* Subtle shadow */
        }

        .main-image {
          position: relative;
          border-radius: 10px; /* Consistent rounded corners */
          overflow: hidden;
          margin-bottom: 1rem; /* Increased margin */
          background: var(--dark-bg);
          aspect-ratio: 1;
          cursor: zoom-in;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease-in-out; /* Smoother transition */
        }

        .main-image:hover img {
          transform: scale(1.08); /* Slightly more zoom on hover */
        }

        .product-badge {
          background: linear-gradient(135deg, var(--accent-color), var(--accent-hover-color));
          color: white;
          padding: 0.4rem 0.9rem; /* Larger padding */
          border-radius: 20px; /* More pill-shaped */
          font-size: 0.8rem; /* Slightly larger font */
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px; /* Increased gap */
          margin-bottom: 1rem; /* Increased margin */
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .details-section {
          padding: 1rem;
          background: var(--dark-card-bg);
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); /* Consistent prominent shadow */
        }

        .product-title {
          font-size: 2rem; /* Larger title */
          font-weight: 800; /* Bolder */
          margin-bottom: 0.5rem; /* More spacing */
          color: var(--dark-text-secondary);
          line-height: 1.2;
        }

        .product-id {
          color: #a0a0a0; /* Slightly lighter gray */
          font-size: 0.8rem;
          margin-bottom: 1rem; /* More spacing */
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--dark-border);
        }

        .product-description {
          color: var(--dark-text);
          line-height: 1.6; /* Increased line height for readability */
          margin-bottom: 1.5rem; /* More spacing */
          font-size: 0.95rem; /* Slightly larger font */
        }

        .stats-card {
          background: var(--dark-bg);
          border-radius: 10px;
          padding: 1rem; /* Increased padding */
          margin-bottom: 1.5rem; /* More spacing */
          border: 1px solid var(--dark-border);
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem; /* Increased gap */
        }

        .stat-item {
          text-align: center;
          padding: 0.8rem; /* Increased padding */
          background: var(--dark-card-bg);
          border-radius: 8px; /* Softer rounded corners */
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow for stat items */
        }

        .stat-item:hover {
          transform: translateY(-8px); /* More pronounced lift on hover */
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
        }

        .stat-value {
          font-size: 1.4rem; /* Larger stat values */
          font-weight: 700;
          color: var(--accent-color);
          display: block;
          margin-bottom: 0.2rem;
        }

        .stat-label {
          font-size: 0.75rem; /* Slightly larger label */
          color: var(--dark-text);
          text-transform: uppercase;
          letter-spacing: 0.7px; /* Increased letter spacing */
        }

        .original-price {
            text-decoration: line-through;
            color: #888; /* Muted color for original price */
            font-size: 0.8rem;
            margin-top: 0.2rem;
            display: block;
        }

        .sale-price {
            font-size: 1.8rem; /* Larger sale price */
            font-weight: 800;
            color: var(--accent-color); /* Highlight with accent color */
        }
        
        .option-section {
          margin-bottom: 1.5rem;
          background: var(--dark-bg);
          padding: 1rem;
          border-radius: 10px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        }

        .option-label {
          font-weight: 600;
          margin-bottom: 0.8rem;
          color: var(--dark-text-secondary);
          font-size: 1rem;
        }

        .size-options {
          display: flex;
          gap: 0.7rem; /* Increased gap */
          margin-bottom: 1.2rem;
          flex-wrap: wrap;
        }

        .size-btn {
          padding: 0.4rem 0.9rem; /* Larger padding */
          border: 1px solid var(--dark-border);
          background: var(--dark-card-bg);
          color: var(--dark-text);
          border-radius: 6px; /* Softer rounded corners */
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          min-width: 50px; /* Slightly larger minimum width */
          text-align: center;
        }

        .size-btn:hover {
          border-color: var(--accent-color);
          transform: translateY(-3px); /* More pronounced lift */
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .size-btn.active {
          border-color: var(--accent-color);
          background: var(--accent-color);
          color: white;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 1rem; /* Increased gap */
          margin: 1rem 0;
          background: var(--dark-bg);
          padding: 0.8rem; /* Increased padding */
          border-radius: 10px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          background: var(--dark-card-bg);
          border-radius: 6px;
          border: 1px solid var(--dark-border);
          overflow: hidden;
        }

        .quantity-btn {
          background: none;
          border: none;
          color: var(--dark-text);
          padding: 0.4rem 0.9rem; /* Larger padding */
          cursor: pointer;
          font-size: 1.1rem; /* Larger font size */
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
          width: 35px; /* Slightly wider */
          padding: 0.3rem;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .action-buttons {
          display: flex;
          align-items: center;
          gap: 0.8rem; /* Increased gap */
          margin: 1rem 0;
          background: var(--dark-bg);
          padding: 0.8rem; /* Increased padding */
          border-radius: 10px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        }

        .action-buttons .quantity-selector {
          flex: 0 0 auto;
          margin: 0;
          padding: 0;
          background: none;
          box-shadow: none;
          gap: 0.5rem; /* Reduced gap within selector for compactness */
        }

        .action-buttons .quantity-selector .option-label {
          margin-bottom: 0;
          margin-right: 0.5rem; /* Increased margin */
          white-space: nowrap;
          align-self: center;
          font-size: 0.9rem; /* Adjusted font size */
        }

        .action-buttons .quantity-selector .quantity-controls {
          border: 1px solid var(--dark-border); /* Re-added border for controls */
          background: var(--dark-card-bg); /* Re-added background */
        }

        .action-buttons .quantity-selector .quantity-btn {
          padding: 0.3rem 0.6rem; /* Adjusted padding */
          font-size: 0.9rem; /* Adjusted font size */
        }

        .action-buttons .quantity-selector .quantity-input {
          width: 30px; /* Adjusted width */
          padding: 0.2rem;
          font-size: 0.8rem;
        }

        .primary-btn {
          flex: 1;
          max-width: none;
          padding: 0.8rem 1.2rem; /* Larger padding */
          background: linear-gradient(135deg, var(--accent-color), var(--accent-hover-color));
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem; /* Slightly larger font */
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        .primary-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(92, 184, 92, 0.4); /* More vivid shadow */
        }

        .secondary-btn {
          flex: 0 0 auto;
          max-width: 90px; /* Slightly wider */
          padding: 0.8rem; /* Increased padding */
          background: var(--dark-card-bg);
          color: var(--dark-text);
          border: 1px solid var(--dark-border);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem; /* Slightly larger font */
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .secondary-btn:hover {
          border-color: var(--accent-color);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(92, 184, 92, 0.3);
        }

        .secondary-btn.active {
          background: var(--accent-color);
          color: white;
          border-color: var(--accent-color);
        }

        .shipping-info {
          background: var(--dark-bg);
          border-radius: 10px;
          padding: 1rem;
          margin: 1rem 0;
          border-left: 3px solid var(--accent-color); /* Thicker accent border */
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        }

        .shipping-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.8rem; /* More spacing */
          padding: 0.5rem; /* Increased padding */
          background: var(--dark-card-bg);
          border-radius: 6px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .shipping-row:hover {
          transform: translateX(8px); /* More pronounced slide */
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .shipping-row:last-child {
          margin-bottom: 0;
        }

        .info-card {
          background: var(--dark-bg);
          border-radius: 10px;
          padding: 1rem;
          margin-bottom: 1rem;
          border: 1px solid var(--dark-border);
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        }

        .info-title {
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--dark-text-secondary);
          font-size: 1.1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--dark-border);
        }

        .info-table {
          width: 100%;
        }

        .info-table tr {
          border-bottom: 1px solid var(--dark-border);
        }

        .info-table tr:last-child {
            border-bottom: none; /* No border for the last row */
        }

        .info-table td {
          padding: 0.8rem 0; /* More padding */
          vertical-align: top;
        }

        .info-table td:first-child {
          font-weight: 500;
          color: var(--dark-text);
          width: 35%; /* Slightly wider first column */
        }

        .feature-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem; /* Increased gap */
          margin: 1rem 0;
        }

        .feature-tag {
          background: rgba(92, 184, 92, 0.15); /* Use more vibrant accent color for background */
          color: var(--accent-color);
          padding: 0.3rem 0.7rem; /* Larger padding */
          border-radius: 15px; /* More pill-shaped */
          font-size: 0.8rem;
          border: 1px solid rgba(92, 184, 92, 0.4); /* Stronger border */
          display: flex;
          align-items: center;
          gap: 5px;
          transition: all 0.3s ease;
        }

        .feature-tag:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .rating-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
            padding-bottom: 0.8rem;
            border-bottom: 1px solid var(--dark-border);
        }

        .rating-score {
            font-size: 2.2rem;
            font-weight: 800;
            color: var(--accent-color);
        }

        .rating-text {
            color: var(--dark-text);
            font-size: 0.9rem;
        }

        .rating-bars {
            margin-bottom: 1.5rem;
        }

        .rating-row {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.4rem;
        }

        .rating-stars {
            font-size: 0.85rem;
            color: var(--dark-text);
            display: flex;
            align-items: center;
            gap: 3px;
            width: 50px; /* Fixed width for stars */
            justify-content: flex-end; /* Align stars to the right */
        }

        .progress-bar-bg {
            flex-grow: 1;
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
        }

        .progress-bar-fill {
            height: 100%;
            background: var(--accent-color);
            border-radius: 4px;
            transition: width 0.5s ease-out;
        }

        .review-item {
            background: var(--dark-card-bg);
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            border: 1px solid var(--dark-border);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .reviewer-name {
            font-weight: 600;
            color: var(--dark-text-secondary);
            margin-bottom: 0.4rem;
        }

        .review-text {
            color: var(--dark-text);
            font-size: 0.9rem;
            line-height: 1.5;
            margin-bottom: 0.6rem;
        }

        .review-images {
            display: flex;
            gap: 0.5rem;
            margin-top: 0.5rem;
            flex-wrap: wrap;
        }

        .review-image {
            width: 70px;
            height: 70px;
            object-fit: cover;
            border-radius: 4px;
            border: 1px solid var(--dark-border);
        }

        .review-date {
            font-size: 0.75rem;
            color: #a0a0a0;
            margin-top: 0.6rem;
            text-align: right;
        }

        @media (max-width: 768px) {
          .product-container {
            grid-template-columns: 1fr;
            gap: 0.8rem;
            padding: 0.8rem;
          }
          
          .product-title {
            font-size: 1.8rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.8rem;
          }

          .image-section,
          .details-section,
          .stats-card,
          .option-section,
          .quantity-selector,
          .action-buttons,
          .shipping-info,
          .info-card {
            padding: 0.8rem;
          }

          .product-badge {
            font-size: 0.7rem;
            padding: 0.3rem 0.8rem;
          }

          .stat-value {
            font-size: 1.3rem;
          }

          .stat-label {
            font-size: 0.65rem;
          }

          .primary-btn,
          .secondary-btn {
            font-size: 0.8rem;
            padding: 0.7rem 1rem;
          }

          .quantity-selector .option-label {
            font-size: 0.8rem;
          }

          .quantity-selector .quantity-btn {
            font-size: 0.85rem;
            padding: 0.25rem 0.5rem;
          }

          .quantity-selector .quantity-input {
            width: 28px;
            font-size: 0.7rem;
          }
            .zoom-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.zoom-modal-content {
  position: relative;
  background: #222;
  padding: 1rem;
  border-radius: 8px;
  max-width: 95vw;
  max-height: 95vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.zoom-modal-close {
  position: absolute;
  top: 8px; right: 12px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
}
.zoomed-image {
  max-width: 90vw;
  max-height: 80vh;
  border-radius: 8px;
}
        }
      `}</style>

      <div className={`product-container `}>
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
            // <div className="thumbnail-grid">
            //   {productImages.map((img, index) => (
            //     <div
            //       key={index}
            //       className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
            //       onClick={() => handleImageClick(index)}
            //     >
            //       <img src={img} alt={`View ${index + 1} of ${currentProduct.productName}`} />
            //     </div>
            //   ))}
            // </div>
            <div className="thumbnail-grid">
              {productImages.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                  onClick={() => handleImageClick(index)}
                >
                  <img src={`${IMG_URL}${img}`} alt={`View ${index + 1} of ${currentProduct.productName}`} />
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
                <span className="sale-price">${currentProduct.price?.toFixed(2)}</span>
                <span className="original-price">$700.00</span> {/* Hardcoded for now, will connect to backend if available */}
              </div>
              <div className="stat-item">
                <span className="stat-value">{currentProduct.stock}</span>
                <span className="stat-label">In Stock</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{currentProduct.averageRating || 'N/A'} <FaStar size={14} /></span>
                <span className="stat-label">Rating</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{reviews.length || 0}</span>
                <span className="stat-label">Reviews</span>
              </div>
            </div>
          </div>



          {/* Feature Tags */}
          {currentProduct.tags && currentProduct.tags.length > 0 && (
            <div className="feature-tags">
              {currentProduct.tags.map(tag => (
                <span className="feature-tag" key={tag}><GiStarFormation /> {tag}</span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
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
                    <img key={imgIdx} src={`${IMG_URL}${img}`} alt={`Review image ${imgIdx + 1}`} className="review-image" />
                  ))}
                </div>
              )}
              <div className="review-date">{new Date(review.createdAt).toLocaleDateString()}</div>
            </div>
          ))}




        </div>
      </div>

      {
        showZoom && (
          <div className={`zoom-modal-overlay`} onClick={() => setShowZoom(false)}>
            <div className="zoom-modal-content" onClick={e => e.stopPropagation()}>
              <button className="zoom-modal-close" onClick={() => setShowZoom(false)}>×</button>
              <img
                src={productImages[selectedImageIndex]}
                alt={currentProduct.productName}
                className="zoomed-image"
                style={{ maxWidth: '70vw', maxHeight: '70vh' }}
              />
            </div>
          </div>
        )
      }
    </div >
  );
};

export default ProductDetail;