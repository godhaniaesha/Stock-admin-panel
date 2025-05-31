import React, { useState, useEffect } from 'react';
import '../styles/x_app.css';
import { useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, clearAddCategoryError, resetAddCategoryState } from '../redux/slice/addCategory.slice';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
    const [categoryData, setCategoryData] = useState({
        title: '',
        description: ''
    });
    const { isDarkMode } = useOutletContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error, success } = useSelector((state) => state.addCategory);

    const [categoryImage, setCategoryImage] = useState(null);
    const [fileError, setFileError] = useState('');
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (success) {
            navigate('/categories');
        }
        return () => {
            dispatch(resetAddCategoryState());
        };
    }, [success, navigate, dispatch]);

    useEffect(() => {
        if (error) {
            setFormErrors(prev => ({
                ...prev,
                submit: error
            }));
        }
    }, [error]);

    const validateForm = () => {
        const errors = {};
        if (!categoryData.title.trim()) {
            errors.title = 'Title is required';
        }
        if (!categoryData.description.trim()) {
            errors.description = 'Description is required';
        }
        if (!categoryImage) {
            errors.image = 'Category image is required';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
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
        setCategoryImage({ url: imageUrl, file });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategoryData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(clearAddCategoryError());
        
        if (!validateForm()) {
            return;
        }

        const formData = {
            title: categoryData.title.trim(),
            description: categoryData.description.trim(),
            image: categoryImage.file
        };

        try {
            await dispatch(addCategory(formData)).unwrap();
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    return (
        <div className={`x_product_page_container w-100 ${isDarkMode ? 'd_dark' : 'd_light'}`}>
            <div className="x_add_product_container">
                {/* IMAGE UPLOAD */}
                <div className="x_upload_section">
                    <h2 className="x_product_title">Add Category Photo</h2>
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
                                {categoryImage ? (
                                    <img src={categoryImage.url} alt="Category preview" className="x_preview_image" />
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

                {/* CATEGORY FORM */}
                <div className="x_product_form">
                    <div className="x_product_info">
                        <h2 className="x_product_title">Category Information</h2>
                        <div className='x_form_p'>
                            <div className="x_form_row">
                                <div className="x_form_group">
                                    <label>Category Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Enter Category Title"
                                        value={categoryData.title}
                                        onChange={handleInputChange}
                                        className={`x_input ${formErrors.title ? 'x_input_error' : ''}`}
                                    />
                                    {formErrors.title && <p className="x_error_message">{formErrors.title}</p>}
                                </div>
                            </div>

                            <div className="x_form_row">
                                <div className="x_form_group x_full_width">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        placeholder="Category Description"
                                        value={categoryData.description}
                                        onChange={handleInputChange}
                                        className={`x_textarea ${formErrors.description ? 'x_input_error' : ''}`}
                                    />
                                    {formErrors.description && <p className="x_error_message">{formErrors.description}</p>}
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
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Create Category'}
                    </button>
                    <button
                        type="button"
                        className="x_btn x_btn_cancel"
                        onClick={() => navigate('/categories')}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCategory;