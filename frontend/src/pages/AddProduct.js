import React, { useState, useEffect } from 'react';
import '../styles/x_app.css';
import { FaDollarSign } from 'react-icons/fa';
import { CiDiscount1 } from "react-icons/ci";
import { MdReceipt } from "react-icons/md";
import { useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchCategories } from '../redux/slice/category.slice';
// import { fetchSubcategories } from '../redux/slice/subCategory.slice';
import { fetchCategories, WaccessCategories } from '../redux/slice/category.slice';
import { fetchSubcategories, WaccesssubCategories } from '../redux/slice/subCategory.slice';
import { createProduct } from '../redux/slice/product.slice';
import { createInventory } from '../redux/slice/inventory.Slice';
import { useNavigate } from 'react-router-dom';
import { RiAiGenerate } from 'react-icons/ri';

const AddProduct = () => {
    const { isDarkMode } = useOutletContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categories, isLoading: categoriesLoading } = useSelector((state) => state.category);
    const { subcategories, isLoading: subcategoriesLoading } = useSelector((state) => state.subcategory);
    const { isLoading: productLoading, error: productError, success } = useSelector((state) => state.product);

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
        sku: ''
    });

    const [selectedSize, setSelectedSize] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [productImage, setProductImage] = useState(null);
    const [fileError, setFileError] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [isGenderOpen, setIsGenderOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false);

    useEffect(() => {
        dispatch(WaccessCategories());
        dispatch(WaccesssubCategories());
    }, [dispatch]);

    const handleCategorySelect = (categoryId) => {
        setProductData(prev => ({ ...prev, categoryId, subcategoryId: '' }));
        setIsCategoryOpen(false);
    };

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
        setFileError('');
        setFormErrors(prev => ({ ...prev, image: null }));

        if (!file) {
            setFileError('Please select a file');
            return;
        }

        const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setFileError('Invalid file type. Only PNG, JPG and JPEG are allowed');
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            setFileError('File size exceeds 5MB limit');
            return;
        }

        const imageUrl = URL.createObjectURL(file);
        setProductImage({ url: imageUrl, file });
    };

    const handleTagInput = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            // Validate tag before adding
            if (tagInput.trim().length < 2) {
                setFormErrors(prev => ({
                    ...prev,
                    tags: 'Tags must be at least 2 characters long'
                }));
                return;
            }
            if (tagInput.trim().length > 20) {
                setFormErrors(prev => ({
                    ...prev,
                    tags: 'Tags cannot exceed 20 characters'
                }));
                return;
            }
            if (tags.length >= 10) {
                setFormErrors(prev => ({
                    ...prev,
                    tags: 'Maximum 10 tags allowed'
                }));
                return;
            }
            if (tags.includes(tagInput.trim())) {
                setFormErrors(prev => ({
                    ...prev,
                    tags: 'This tag already exists'
                }));
                return;
            }

            setTags([...tags, tagInput.trim()]);
            setTagInput('');
            setFormErrors(prev => ({ ...prev, tags: '' }));
            e.preventDefault();
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        // For numeric inputs, prevent negative sign
        if (['price', 'discount', 'tax', 'stock'].includes(name)) {
            // If the value starts with '-', remove the minus sign
            if (value.startsWith('-')) {
                newValue = value.replace(/^-/, '');
            }
        }

        setProductData(prev => ({
            ...prev,
            [name]: newValue
        }));
        // Clear error for this field when user types
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Add validation handlers
    const handleSKUInput = (e) => {
        const value = e.target.value.toUpperCase();
        if (value === '' || /^[A-Z0-9]{0,12}$/.test(value)) {
            handleInputChange({ ...e, target: { ...e.target, value } });
        }
    };

    const handleTagNumberInput = (e) => {
        const value = e.target.value.toUpperCase();
        // Always update the state, validation will be handled by validateForm
        setProductData(prev => ({ ...prev, tagNumber: value }));
        setFormErrors(prev => ({ ...prev, tagNumber: null })); // Clear error on change
    };

    const handleStockInput = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d+$/.test(value)) {
            handleInputChange(e);
        }
    };

    const handleBlur = () => {
        validateForm();
    };

    // Validation function
    const validateForm = () => {
        const errors = {};

        // Required fields validation
        if (!productData.categoryId) errors.categoryId = 'Category is required';
        if (!productData.subcategoryId) errors.subcategoryId = 'Subcategory is required';
        if (!productData.productName?.trim()) errors.productName = 'Product name is required';
        if (!productData.brand?.trim()) errors.brand = 'Brand is required';
        if (!productData.weight?.trim()) errors.weight = 'Weight is required';
        if (!productData.gender) errors.gender = 'Gender is required';
        if (!productData.description?.trim()) errors.description = 'Description is required';
        if (!productData.sku?.trim()) errors.sku = 'SKU is required';
        if (!productData.tagNumber?.trim()) {
            errors.tagNumber = 'Tag number is required';
        } else if (!/^#[A-Z0-9]{0,6}$/.test(productData.tagNumber)) {
            errors.tagNumber = 'Tag number must start with # and be followed by up to 6 alphanumeric characters (e.g., #ABC123)';
        }
        if (!productData.stock?.trim()) errors.stock = 'Stock is required';
        if (!productData.price?.trim()) errors.price = 'Price is required';
        if (!productImage) errors.image = 'Product image is required';

        // Format validation
        if (productData.price && isNaN(productData.price)) {
            errors.price = 'Price must be a number';
        }
        if (productData.stock && isNaN(productData.stock)) {
            errors.stock = 'Stock must be a number';
        }

        // Discount validation
        if (productData.discount !== undefined && productData.discount !== null) {
            const discountValue = Number(productData.discount);
            if (productData.discount.trim() === '' || isNaN(discountValue)) {
                errors.discount = '⚠️ Discount must be a number';
            } else if (discountValue < 0) {
                errors.discount = '⚠️ Discount cannot be negative';
            } else if (discountValue > 100) {
                errors.discount = '⚠️ Discount cannot exceed 100%';
            } else if (!Number.isInteger(discountValue)) {
                errors.discount = '⚠️ Discount must be a whole number';
            }
        }

        // Tax validation
        if (productData.tax !== undefined && productData.tax !== null) {
            const taxValue = Number(productData.tax);
            if (productData.tax.trim() === '' || isNaN(taxValue)) {
                errors.tax = '⚠️ Tax must be a number';
            } else if (taxValue < 0) {
                errors.tax = '⚠️ Tax cannot be negative';
            } else if (taxValue > 100) {
                errors.tax = '⚠️ Tax cannot exceed 100%';
            } else if (!Number.isInteger(taxValue)) {
                errors.tax = '⚠️ Tax must be a whole number';
            }
        }

        console.log('Validation errors:', errors); // Temporary log to check errors

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});

        if (!validateForm()) {
            return;
        }

        // Get sellerId directly from localStorage
        const sellerId = localStorage.getItem('user');
        if (!sellerId) {
            setError('Seller ID not found. Please login again.');
            return;
        }

        try {
            const formData = new FormData();

            // Append fields from productData state
            for (const key in productData) {
                if (productData.hasOwnProperty(key) && productData[key] !== '') {
                    formData.append(key, productData[key]);
                }
            }

            formData.append('sellerId', sellerId);
            formData.append('tags', JSON.stringify(tags));
            formData.append('sizes', JSON.stringify(selectedSize));
            formData.append('colors', JSON.stringify(selectedColors));
            formData.append('isActive', true);

            if (productImage && productImage.file) {
                formData.append('image', productImage.file);
            }

            // Dispatch createProduct with the FormData object
            const result = await dispatch(createProduct(formData)).unwrap();

            // const result = await dispatch(createProduct(actualFormData)).unwrap();
            console.log(result,"result");
            if (result) {
                // Create inventory for the new product
                const inventoryData = {
                    category: productData.categoryId,
                    subcategory: productData.subcategoryId,
                    product: result.data._id,
                    quantity: parseInt(productData.stock),
                    lowStockLimit: 10, // Default low stock limit
                    sellerId: sellerId
                };
                console.log(inventoryData,"inventoryData");
                

                try {
                    await dispatch(createInventory(inventoryData)).unwrap();
                } catch (error) {
                    console.error('Failed to create inventory:', error);
                    setError('Product created but failed to create inventory. Please try updating inventory manually.');
                }

                // Reset form
                setProductData({
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
                    sku: ''
                });
                setSelectedSize([]);
                setSelectedColors([]);
                setProductImage(null);
                setTags([]);
                setTagInput('');
                if (document.getElementById('fileInput')) {
                    document.getElementById('fileInput').value = null;
                }
                // Navigate to products list or show success message
                navigate('/products');
            }
        } catch (error) {
            let errorMsg =
                error?.response?.data?.error ||
                error?.error ||
                error?.message ||
                'Failed to create product';
            setFormErrors(prev => ({
                ...prev,
                submit: errorMsg
            }));
        }
    };

    const generateSKU = () => {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const sku = `SKU${timestamp}${random}`;
        setProductData(prev => ({ ...prev, sku }));
    };

    // Add error display component
    const ErrorMessage = ({ error }) => {
        if (!error) return null;
        return <div className="x_error_text">{error}</div>;
    };

    return (
        <div className={`x_product_page_container x_add_product_container Z_product_section  ${isDarkMode ? 'd_dark' : 'd_light'}`}>

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
                                {productImage ? (
                                    <div className="x_image_preview">
                                        <img
                                            src={productImage.url}
                                            alt="Product preview"
                                            className="x_preview_image"
                                        />
                                        <button
                                            className="x_remove_image"
                                            onClick={e => {
                                                e.stopPropagation();
                                                setProductImage(null);
                                                setFileError('');
                                                setFormErrors(prev => ({ ...prev, image: null }));
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="x_upload_icon">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--accent-color)">
                                                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                                            </svg>
                                        </div>
                                        <p className="x_upload_text">Drop your images here, or <span className="x_browse_text">click to browse</span></p>
                                        <p className="x_upload_hint">Maximum file size: 5MB. Allowed formats: PNG, JPG, JPEG</p>
                                    </>
                                )}
                                {(fileError || formErrors.image) && <p className="x_error_message">{fileError || formErrors.image}</p>}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Add image error message */}
                {/* {formErrors.image && (
                    <div className="x_error_message mb-3">
                        {formErrors.image}
                    </div>
                )} */}

                <div className="x_product_form">
                    <div className="x_product_info">
                        <h2 className="x_product_title">Product Information</h2>

                        <div className='x_form_p'>
                            {/* add field */}
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
                                    <ErrorMessage error={formErrors.categoryId} />
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
                                        {isSubcategoryOpen && (
                                            <div className="x_dropdown_options">
                                                {subcategories
                                                    .filter(sub => sub.category._id === productData.categoryId)
                                                    .map((subcategory) => (
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
                                    <ErrorMessage error={formErrors.subcategoryId} />
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
                                        className={`x_input ${formErrors.productName ? 'x_input_error' : ''}`}
                                    />
                                    <ErrorMessage error={formErrors.productName} />
                                </div>
                                <div className="x_form_group">
                                    <label>Brand</label>
                                    <input
                                        type="text"
                                        name="brand"
                                        placeholder="Brand Name"
                                        value={productData.brand}
                                        onChange={handleInputChange}
                                        className={`x_input ${formErrors.brand ? 'x_input_error' : ''}`}
                                    />
                                    <ErrorMessage error={formErrors.brand} />
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
                                        className={`x_input ${formErrors.weight ? 'x_input_error' : ''}`}
                                    />
                                    <ErrorMessage error={formErrors.weight} />
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
                                    <ErrorMessage error={formErrors.gender} />
                                </div>
                            </div>

                            {/* <div className="x_form_row">
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
                            </div> */}

                            <div className="x_form_row">
                                <div className="x_form_group x_full_width">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        placeholder="Short description about the product"
                                        value={productData.description}
                                        onChange={handleInputChange}
                                        className={`x_textarea ${formErrors.description ? 'x_input_error' : ''}`}
                                    />
                                    <ErrorMessage error={formErrors.description} />
                                </div>
                            </div>

                            <div className="x_form_row">
                                <div className="x_form_group">
                                    <label>SKU Number</label>
                                    {/* <div className="x_input_group">
                                        <input
                                            type="text"
                                            name="sku"
                                            placeholder="SKU Number"
                                            value={productData.sku}
                                            onChange={handleInputChange}
                                            className="x_input"
                                            readOnly
                                        />
                                        <button
                                            type="button"
                                            className="x_btn x_btn_generate"
                                            onClick={generateSKU}
                                        >
                                            <RiAiGenerate />
                                        </button>
                                    </div> */}
                                    <div className="x_input_group">
                                        <span type="button"
                                            className=" x_input_icon "
                                            onClick={generateSKU}>
                                            <RiAiGenerate />
                                        </span>
                                        <input
                                            type="text"
                                            name="sku"
                                            placeholder="SKU Number"
                                            value={productData.sku}
                                            onChange={handleSKUInput}
                                            className={`x_input ${formErrors.sku ? 'x_input_error' : ''}`}
                                            readOnly
                                        />


                                    </div>
                                    <ErrorMessage error={formErrors.sku} />
                                </div>
                                <div className="x_form_group">
                                    <label>Tag Number</label>
                                    <input
                                        type="text"
                                        name="tagNumber"
                                        placeholder="#******"
                                        value={productData.tagNumber}
                                        onChange={handleTagNumberInput}
                                        className={`x_input ${formErrors.tagNumber ? 'x_input_error' : ''}`}
                                    />
                                    <ErrorMessage error={formErrors.tagNumber} />
                                </div>
                                <div className="x_form_group">
                                    <label>Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        placeholder="Quantity"
                                        value={productData.stock}
                                        onChange={handleStockInput}
                                        className={`x_input ${formErrors.stock ? 'x_input_error' : ''}`}
                                        min="0"
                                    />
                                    <ErrorMessage error={formErrors.stock} />
                                </div>
                            </div>

                            <div className="x_form_row">
                                <div className="x_form_group">
                                    <label>Tag</label>
                                    <input
                                        type="text"
                                        className={`x_input ${formErrors.tags ? 'x_input_error' : ''}`}
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
                                    <ErrorMessage error={formErrors.tags} />
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
                                        className={`x_input x_input_with_icon ${formErrors.price ? 'x_input_error' : ''}`}
                                        min="0"
                                    />
                                </div>
                                <ErrorMessage error={formErrors.price} />
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
                                        onBlur={handleBlur}
                                        className={`x_input x_input_with_icon ${formErrors.discount ? 'x_input_error' : ''}`}
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                {formErrors.discount && (
                                    <div className="x_error_text">
                                        {formErrors.discount}
                                    </div>
                                )}
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
                                        onBlur={handleBlur}
                                        className={`x_input x_input_with_icon ${formErrors.tax ? 'x_input_error' : ''}`}
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                {formErrors.tax && (
                                    <div className="x_error_text">
                                        {formErrors.tax}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>



                <div className="x_btn_wrapper mt-3">
                    <button
                        type="submit"
                        className="x_btn x_btn_create"
                        onClick={handleSubmit}
                        disabled={productLoading}
                    >
                        {productLoading ? 'Creating...' : 'Create Product'}
                    </button>
                    <button
                        type="button"
                        className="x_btn x_btn_cancel"
                        onClick={() => navigate('/products')}
                    >
                        Cancel
                    </button>
                </div>

                {productError && (
                    <div className="x_error_message mt-3">
                        {productError}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddProduct;