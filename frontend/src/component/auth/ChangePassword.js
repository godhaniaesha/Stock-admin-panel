import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import '../../styles/auth.css';

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password change logic
  };

  return (
    <div className="d_auth_container" data-theme="dark">
      <div className="d_auth_card">
        <div className="d_auth_header">
          <img src="/logo192.png" alt="Logo" className="d_auth_logo" />
          <h2>Change Password</h2>
          <p>Create a new password for your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="d_auth_form">
          <div className="d_input_group">
            <label>New Password</label>
            <div className="d_input_wrapper">
              <Lock size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
              />
              <button
                type="button"
                className="d_password_toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="d_input_group">
            <label>Confirm New Password</label>
            <div className="d_input_wrapper">
              <Lock size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="d_auth_button">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;