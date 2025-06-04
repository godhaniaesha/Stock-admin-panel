import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/x_app.css';
import { FaDollarSign } from 'react-icons/fa';
import { CiDiscount1 } from "react-icons/ci";
import { MdReceipt } from "react-icons/md";
import { useOutletContext } from 'react-router-dom';
import { createProduct } from '../redux/slice/product.slice';
import { fetchCategories } from '../redux/slice/category.slice';
import { fetchSubcategories } from '../redux/slice/subCategory.slice';

const AddProduct = () => {
    const { isDarkMode } = useOutletContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const productState = useSelector((state) => state.product || {});
    const { isLoading = false, error: productError = null, success = false } = productState;

    const categoryState = useSelector((state) => state.category || {});
    const { categories = [], isLoading: categoriesLoading = false } = categoryState;

    const subcategoryState = useSelector((state) => state.subcategory || {});
    const { subcategories = [], isLoading: subcategoriesLoading = false } = subcategoryState;

    const [productData, setProductData] = useState({
        categoryId: '',
        subcategoryId: '',
        productName: '',
        brand: '',
        weight: '',
        gender: '',
        description: '',
        tagNumber: '',
        stock: '',
        price: '',
        discount: '',
        tax: '',
        sku: '',
        images: [],
        tags: []
    });

    const [selectedSize, setSelectedSize] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [productImage, setProductImage] = useState(null);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [formError, setFormError] = useState('');
    const [isGenderOpen, setIsGenderOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchSubcategories());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            navigate('/products');
        }
    }, [success, navigate]);

    const handleSubcategorySelect = (subcategoryId) => {
        setProductData(prev => ({ ...prev, subcategoryId }));
        setIsSubcategoryOpen(false);
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
        setFormError('');

        if (!file) {
            setFormError('Please select a file');
            return;
        }

        const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setFormError('Invalid file type. Only PNG, JPG and JPEG are allowed');
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setFormError('File size exceeds 5MB limit');
            return;
        }

        const imageUrl = URL.createObjectURL(file);
        setProductImage(imageUrl);
        setProductData(prev => ({
            ...prev,
            images: [file]
        }));
    };

    const handleTagInput = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            const newTags = [...tags, tagInput.trim()];
            setTags(newTags);
            setProductData(prev => ({
                ...prev,
                tags: newTags
            }));
            setTagInput('');
            e.preventDefault();
        }
    };

    const removeTag = (tagToRemove) => {
        const newTags = tags.filter(tag => tag !== tagToRemove);
        setTags(newTags);
        setProductData(prev => ({
            ...prev,
            tags: newTags
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        // Validate required fields
        if (!productData.categoryId) {
            setFormError('Please select a category');
            return;
        }
        if (!productData.subcategoryId) {
            setFormError('Please select a subcategory');
            return;
        }
        if (!productData.productName) {
            setFormError('Please enter product name');
            return;
        }
        if (!productData.brand) {
            setFormError('Please enter brand name');
            return;
        }
        if (!productData.price) {
            setFormError('Please enter price');
            return;
        }
        if (!productData.stock) {
            setFormError('Please enter stock quantity');
            return;
        }
        if (!productData.images || productData.images.length === 0) {
            setFormError('Please upload at least one product image');
            return;
        }

        const formData = new FormData();

        // Get seller ID from localStorage
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                setFormError('User data not found. Please login again.');
                return;
            }
            const userData = JSON.parse(userStr);
            if (!userData || !userData._id) {
                setFormError('Invalid user data. Please login again.');
                return;
            }
            formData.append('sellerId', userData._id);
        } catch (error) {
            setFormError('Error reading user data. Please login again.');
            return;
        }

        // Add all product data to formData
        formData.append('categoryId', productData.categoryId);
        formData.append('subcategoryId', productData.subcategoryId);
        formData.append('productName', productData.productName);
        formData.append('brand', productData.brand);
        formData.append('price', productData.price);
        formData.append('stock', productData.stock);

        // Add optional fields if they exist
        if (productData.weight) formData.append('weight', productData.weight);
        if (productData.gender) formData.append('gender', productData.gender);
        if (productData.description) formData.append('description', productData.description);
        if (productData.tagNumber) formData.append('tagNumber', productData.tagNumber);
        if (productData.discount) formData.append('discount', productData.discount);
        if (productData.tax) formData.append('tax', productData.tax);
        if (productData.sku) formData.append('sku', productData.sku);

        // Add images
        productData.images.forEach(image => {
            formData.append('images', image);
        });

        // Add sizes and colors if selected
        if (selectedSize.length > 0) {
            selectedSize.forEach(size => formData.append('sizes', size));
        }
        if (selectedColors.length > 0) {
            selectedColors.forEach(color => formData.append('colors', color));
        }

        // Add tags if any
        if (productData.tags.length > 0) {
            productData.tags.forEach(tag => formData.append('tags', tag));
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setFormError('Authentication token not found. Please login again.');
                return;
            }

            const response = await dispatch(createProduct({
                formData,
                config: {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }
            })).unwrap();

            if (response.success) {
                navigate('/products');
            } else {
                setFormError(response.message || 'Failed to create product');
            }
        } catch (err) {
            setFormError(err.message || 'Failed to create product');
        }
    };

    // Get filtered subcategories based on selected category
    // const getFilteredSubcategories = () => {
    //     if (!productData.categoryId) {
    //         return []; // No subcategories if no category selected
    //     }
    //     return subcategories.filter(sub => sub.categoryId === productData.categoryId);
    // };

    const filteredSubcategories = subcategories.filter(
        sub => sub.category?._id === productData.categoryId
    );

    const handleCategorySelect = (categoryId) => {
        setProductData(prev => ({ 
            ...prev, 
            categoryId,
            subcategoryId: '' // Reset subcategory when category changes
        }));
        setIsCategoryOpen(false);
    };

    return (
        <div className={`x_product_page_container w-100 ${isDarkMode ? 'd_dark' : 'd_light'}`}>
            <div className="x_add_product_container">
                {/* Image Upload Section */}
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
                            {productImage ? (
                                <img src={productImage} alt="Product Preview" className="x_product_image_preview" />
                            ) : (
                                <div className="x_upload_content">
                                    <div className="x_upload_icon">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--accent-color)">
                                            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                                        </svg>
                                    </div>
                                    <p className="x_upload_text">Drop your images here, or <span className="x_browse_text">click to browse</span></p>
                                    <p className="x_upload_hint">Maximum file size: 5MB. Allowed formats: PNG, JPG, JPEG</p>
                                </div>
                            )}

                            {(formError || productError) && <p className="x_error_message">{formError || productError}</p>}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="x_product_form">
                    <div className="x_product_info">
                        <h2 className="x_product_title">Product Information</h2>

                        <div className='x_form_p'>
                            <div className="x_form_row">
                                <div className="x_form_group">
                                    <label>Category</label>
                                    <div className="x_custom_dropdown">
                                        <div
                                            className="x_dropdown_header"
                                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                        >
                                            <span>
                                                {categoriesLoading ? 'Loading categories...' :
                                                    categories.find(cat => cat._id === productData.categoryId)?.title || 'Select Category'}
                                            </span>
                                            <svg
                                                className={`x_dropdown_arrow ${isCategoryOpen ? 'open' : ''}`}
                                                width="10"
                                                height="6"
                                                viewBox="0 0 10 6"
                                            >
                                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                            </svg>
                                        </div>
                                        {isCategoryOpen && !categoriesLoading && (
                                            <div className="x_dropdown_options">
                                                {categories.map((category) => (
                                                    <div
                                                        key={category._id}
                                                        className="x_dropdown_option"
                                                        onClick={() => handleCategorySelect(category._id)}
                                                    >
                                                        {category.title}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="x_form_group">
                                    <label>Subcategory</label>
                                    <div className="x_custom_dropdown">
                                        <div
                                            className="x_dropdown_header"
                                            onClick={() => setIsSubcategoryOpen(!isSubcategoryOpen)}
                                        >
                                            <span>
                                                {subcategoriesLoading ? 'Loading subcategories...' :
                                                    !productData.categoryId ? 'Select Category First' :
                                                    subcategories.find(sub => sub._id === productData.subcategoryId)?.subcategoryTitle || 'Select Subcategory'}
                                            </span>
                                            <svg
                                                className={`x_dropdown_arrow ${isSubcategoryOpen ? 'open' : ''}`}
                                                width="10"
                                                height="6"
                                                viewBox="0 0 10 6"
                                            >
                                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                            </svg>
                                        </div>
                                        {isSubcategoryOpen && !subcategoriesLoading && productData.categoryId && (
                                            <div className="x_dropdown_options">
                                                {filteredSubcategories.map((subcategory) => (
                                                    <div
                                                        key={subcategory._id}
                                                        className="x_dropdown_option"
                                                        onClick={() => handleSubcategorySelect(subcategory._id)}
                                                    >
                                                        {subcategory.subcategoryTitle}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
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
                            </div>

                            <div className="x_form_row">

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

                    {/* Pricing Details */}
                    <div className="mt-3">
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
                        <button
                            type="submit"
                            className="x_btn x_btn_create"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating...' : 'Create Product'}
                        </button>
                        <button
                            type="button"
                            className="x_btn x_btn_cancel"
                            onClick={() => navigate('/products')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;