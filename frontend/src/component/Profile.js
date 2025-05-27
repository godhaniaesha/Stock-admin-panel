import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Lock, Phone, Building, MapPin, 
  Camera, X, Check, Edit3, Save
} from 'lucide-react';
import '../styles/d_style.css';

const Profile = ({ isDarkMode = false }) => {
  const [formData, setFormData] = useState({
    fullName: 'Admin User',
    email: 'admin@example.com',
    role: 'Administrator',
    phone: '+1 234 567 8900',
    company: 'Stock Admin Inc.',
    address: '123 Admin Street, City, Country',
    password: '',
    confirmPassword: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsEditing(false);
    setIsLoading(false);
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
    <div className="db_container">
      <div className="db_profile" data-theme={isDarkMode ? 'dark' : 'light'}>
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
                <img src={previewUrl} alt="Profile Avatar" className="db_avatar_img" />
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
