import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, Eye, EyeOff } from 'lucide-react';
import '../../styles/auth.css';
import { resetPassword, clearAuthState } from '../../redux/slice/auth.slice';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, success, message } = useSelector((state) => state.auth);
  
  const storedPhone = localStorage.getItem('forgot-phone');
  const otpFromState = localStorage.getItem('storedOtp')

  useEffect(() => {
    if (!storedPhone) {
      toast.error("Phone number not found. Please start the password reset process again.");
      navigate('/forgot-password');
    }
    if (!otpFromState) {
      toast.error("OTP not found. Please verify OTP again.");
      navigate('/verify-otp');
    }
  }, [storedPhone, otpFromState, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (storedPhone && otpFromState) {
      dispatch(resetPassword({ 
        phone: storedPhone, 
        otp: otpFromState, 
        newPassword: formData.newPassword 
      }));
    } else {
      toast.error("Missing phone number or OTP. Please try the process again.");
    }
  };

  useEffect(() => {
    if (success && message && message.includes("Password reset successfully")) {
      toast.success(message || "Password changed successfully! Please login.");
      localStorage.removeItem('forgot-phone'); // Clean up
      dispatch(clearAuthState());
      navigate('/login');
    } else if (error) {
      toast.error(message || error || "Failed to change password.");
      dispatch(clearAuthState());
    }
  }, [success, error, message, dispatch, navigate]);

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
                name="newPassword"
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
                name="confirmPassword"
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="d_auth_button" disabled={loading}>
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default ChangePassword;