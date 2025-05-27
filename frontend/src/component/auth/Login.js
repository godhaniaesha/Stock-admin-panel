import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import '../../styles/auth.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic
  };

  return (
    <div className="d_auth_container" data-theme="dark">
      <div className="d_auth_card">
        <div className="d_auth_header">
          <img src="/logo192.png" alt="Logo" className="d_auth_logo" />
          <h2>Welcome Back</h2>
          <p>Enter your credentials to access your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="d_auth_form">
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
            <label>Password</label>
            <div className="d_input_wrapper">
              <Lock size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
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

          <div className="d_form_actions">
            <label className="d_checkbox_wrapper">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="d_checkbox_label">Remember me</span>
            </label>
            <Link to="/forgot-password" className="d_forgot_link">Forgot Password?</Link>
          </div>

          <button type="submit" className="d_auth_button">Sign In</button>
        </form>

        <div className="d_auth_footer">
          <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;