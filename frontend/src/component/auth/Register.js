import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react';
import '../../styles/auth.css';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic
  };

  return (
    <div className="d_auth_container" data-theme="dark">
      <div className="d_auth_card">
        <div className="d_auth_header">
          <img src="/logo192.png" alt="Logo" className="d_auth_logo" />
          <h2>Create Account</h2>
          <p>Join us! Please enter your details</p>
        </div>
        
        <form onSubmit={handleSubmit} className="d_auth_form">
          <div className="d_input_group">
            <label>Full Name</label>
            <div className="d_input_wrapper">
              <User size={18} />
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
          </div>

          <div className="d_input_group">
            <label>Email Address</label>
            <div className="d_input_wrapper">
              <Mail size={18} />
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="d_input_group">
            <label>Phone Number</label>
            <div className="d_input_wrapper">
              <Phone size={18} />
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="d_input_group">
            <label>Password</label>
            <div className="d_input_wrapper">
              <Lock size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
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
            <label>Confirm Password</label>
            <div className="d_input_wrapper">
              <Lock size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="d_auth_button">Create Account</button>
        </form>

        <div className="d_auth_footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;