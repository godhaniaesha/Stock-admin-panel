import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/x_app.css';
import { FaDollarSign } from 'react-icons/fa';
import { CiDiscount1 } from "react-icons/ci";
import { MdReceipt } from "react-icons/md";
import { useOutletContext } from 'react-router-dom';
import { fetchProductById, updateProduct, clearProductError, clearProductSuccess } from '../redux/slice/product.slice';
import { fetchCategories, WaccessCategories } from '../redux/slice/category.slice';
import { fetchSubcategories, WaccesssubCategories } from '../redux/slice/subCategory.slice';

const EditProduct = () => {
    const { isDarkMode } = useOutletContext();
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentProduct, isLoading, error, success } = useSelector((state) => state.product);
    const { categories, isLoading: categoriesLoading } = useSelector((state) => state.category);
    const { subcategories, isLoading: subcategoriesLoading } = useSelector((state) => state.subcategory);

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
        lowStockThreshold: '',
        isActive: true
    });

    const [selectedSize, setSelectedSize] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [productImage, setProductImage] = useState(null);
    const [newImageFile, setNewImageFile] = useState(null);
    const [existingImagePath, setExistingImagePath] = useState(null);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [validationError, setValidationError] = useState('');
    const [isGenderOpen, setIsGenderOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false);

    const genderOptions = [
        { value: 'men', label: 'Men' },
        { value: 'women', label: 'Women' },
        { value: 'other', label: 'Other' }
    ];

    // Fetch categories and subcategories
    useEffect(() => {

        dispatch(WaccessCategories());
      
        dispatch(WaccesssubCategories());
    }, [dispatch]);

    // Fetch product data when component mounts or ID changes
    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id));
        }
    }, [dispatch, id]);

    console.log(currentProduct, "currentProduct");

    // Populate form when currentProduct is loaded
    useEffect(() => {
        if (currentProduct) {
            setProductData({
                categoryId: currentProduct.categoryId || '',
                subcategoryId: currentProduct.subcategoryId || '',
                productName: currentProduct.productName || '',
                brand: currentProduct.brand || '',
                weight: currentProduct.weight || '',
                gender: currentProduct.gender || '',
                description: currentProduct.description || '',
                tagNumber: currentProduct.tagNumber || '',
                stock: currentProduct.stock?.toString() || '',
                price: currentProduct.price?.toString() || '',
                discount: currentProduct.discount?.toString() || '',
                tax: currentProduct.tax?.toString() || '',
                sku: currentProduct.sku || '',
                lowStockThreshold: currentProduct.lowStockThreshold?.toString() || '',
                isActive: currentProduct.isActive !== undefined ? currentProduct.isActive : true
            });

            // Set tags
            if (currentProduct.tags && Array.isArray(currentProduct.tags)) {
                setTags(currentProduct.tags);
            }

            // Set product image
            if (currentProduct.images && currentProduct.images.length > 0) {
                setExistingImagePath(currentProduct.images[0]);
                setProductImage(`http://localhost:2221/${currentProduct.images[0]}`);
            } else {
                setProductImage(null);
                setExistingImagePath(null);
            }

            // Set sizes if available
            if (currentProduct.sizes && Array.isArray(currentProduct.sizes)) {
                setSelectedSize(currentProduct.sizes);
            } else {
                setSelectedSize([]);
            }

            // Set colors if available
            if (currentProduct.colors && Array.isArray(currentProduct.colors)) {
                setSelectedColors(currentProduct.colors);
            } else {
                setSelectedColors([]);
            }
        }
    }, [currentProduct]);

    // Handle success/error states
    useEffect(() => {
        if (success) {
            // alert('Product updated successfully!');
            navigate('/products/view')
            dispatch(clearProductSuccess());
        }
    }, [success, dispatch, navigate]);

    useEffect(() => {
        if (error) {
            console.error('Product error:', error);
        }
    }, [error, dispatch]);

    const handleCategorySelect = (categoryId) => {
        setProductData(prev => ({ ...prev, categoryId, subcategoryId: '' }));
        setIsCategoryOpen(false);
    };

    const handleSubcategorySelect = (subcategoryId) => {
        setProductData(prev => ({ ...prev, subcategoryId }));
        setIsSubcategoryOpen(false);
    };

    const handleGenderSelect = (value) => {
        setProductData(prev => ({ ...prev, gender: value }));
        setIsGenderOpen(false);
    };

    const validateAndHandleFile = (file) => {
        setValidationError('');

        if (!file) {
            setValidationError('Please select a file');
            return;
        }

        const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setValidationError('Invalid file type. Only PNG, JPG and JPEG are allowed');
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            setValidationError('File size exceeds 5MB limit');
            return;
        }

        // Create preview URL for display
        const reader = new FileReader();
        reader.onloadend = () => {
            setProductImage(reader.result);
        };
        reader.readAsDataURL(file);
        setNewImageFile(file);
    };

    const handleTagInput = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
            e.preventDefault();
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProductData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const generateSKU = () => {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const sku = `SKU${timestamp}${random}`;
        setProductData(prev => ({ ...prev, sku }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!id) {
            alert('Product ID is missing. Cannot update.');
            return;
        }

        const formData = new FormData();

        // Format the data properly before sending
        const formattedData = {
            ...productData,
            stock: parseInt(productData.stock) || 0,
            price: parseFloat(productData.price) || 0,
            discount: parseFloat(productData.discount) || 0,
            tax: parseFloat(productData.tax) || 0,
            lowStockThreshold: parseInt(productData.lowStockThreshold) || 5,
            isActive: productData.isActive === "true" || productData.isActive === true,
            tags: Array.isArray(tags) ? tags : [],
            sizes: Array.isArray(selectedSize) ? selectedSize : [],
            colors: Array.isArray(selectedColors) ? selectedColors : []
        };

        // Append all formatted data fields
        for (const key in formattedData) {
            if (key === 'images') continue; // Skip images as we'll handle it separately
            if (typeof formattedData[key] === 'object') {
                formData.append(key, JSON.stringify(formattedData[key]));
            } else {
                formData.append(key, formattedData[key]);
            }
        }

        // Handle image update
        if (newImageFile) {
            // If there's a new image, append it
            formData.append('images', newImageFile);
        } else if (existingImagePath) {
            // If there's an existing image and no new image, keep the existing one
            formData.append('existingImage', existingImagePath);
        }

        try {
            await dispatch(updateProduct({ id, productData: formData }));
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    // Get filtered subcategories based on selected category
    const getFilteredSubcategories = () => {
        if (!productData.categoryId) return [];
        return subcategories.filter(sub => sub.category && sub.category._id === productData.categoryId);
    };

    // Get category name by ID
    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat._id === categoryId);
        return category ? category.title : 'Select Category';
    };

    // Get subcategory name by ID
    const getSubcategoryName = (subcategoryId) => {
        const subcategory = subcategories.find(sub => sub._id === subcategoryId);
        return subcategory ? subcategory.subcategoryTitle : 'Select Subcategory';
    };

    // Loading state
    if (isLoading && !currentProduct) {
        return (
            <div className={`x_product_page_container Z_product_section  ${isDarkMode ? 'd_dark' : 'd_light'}`}>
                <div className="text-center p-5">
                    <h3>Loading product data...</h3>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !currentProduct) {
        return (
            <div className={`x_product_page_container Z_product_section  ${isDarkMode ? 'd_dark' : 'd_light'}`}>
                <div className="text-center p-5">
                    <h3 className="text-danger">Error loading product: {error}</h3>
                    <button onClick={() => navigate(-1)} className="btn btn-secondary mt-3">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`x_product_page_container Z_product_section  ${isDarkMode ? 'd_dark' : 'd_light'}`}>
            <form onSubmit={handleSubmit}>
                <div className="x_add_product_container">

                    {/* IMAGE */}
                    <div className="x_upload_section">
                        <h2 className="x_product_title">Edit Product Photo</h2>
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
                                    <div className="x_image_preview">
                                        <img
                                            src={productImage}
                                            alt="Product preview"
                                            className="x_preview_img"
                                        />
                                        <button 
                                            className="x_remove_image" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setProductImage(null);
                                                setNewImageFile(null);
                                                setExistingImagePath(null);
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <div className="x_upload_content">
                                        <div className="x_upload_icon">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--accent-color)">
                                                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                                            </svg>
                                        </div>
                                        <p className="x_upload_text">Drop your images here, or <span className="x_browse_text">click to browse</span></p>
                                        <p className="x_upload_hint">Maximum file size: 5MB. Allowed formats: PNG, JPG, JPEG</p>
                                        {validationError && <p className="x_error_message">{validationError}</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="x_product_form">
                        <div className="x_product_info">
                            <h2 className="x_product_title">Product Information</h2>

                            <div className='x_form_p'>
                                {/* Display any global errors */}
                                {error && (
                                    <div className="alert alert-danger mb-3">
                                        {error}
                                    </div>
                                )}

                                {/* Category and Subcategory Dropdowns */}
                                <div className="x_form_row">
                                    <div className="x_form_group">
                                        <label>Category</label>
                                        <div className="x_custom_dropdown">
                                            <div
                                                className="x_dropdown_header"
                                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                            >
                                                <span>


                                                    {categoriesLoading ? 'Loading categories...' : getCategoryName(productData.categoryId)}
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
                                            {isCategoryOpen && (
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
                                                    {subcategoriesLoading ? 'Loading subcategories...' : getSubcategoryName(productData.subcategoryId)}
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
                                            {isSubcategoryOpen && (
                                                <div className="x_dropdown_options">
                                                    {getFilteredSubcategories().length > 0 ? (
                                                        getFilteredSubcategories().map((subcategory) => (
                                                            <div
                                                                key={subcategory._id}
                                                                className="x_dropdown_option"
                                                                onClick={() => handleSubcategorySelect(subcategory._id)}
                                                            >
                                                                {subcategory.subcategoryTitle || subcategory.title}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="x_dropdown_option x_no_options">
                                                            {productData.categoryId ? 'No subcategories available' : 'Please select a category first'}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Product Name and Weight */}
                                <div className="x_form_row">
                                    <div className="x_form_group">
                                        <label>Product Name</label>
                                        <input
                                            type="text"
                                            name="productName"
                                            placeholder="Product Name"
                                            value={productData.productName}
                                            onChange={handleInputChange}
                                            className="x_input"
                                        />
                                    </div>
                                    <div className="x_form_group">
                                        <label>Weight</label>
                                        <input
                                            type="text"
                                            name="weight"
                                            placeholder="Weight (e.g., 250g)"
                                            value={productData.weight}
                                            onChange={handleInputChange}
                                            className="x_input"
                                        />
                                    </div>
                                </div>

                                {/* SKU and Low Stock Threshold */}
                                <div className="x_form_row">
                                    <div className="x_form_group">
                                        <label>SKU</label>
                                        <input
                                            type="text"
                                            name="sku"
                                            placeholder="SKU"
                                            value={productData.sku}
                                            onChange={handleInputChange}
                                            className="x_input"
                                        />
                                    </div>
                                    <div className="x_form_group">
                                        <label>Low Stock Threshold</label>
                                        <input
                                            type="number"
                                            name="lowStockThreshold"
                                            placeholder="Low Stock Threshold"
                                            value={productData.lowStockThreshold}
                                            onChange={handleInputChange}
                                            className="x_input"
                                        />
                                    </div>
                                </div>


                                {/* Description */}
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

                                {/* Tag Number, Stock, and Tags */}
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
                     
                            </div>
                        </div>
                    </div>

                    <div className="x_btn_wrapper mt-3">
                        <button
                            type="submit"
                            className="x_btn x_btn_create"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Updating...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            className="x_btn x_btn_cancel"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;