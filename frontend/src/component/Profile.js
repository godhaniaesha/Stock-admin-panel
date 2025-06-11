import React, { useState, useEffect } from 'react';
import {
  User, Mail, Lock, Phone, Building, MapPin,
  Camera, X, Check, Edit3, Save
} from 'lucide-react';
import '../styles/d_style.css';
import { useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, updateProfile } from '../redux/slice/auth.slice';

const Profile = () => {
  const { isDarkMode } = useOutletContext();
  const dispatch = useDispatch();
  const allUsers = useSelector(state => state.auth.users);
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    phone: '',
    company: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch users only once
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Set form data only when user changes
  useEffect(() => {
    const userId = localStorage.getItem('user');
    if (userId && allUsers.length > 0) {
      const user = allUsers.find(u => u._id === userId);
      if (user) {
        setCurrentUser(user);
        setFormData({
          fullName: user.fullName || '',
          email: user.email || '',
          role: user.role || '',
          phone: user.phone || '',
          company: user.company || '',
          address: user.address || '',
          password: '',
          confirmPassword: ''
        });
        if (user.profileImage) {
          setPreviewUrl(`http://localhost:2221/KAssets/profileImage/${user.profileImage}`);
        }
      }
    }
  }, [allUsers]);

  useEffect(() => {
    setErrors({});
    if (!isEditing) {
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    }
  }, [isEditing]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (formData.password && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'File size must be less than 5MB' }));
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    const userId = localStorage.getItem('user');
    const formDataToSend = new FormData();

    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    if (selectedFile) {
      formDataToSend.append('profileImage', selectedFile);
    }

    try {
      await dispatch(updateProfile({ id: userId, formData: formDataToSend })).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to update profile. Please try again.' }));
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    { name: 'fullName', label: 'Full Name', icon: User, type: 'text', required: true },
    { name: 'email', label: 'Email Address', icon: Mail, type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', required: true },
    { name: 'company', label: 'Company', icon: Building, type: 'text', required: true },
    { name: 'address', label: 'Address', icon: MapPin, type: 'text', required: true },
    { name: 'password', label: 'New Password', icon: Lock, type: 'password', required: false },
    { name: 'confirmPassword', label: 'Confirm Password', icon: Lock, type: 'password', required: false }
  ];

  const theme = isDarkMode ? 'dark' : 'light';

  return (
    <div className="w-100">
      <div className="db_profile w-100" data-theme={isDarkMode ? 'dark' : 'light'}>
        <div className="db_profile_header">
          <div className="db_header_content">
            <h2 className="db_title">Profile Settings</h2>
            <p className="db_subtitle">Manage your account information</p>
          </div>
          <button
            className={`db_button ${isEditing ? 'db_button_cancel' : 'db_button_edit'}`}
            onClick={() => setIsEditing(!isEditing)}
            disabled={isLoading}
          >
            {isEditing ? <X size={16} /> : <Edit3 size={16} />}
            <span className="db_button_text">{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        <div className="db_profile_content">
          <div className="db_profile_sidebar">
            <div className="db_profile_image">
              <div className="db_profile_avatar">
                <img src={previewUrl || 'default-avatar-url.jpg'} alt="Profile Avatar" className="db_avatar_img" />
                {isEditing && (
                  <div className="db_photo_overlay">
                    <input
                      type="file"
                      id="photo-input"
                      className="db_file_input"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                    <label htmlFor="photo-input" className="db_camera_label">
                      <Camera size={16} />
                    </label>
                  </div>
                )}
              </div>
              <div className="db_user_info">
                <h3 className="db_user_name">{formData.fullName}</h3>
                <span className="db_user_role">{formData.role}</span>
              </div>
            </div>
            {errors.photo && <p className="db_error">{errors.photo}</p>}
          </div>

          <div className="db_profile_main">
            <div className="db_profile_form">
              {formFields.map((field) => {
                const Icon = field.icon;
                return (
                  <div className="db_input_group" key={field.name}>
                    <label className="db_input_label">
                      {field.label}
                      {field.required && <span className="db_required">*</span>}
                    </label>
                    <div className={`db_input_wrapper ${errors[field.name] ? 'db_error_input' : ''}`}>
                      <Icon className="db_input_icon" size={16} />
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        disabled={!isEditing || isLoading}
                        className="db_input_field"
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                      />
                    </div>
                    {errors[field.name] && (
                      <p className="db_error_text">{errors[field.name]}</p>
                    )}
                  </div>
                );
              })}

              {isEditing && (
                <div className="db_form_actions">
                  <button
                    onClick={handleSubmit}
                    className="db_button db_button_success"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="db_spinner"></div>
                        <span className="db_button_text">Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span className="db_button_text">Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;