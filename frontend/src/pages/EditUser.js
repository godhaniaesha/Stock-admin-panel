import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import '../styles/x_app.css';
import { db_fetchUserById, db_updateUser } from '../redux/slice/userSlice';

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDarkMode } = useOutletContext();
    const dispatch = useDispatch();
    const { selectedUser, isLoading, error: reduxError } = useSelector(state => state.user);

    const [userData, setUserData] = useState({
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
        confirmPassword: ''
    });

    const [userImage, setUserImage] = useState(null);
    const [formError, setFormError] = useState('');
    const [isGenderOpen, setIsGenderOpen] = useState(false);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Fetch user data when component mounts
    useEffect(() => {
        if (id) {
            dispatch(db_fetchUserById(id));
        }
    }, [dispatch, id]);

    // Update form when user data is fetched
    useEffect(() => {
        if (selectedUser) {
            setUserData({
                firstName: selectedUser.firstName || '',
                lastName: selectedUser.lastName || '',
                email: selectedUser.email || '',
                phone: selectedUser.phone || '',
                birthdate: selectedUser.birthdate ? new Date(selectedUser.birthdate).toISOString().split('T')[0] : '',
                gender: selectedUser.gender || '',
                address: selectedUser.address || '',
                city: selectedUser.city || '',
                state: selectedUser.state || '',
                country: selectedUser.country || '',
                role: selectedUser.role || '',
                password: '',
                confirmPassword: ''
            });

            if (selectedUser.profileImage) {
                setUserImage(`http://localhost:2221/KAssets/profileImage/${selectedUser.profileImage}`);
            }
        }
    }, [selectedUser]);

    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
    ];

    const roleOptions = [
        { value: 'admin', label: 'Admin' },
        { value: 'seller', label: 'Seller' },
        { value: 'staff', label: 'Staff' },
        { value: 'user', label: 'User' }
    ];

    const handleGenderSelect = (value) => {
        setUserData(prev => ({ ...prev, gender: value }));
        setIsGenderOpen(false);
    };

    const handleRoleSelect = (value) => {
        setUserData(prev => ({ ...prev, role: value }));
        setIsRoleOpen(false);
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

        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            setFormError('File size exceeds 5MB limit');
            return;
        }

        const imageUrl = URL.createObjectURL(file);
        setUserImage(imageUrl);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        // Validate passwords if they are provided
        if (userData.password || userData.confirmPassword) {
            if (userData.password !== userData.confirmPassword) {
                setFormError('Passwords do not match');
                return;
            }
            if (userData.password.length < 6) {
                setFormError('Password must be at least 6 characters long');
                return;
            }
        }

        try {
            const formData = new FormData();
            
            // Append all form fields
            Object.keys(userData).forEach(key => {
                if (key !== 'confirmPassword' && userData[key]) {
                    formData.append(key, userData[key]);
                }
            });

            // Append profile image if changed
            if (userImage && userImage.startsWith('blob:')) {
                const response = await fetch(userImage);
                const blob = await response.blob();
                formData.append('profileImage', blob, 'profile.jpg');
            }

            await dispatch(db_updateUser({ id, formData })).unwrap();
            navigate('/users');
        } catch (error) {
            setFormError(error.message || 'Failed to update user');
        }
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center " style={{ minHeight: '400px' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`x_product_page_container Z_product_section ${isDarkMode ? 'd_dark' : 'd_light'}    `}>
            <div className="x_add_product_container">
                {/* Image Upload Section */}
                <div className="x_upload_section">
                    <h2 className="x_product_title">Edit User Photo</h2>
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
                                {userImage ? (
                                    <img 
                                        src={userImage} 
                                        alt="Profile Preview" 
                                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                                        className="img-thumbnail"
                                    />
                                ) : (
                                    <>
                                        <div className="x_upload_icon">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--accent-green)">
                                                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                                            </svg>
                                        </div>
                                        <p className="x_upload_text">Drop your image here, or <span className="x_browse_text">click to browse</span></p>
                                        <p className="x_upload_hint">Maximum file size: 5MB. Allowed formats: PNG, JPG, JPEG</p>
                                    </>
                                )}
                                {(formError || reduxError) && <p className="x_error_message">{formError || reduxError}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Information Form */}
                <div className="x_product_form">
                    <div className="x_product_info">
                        <h2 className="x_product_title">User Information</h2>

                        <div className='x_form_p'>
                            <div className="x_form_row">
                                <div className="x_form_group">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={userData.firstName}
                                        onChange={handleInputChange}
                                        className="x_input"
                                    />
                                </div>
                                <div className="x_form_group">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={userData.lastName}
                                        onChange={handleInputChange}
                                        className="x_input"
                                    />
                                </div>
                            </div>

                            <div className="x_form_row">
                                <div className="x_form_group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={userData.email}
                                        onChange={handleInputChange}
                                        className="x_input"
                                    />
                                </div>
                                <div className="x_form_group">
                                    <label>Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number"
                                        value={userData.phone}
                                        onChange={handleInputChange}
                                        className="x_input"
                                    />
                                </div>
                            </div>

                            <div className="x_form_row">
                                <div className="x_form_group">
                                    <label>Birthdate</label>
                                    <input
                                        type="date"
                                        name="birthdate"
                                        value={userData.birthdate}
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
                                            <span>{userData.gender || 'Select Gender'}</span>
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
                                <div className="x_form_group x_full_width">
                                    <label>Address</label>
                                    <textarea
                                        name="address"
                                        placeholder="Full Address"
                                        value={userData.address}
                                        onChange={handleInputChange}
                                        className="x_textarea"
                                    />
                                </div>
                            </div>

                            <div className="x_form_row">
                                <div className="x_form_group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={userData.city}
                                        onChange={handleInputChange}
                                        className="x_input"
                                    />
                                </div>
                                <div className="x_form_group">
                                    <label>State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="State"
                                        value={userData.state}
                                        onChange={handleInputChange}
                                        className="x_input"
                                    />
                                </div>
                            </div>

                            <div className="x_form_row">
                                <div className="x_form_group">
                                    <label>Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        placeholder="Country"
                                        value={userData.country}
                                        onChange={handleInputChange}
                                        className="x_input"
                                    />
                                </div>
                                <div className="x_form_group">
                                    <label>Role</label>
                                    <div className="x_custom_dropdown">
                                        <div
                                            className="x_dropdown_header"
                                            onClick={() => setIsRoleOpen(!isRoleOpen)}
                                        >
                                            <span>{userData.role || 'Select Role'}</span>
                                            <svg
                                                className={`x_dropdown_arrow ${isRoleOpen ? 'open' : ''}`}
                                                width="10"
                                                height="6"
                                                viewBox="0 0 10 6"
                                            >
                                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                            </svg>
                                        </div>
                                        {isRoleOpen && (
                                            <div className="x_dropdown_options">
                                                {roleOptions.map((option) => (
                                                    <div
                                                        key={option.value}
                                                        className="x_dropdown_option"
                                                        onClick={() => handleRoleSelect(option.value)}
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
                                    <label>Password</label>
                                    <div className="x_password_input_wrapper">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Enter Password"
                                            value={userData.password}
                                            onChange={handleInputChange}
                                            className="x_input"
                                        />
                                        <div
                                            className="x_password_toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg>
                                            ) : (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="x_form_group">
                                    <label>Confirm Password</label>
                                    <div className="x_password_input_wrapper">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            value={userData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="x_input"
                                        />
                                        <div
                                            className="x_password_toggle"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg>
                                            ) : (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                                </svg>
                                            )}
                                        </div>
                                    </div>
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
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                        type="button" 
                        className="x_btn x_btn_cancel"
                        onClick={() => navigate('/userlist')}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditUser;