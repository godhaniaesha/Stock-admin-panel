import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import '../../styles/auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle forgot password logic
  };

  return (
    <div className="d_auth_container" data-theme="dark">
      <div className="d_auth_card">
        <div className="d_auth_header">
          <img src="/logo192.png" alt="Logo" className="d_auth_logo" />
          <h2>Forgot Password?</h2>
          <p>Enter your email to reset your password</p>
        </div>
        
        <form onSubmit={handleSubmit} className="d_auth_form">
          <div className="d_input_group">
            <label>Email Address</label>
            <div className="d_input_wrapper">
              <Mail size={18} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="d_auth_button">Send Reset Link</button>
        </form>

        <div className="d_auth_footer">
          <p>Remember your password? <Link to="/login">Back to Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;