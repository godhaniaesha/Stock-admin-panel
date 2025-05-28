import React, { useState } from 'react';
import '../styles/x_app.css';
import { FaDollarSign } from 'react-icons/fa';
import { CiDiscount1 } from "react-icons/ci";
import { MdReceipt } from "react-icons/md";

const EditProduct = () => {
    const [productData, setProductData] = useState({
        productName: '',
        brand: '',
        weight: '',
        gender: '',
        description: '',
        tagNumber: '',
        stock: ''
    });

    const [selectedSize, setSelectedSize] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [productImage, setProductImage] = useState(null);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [error, setError] = useState('');
    const [isGenderOpen, setIsGenderOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    const categoryOptions = [
        { value: 'clothing', label: 'Clothing' },
        { value: 'shoes', label: 'Shoes' },
        { value: 'accessories', label: 'Accessories' }
    ];

    const handleCategorySelect = (value) => {
        setProductData(prev => ({ ...prev, category: value }));
        setIsCategoryOpen(false);
    };

    const genderOptions = [
        { value: 'men', label: 'Men' },
        { value: 'women', label: 'Women' },
        { value: 'other', label: 'Other' }
    ];

    const handleGenderSelect = (value) => {
        setProductData(prev => ({ ...prev, gender: value }));
        setIsGenderOpen(false);
    };

    const validateAndHandleFile = (file) => {
        // Reset error state
        setError('');

        // Check if file exists
        if (!file) {
            setError('Please select a file');
            return;
        }

        // Check file type
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setError('Invalid file type. Only PNG, JPG and JPEG are allowed');
            return;
        }

        // Check file size (5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            setError('File size exceeds 5MB limit');
            return;
        }

        // If validation passes, create URL and set image
        const imageUrl = URL.createObjectURL(file);
        setProductImage(imageUrl);
    };

    const handleTagInput = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
            e.preventDefault();
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProductImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };
    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageUpload({ target: { files: [files[0]] } });
        }
    };

    return (
        <div className="x_product_page_container">

            {/*  pro card */}
            <div className="x_add_product_container">

                {/* IMAGE */}
                <div className="x_upload_section">
                    <h2 className="x_product_title">Add Product Photo</h2>
                    <div className="x_upload_container x_form_p">
                        <div className="x_upload_area"
                            onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer.files[0];
                                validateAndHandleFile(file);
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => document.getElementById('fileInput').click()}
                        >
                            <input
                                type="file"
                                id="fileInput"
                                className="x_hidden_input"
                                onChange={(e) => validateAndHandleFile(e.target.files[0])}
                                accept=".png, .jpg, .jpeg"
                            />
                            <div className="x_upload_content">
                                <div className="x_upload_icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#ff6b35">
                                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                                    </svg>
                                </div>
                                <p className="x_upload_text">Drop your images here, or <span className="x_browse_text">click to browse</span></p>
                                <p className="x_upload_hint">Maximum file size: 5MB. Allowed formats: PNG, JPG, JPEG</p>
                                {error && <p className="x_error_message">{error}</p>}
                            </div>
                        </div>
                    </div>
                </div>


                <div className="x_product_form">
                    <div className="x_product_info">
                        <h2 className="x_product_title">Product Information</h2>

                        <div className='x_form_p'>
                            <div className="x_form_row">
                                <div className="x_form_group">
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        name="productName"
                                        placeholder="Items Name"
                                        value={productData.productName}
                                        onChange={handleInputChange}
                                        className="x_input"
                                    />
                                </div>
                                <div className="x_form_group">
                                    <label>Product Categories</label>
                                    <div className="x_custom_dropdown">
                                        <div
                                            className="x_dropdown_header"
                                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                        >
                                            <span>{productData.category || 'Choose a categories'}</span>
                                            <svg
                                                className={`x_dropdown_arrow ${isCategoryOpen ? 'open' : ''}`}
                                                width="10"
                                                height="6"
                                                viewBox="0 0 10 6"
                                            >
                                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                            </svg>
                                        </div>
                                        {isCategoryOpen && (
                                            <div className="x_dropdown_options">
                                                {categoryOptions.map((option) => (
                                                    <div
                                                        key={option.value}
                                                        className="x_dropdown_option"
                                                        onClick={() => handleCategorySelect(option.value)}
                                                    >
                                                        {option.label}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="x_form_row">
                                <div className="x_form_group">
                                    <label>Brand</label>
                                    <input
                                        type="text"
                                        name="brand"
                                        placeholder="Brand Name"
                                        value={productData.brand}
                                        onChange={handleInputChange}
                                        className="x_input"
                                    />
                                </div>
                                <div className="x_form_group">
                                    <label>Weight</label>
                                    <input
                                        type="text"
                                        name="weight"
                                        placeholder="In gm & kg"
                                        value={productData.weight}
                                        onChange={handleInputChange}
                                        className="x_input"
                                    />
                                </div>
                                <div className="x_form_group">
                                    <label>Gender</label>
                                    <div className="x_custom_dropdown">
                                        <div
                                            className="x_dropdown_header"
                                            onClick={() => setIsGenderOpen(!isGenderOpen)}
                                        >
                                            <span>{productData.gender || 'Select Gender'}</span>
                                            <svg
                                                className={`x_dropdown_arrow ${isGenderOpen ? 'open' : ''}`}
                                                width="10"
                                                height="6"
                                                viewBox="0 0 10 6"
                                            >
                                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                            </svg>
                                        </div>
                                        {isGenderOpen && (
                                            <div className="x_dropdown_options">
                                                {genderOptions.map((option) => (
                                                    <div
                                                        key={option.value}
                                                        className="x_dropdown_option"
                                                        onClick={() => handleGenderSelect(option.value)}
                                                    >
                                                        {option.label}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="x_form_row">
                                <div className="x_size_section x_form_group">
                                    <label>Size:</label>
                                    <div className="x_size_buttons">
                                        {['XS', 'S', 'M', 'XL', 'XXL', '3XL'].map(size => (
                                            <button
                                                key={size}
                                                type="button"
                                                className={`x_size_btn ${selectedSize.includes(size) ? 'x_selected' : ''}`}
                                                onClick={() => setSelectedSize(prev =>
                                                    prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
                                                )}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="x_form_row">
                                <div className="x_form_group x_full_width">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        placeholder="Short description about the product"
                                        value={productData.description}
                                        onChange={handleInputChange}
                                        className="x_textarea"
                                    />
                                </div>
                            </div>

                            <div className="x_form_row">
                                <div className="x_form_group">
                                    <label>Tag Number</label>
                                    <input
                                        type="text"
                                        name="tagNumber"
                                        placeholder="#******"
                                        value={productData.tagNumber}
                                        onChange={handleInputChange}
                                        className="x_input"
                                    />
                                </div>
                                <div className="x_form_group">
                                    <label>Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        placeholder="Quantity"
                                        value={productData.stock}
                                        onChange={handleInputChange}
                                        className="x_input"
                                    />
                                </div>
                                <div className="x_form_group">
                                    <label>Tag</label>
                                    <input
                                        type="text"
                                        className="x_input"
                                        placeholder="Type and press Enter"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleTagInput}
                                    />
                                    <div className="x_tags_container">
                                        {tags.map((tag, index) => (
                                            <div key={index} className="x_tag">
                                                <span className="x_tag_label">{tag}</span>
                                                <button
                                                    type="button"
                                                    className="x_tag_remove"
                                                    onClick={() => removeTag(tag)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Details */}
                <div className="x_product_form mt-3">
                    <h2 className="x_product_title">Pricing Details</h2>
                    <div className="x_form_p">
                        <div className="x_form_row">
                            <div className="x_form_group">
                                <label>Price</label>
                                <div className="x_input_group">
                                    <span className="x_input_icon">
                                        <FaDollarSign />
                                    </span>
                                    <input
                                        type="number"
                                        name="price"
                                        placeholder="000"
                                        value={productData.price}
                                        onChange={handleInputChange}
                                        className="x_input x_input_with_icon"
                                    />
                                </div>
                            </div>
                            <div className="x_form_group">
                                <label>Discount</label>
                                <div className="x_input_group">
                                    <span className="x_input_icon">
                                        <CiDiscount1 />
                                    </span>
                                    <input
                                        type="number"
                                        name="discount"
                                        placeholder="000"
                                        value={productData.discount}
                                        onChange={handleInputChange}
                                        className="x_input x_input_with_icon"
                                    />
                                </div>
                            </div>
                            <div className="x_form_group">
                                <label>Tax</label>
                                <div className="x_input_group">
                                    <span className="x_input_icon">
                                        <MdReceipt />
                                    </span>
                                    <input
                                        type="number"
                                        name="tax"
                                        placeholder="000"
                                        value={productData.tax}
                                        onChange={handleInputChange}
                                        className="x_input x_input_with_icon"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="x_btn_wrapper mt-3">
                    <button type="submit" className="x_btn x_btn_create">Save Changes</button>
                    <button type="button" className="x_btn x_btn_cancel">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;
