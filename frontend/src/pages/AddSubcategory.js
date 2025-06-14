import React, { useState, useEffect } from 'react';
import '../styles/x_app.css';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../redux/slice/category.slice';
import { createSubcategory } from '../redux/slice/subCategory.slice';

const AddSubcategory = () => {
    const { isDarkMode } = useOutletContext();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formErrors, setFormErrors] = useState({});
    const [fileError, setFileError] = useState('');
    const { categories, isLoading: categoriesLoading } = useSelector((state) => state.category);
    const { isLoading: subcategoryLoading, error: subcategoryError } = useSelector((state) => state.subcategory);

    const [subcategoryData, setsubcategoryData] = useState({
        subcategoryTitle: '',
        description: '',
        category: ''
    });

    const [productImage, setProductImage] = useState(null);
    const [error, setError] = useState('');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleCategorySelect = (categoryId) => {
        setsubcategoryData(prev => ({ ...prev, category: categoryId }));
        setIsCategoryOpen(false);
    };

    const validateAndHandleFile = (file) => {
        setError('');

        if (!file) {
            setError('Please select a file');
            return;
        }

        const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setError('Invalid file type. Only PNG, JPG and JPEG are allowed');
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            setError('File size exceeds 5MB limit');
            return;
        }

        const imageUrl = URL.createObjectURL(file);
        setProductImage(imageUrl);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setsubcategoryData(prev => ({
            ...prev,
            [name]: value
        }));
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    if (!validateForm()) {
        return;
    }

    try {
        const formData = new FormData();
        formData.append('subcategoryTitle', subcategoryData.subcategoryTitle);
        formData.append('description', subcategoryData.description);
        formData.append('category', subcategoryData.category);

        const fileInput = document.getElementById('fileInput');
        if (fileInput.files[0]) {
            formData.append('image', fileInput.files[0]);
        }

        await dispatch(createSubcategory(formData)).unwrap();
        navigate('/subcategories');
    } catch (error) {
        // This will work for both fetch/axios errors
        let errorMsg =
            error?.response?.data?.error || // axios
            error?.error ||                 // fetch or RTK Query
            error?.message ||               // fallback
            'Failed to create subcategory';

        setFormErrors(prev => ({
            ...prev,
            submit: errorMsg
        }));
    }
};

    const handleCancel = () => {
        navigate('/subcategories');
    };
    const validateForm = () => {
        const errors = {};
        if (!subcategoryData.subcategoryTitle.trim()) {
            errors.subcategoryTitle = 'Subcategory title is required';
        }
        if (!subcategoryData.category) {
            errors.category = 'Category is required';
        }
        if (!productImage) {
            errors.image = 'Subcategory image is required';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    return (
        <div className={`x_product_page_container Z_product_section  ${isDarkMode ? 'd_dark' : 'd_light'}`}>
            <div className="x_add_product_container">
                {/* IMAGE UPLOAD */}
                <div className="x_upload_section">
                    <h2 className="x_product_title">Add Subcategory Photo</h2>
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
                                    <img
                                        src={productImage}
                                        alt="Preview"
                                        className="x_preview_image"
                                    />
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

                {/* PRODUCT FORM */}
                <div className="x_product_form">
                    <div className="x_product_info">
                        <h2 className="x_product_title">Subcategory Information</h2>
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
                                                    categories.find(cat => cat._id === subcategoryData.category)?.title || 'Choose a category'}
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
                                    <label>Subcategory Title</label>
                                    <input
                                        type="text"
                                        name="subcategoryTitle"
                                        placeholder="Enter Subcategory Title"
                                        value={subcategoryData.subcategoryTitle}
                                        onChange={handleInputChange}
                                        className={`x_input ${formErrors.subcategoryTitle ? 'x_input_error' : ''}`}
                                    />
                                    {formErrors.subcategoryTitle && <p className="x_error_message">{formErrors.subcategoryTitle}</p>}
                                </div>
                            </div>

                            <div className="x_form_row">
                                <div className="x_form_group x_full_width">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        placeholder="Enter description"
                                        value={subcategoryData.description}
                                        onChange={handleInputChange}
                                        className="x_textarea"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {formErrors.submit && (
                    <div className="x_error_container">
                        <p className="x_error_message">{formErrors.submit}</p>
                    </div>
                )}
                <div className="x_btn_wrapper mt-3">
                    <button
                        type="submit"
                        className="x_btn x_btn_create"
                        onClick={handleSubmit}
                        disabled={categoriesLoading || subcategoryLoading}
                    >
                        {subcategoryLoading ? 'Creating...' : 'Create Subcategory'}
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
        </div>
    );
};

export default AddSubcategory;