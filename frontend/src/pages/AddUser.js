import React, { useState, useEffect } from 'react';
import '../styles/x_app.css';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { db_createUser } from '../redux/slice/userSlice';

const AddUser = () => {
    const { isDarkMode } = useOutletContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading = false, isSuccess = false, error: apiError } = useSelector((state) => state.user || {});

    const initialUserData = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthdate: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        country: '',
        role: '',
        password: '',
        confirmPassword: '',
        profileImage:''
    };

    const [userData, setUserData] = useState(initialUserData);
    const [userImage, setUserImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isGenderOpen, setIsGenderOpen] = useState(false);
    const [isRoleOpen, setIsRoleOpen] = useState(false);

    const genderOptions = ['male', 'female', 'other'];
    const roleOptions = ['admin', 'seller', 'staff', 'user'];

    // Handle successful user creation
    useEffect(() => {
        if (isSuccess) {
            // Reset form
            resetForm();
            // Redirect to users page
            navigate('/users');
        }
    }, [isSuccess, navigate]);

    // Display API errors
    useEffect(() => {
        if (apiError) {
            setError(typeof apiError === 'string' ? apiError : 'An error occurred while creating user');
        }
    }, [apiError]);

    const resetForm = () => {
        setUserData(initialUserData);
        setUserImage(null);
        setPreviewImage(null);
        setError('');
        setShowPassword(false);
        setShowConfirmPassword(false);
        setIsGenderOpen(false);
        setIsRoleOpen(false);
        
        // Clear file input
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.value = '';
        }
        
        // Clean up preview image URL to prevent memory leaks
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (error) {
            setError('');
        }
    };

    const handleGenderSelect = (value) => {
        setUserData((prev) => ({ ...prev, gender: value }));
        setIsGenderOpen(false);
    };

    const handleRoleSelect = (value) => {
        setUserData((prev) => ({ ...prev, role: value }));
        setIsRoleOpen(false);
    };

    const validateAndHandleFile = (file) => {
        setError('');
        if (!file) return setError('Please select a file');

        const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            return setError('Only PNG, JPG, JPEG are allowed');
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return setError('Image size must be under 5MB');
        }

        // Store the file object directly
        setUserImage(file);
        
        // Create preview URL for display
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
    };

    const validateForm = () => {
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword'];
        
        for (let field of requiredFields) {
            if (!userData[field].trim()) {
                setError(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
                return false;
            }
        }

        if (userData.password !== userData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }

        if (userData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            setError("Please enter a valid email address");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const formData = new FormData();
            
            // Add all user data to formData
            Object.keys(userData).forEach(key => {
                formData.append(key, userData[key]);
            });

            // Add the image file if it exists
            if (userImage) {
                formData.append('profileImage', userImage);
            }

            const result = await dispatch(db_createUser(formData)).unwrap();
            if (result) {
                resetForm();
                navigate('/users');
            }
        } catch (error) {
            setError(error);
        }
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
            navigate('/users');
        }
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset the form? All data will be cleared.')) {
            resetForm();
        }
    };

    return (
        <div className={`x_product_page_container w-100 ${isDarkMode ? 'd_dark' : 'd_light'}`}>
            <div className="x_add_product_container">
                {/* Upload Image Section */}
                <div className="x_upload_section">
                    <h2 className="x_product_title">Add User Photo</h2>
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
                                accept=".png,.jpg,.jpeg"
                            />
                            <div className="x_upload_content">
                                {previewImage && <img src={previewImage} alt="Preview" className="x_preview_image" />}
                                {!previewImage && (
                                    <>
                                        <div className="x_upload_icon">📁</div>
                                        <p className="x_upload_text">Drop your image here, or <span className="x_browse_text">click to browse</span></p>
                                        <p className="x_upload_hint">Max size: 5MB. PNG/JPG/JPEG only.</p>
                                    </>
                                )}
                            </div>
                        </div>
                        {previewImage && (
                            <button 
                                type="button" 
                                className="x_btn x_btn_secondary mt-2" 
                                onClick={() => {
                                    URL.revokeObjectURL(previewImage);
                                    setPreviewImage(null);
                                    setUserImage(null);
                                    document.getElementById('fileInput').value = '';
                                }}
                            >
                                Remove Image
                            </button>
                        )}
                    </div>
                </div>

                {/* User Info Form */}
                <div className="x_product_form">
                    <div className="x_product_info">
                        <h2 className="x_product_title">User Information</h2>
                        <form onSubmit={handleSubmit}>
                            <div className='x_form_p'>
                                {/* Row 1 */}
                                <div className="x_form_row">
                                    <div className="x_form_group">
                                        <label>First Name <span className="text-danger">*</span></label>
                                        <input 
                                            name="firstName" 
                                            value={userData.firstName} 
                                            onChange={handleInputChange} 
                                            className="x_input"
                                            placeholder="Enter first name"
                                            required
                                        />
                                    </div>
                                    <div className="x_form_group">
                                        <label>Last Name <span className="text-danger">*</span></label>
                                        <input 
                                            name="lastName" 
                                            value={userData.lastName} 
                                            onChange={handleInputChange} 
                                            className="x_input"
                                            placeholder="Enter last name"
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Row 2 */}
                                <div className="x_form_row">
                                    <div className="x_form_group">
                                        <label>Email <span className="text-danger">*</span></label>
                                        <input 
                                            name="email" 
                                            type="email" 
                                            value={userData.email} 
                                            onChange={handleInputChange} 
                                            className="x_input"
                                            placeholder="Enter email address"
                                            required
                                        />
                                    </div>
                                    <div className="x_form_group">
                                        <label>Phone <span className="text-danger">*</span></label>
                                        <input 
                                            name="phone" 
                                            type="tel" 
                                            value={userData.phone} 
                                            onChange={handleInputChange} 
                                            className="x_input"
                                            placeholder="Enter phone number"
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Row 3 */}
                                <div className="x_form_row">
                                    <div className="x_form_group">
                                        <label>Birthdate</label>
                                        <input 
                                            name="birthdate" 
                                            type="date" 
                                            value={userData.birthdate} 
                                            onChange={handleInputChange} 
                                            className="x_input"
                                        />
                                    </div>
                                    <div className="x_form_group">
                                        <label>Gender</label>
                                        <div className="x_custom_dropdown">
                                            <div className="x_dropdown_header" onClick={() => setIsGenderOpen(!isGenderOpen)}>
                                                <span>{userData.gender || "Select Gender"}</span>
                                            </div>
                                            {isGenderOpen && (
                                                <div className="x_dropdown_options">
                                                    {genderOptions.map((g) => (
                                                        <div key={g} className="x_dropdown_option" onClick={() => handleGenderSelect(g)}>
                                                            {g}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Row 4 */}
                                <div className="x_form_row">
                                    <div className="x_form_group x_full_width">
                                        <label>Address</label>
                                        <textarea 
                                            name="address" 
                                            value={userData.address} 
                                            onChange={handleInputChange} 
                                            className="x_textarea"
                                            placeholder="Enter full address"
                                        />
                                    </div>
                                </div>
                                {/* Row 5 */}
                                <div className="x_form_row">
                                    <div className="x_form_group">
                                        <label>City</label>
                                        <input 
                                            name="city" 
                                            value={userData.city} 
                                            onChange={handleInputChange} 
                                            className="x_input"
                                            placeholder="Enter city"
                                        />
                                    </div>
                                    <div className="x_form_group">
                                        <label>State</label>
                                        <input 
                                            name="state" 
                                            value={userData.state} 
                                            onChange={handleInputChange} 
                                            className="x_input"
                                            placeholder="Enter state"
                                        />
                                    </div>
                                </div>
                                {/* Row 6 */}
                                <div className="x_form_row">
                                    <div className="x_form_group">
                                        <label>Country</label>
                                        <input 
                                            name="country" 
                                            value={userData.country} 
                                            onChange={handleInputChange} 
                                            className="x_input"
                                            placeholder="Enter country"
                                        />
                                    </div>
                                    <div className="x_form_group">
                                        <label>Role</label>
                                        <div className="x_custom_dropdown">
                                            <div className="x_dropdown_header" onClick={() => setIsRoleOpen(!isRoleOpen)}>
                                                <span>{userData.role || "Select Role"}</span>
                                            </div>
                                            {isRoleOpen && (
                                                <div className="x_dropdown_options">
                                                    {roleOptions.map((r) => (
                                                        <div key={r} className="x_dropdown_option" onClick={() => handleRoleSelect(r)}>
                                                            {r}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Row 7 */}
                                <div className="x_form_row">
                                    <div className="x_form_group">
                                        <label>Password <span className="text-danger">*</span></label>
                                        <div className="x_password_input_wrapper">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={userData.password}
                                                onChange={handleInputChange}
                                                className="x_input"
                                                placeholder="Enter password (min 6 characters)"
                                                required
                                                minLength="6"
                                            />
                                            <div onClick={() => setShowPassword(!showPassword)} className="x_password_toggle">👁</div>
                                        </div>
                                    </div>
                                    <div className="x_form_group">
                                        <label>Confirm Password <span className="text-danger">*</span></label>
                                        <div className="x_password_input_wrapper">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={userData.confirmPassword}
                                                onChange={handleInputChange}
                                                placeholder='Enter confirm password'                                       
                                                className="x_input"
                                                required
                                            />
                                            <div onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="x_password_toggle">👁</div>
                                        </div>
                                    </div>
                                </div>

                                {error && <p className="x_error_message">{error}</p>}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Buttons */}
                <div className="x_btn_wrapper mt-3">
                    <button 
                        className="x_btn x_btn_create" 
                        onClick={handleSubmit} 
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating..." : "Create User"}
                    </button>
                    <button 
                        type="button" 
                        className="x_btn x_btn_secondary mr-2" 
                        onClick={handleReset}
                        disabled={isLoading}
                    >
                        Reset Form
                    </button>
                    <button 
                        type="button" 
                        className="x_btn x_btn_cancel" 
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddUser;