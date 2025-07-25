import React, { useState, useEffect } from 'react';
import '../styles/x_app.css';
import { useOutletContext, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateCategory } from '../redux/slice/category.slice';
import { IMG_URL } from '../utils/baseUrl';

const EditCategory = () => {
    const { isDarkMode } = useOutletContext();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [categoryData, setCategoryData] = useState({
        title: '',
        description: '',
        _id: ''
    });

    const [categoryImage, setCategoryImage] = useState(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (location.state?.categoryData) {
            const { title, description, image, _id } = location.state.categoryData;
            setCategoryData({ title, description, _id });
            if (image) {
                setCategoryImage(`${IMG_URL}${image}`);
            }
        }
    }, [location.state]);

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
        setCategoryImage(imageUrl);
        setCategoryData(prev => ({ ...prev, image: file }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategoryData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            if (!categoryData.title?.trim()) {
                throw new Error('Title is required');
            }
            if (!categoryData.description?.trim()) {
                throw new Error('Description is required');
            }

            const formData = new FormData();
            formData.append('title', categoryData.title.trim());
            formData.append('description', categoryData.description.trim());
            
            if (categoryData.image instanceof File) {
                formData.append('image', categoryData.image);
            }

            const result = await dispatch(updateCategory({
                id: categoryData._id,
                formData
            })).unwrap();

            if (result) {
                navigate('/categories');
            }
        } catch (err) {
            setError(err.message || 'Failed to update category');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`x_product_page_container Z_product_section  ${isDarkMode ? 'd_dark' : 'd_light'}`}>
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
                                {categoryImage && (
                                    <img 
                                        src={categoryImage} 
                                        alt="Category" 
                                        style={{ maxWidth: '100%', maxHeight: '200px', marginBottom: '10px' }} 
                                    />
                                )}
                                <div className="x_upload_icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--accent-color)">
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
                                        className="x_input"
                                    />
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
                                        className="x_textarea"
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
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
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

export default EditCategory;