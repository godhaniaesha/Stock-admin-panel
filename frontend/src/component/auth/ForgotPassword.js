import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearAuthState } from '../../redux/slice/auth.slice';
import '../../styles/auth.css';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [phone, setPhone] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success, message } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phone) {
      dispatch(forgotPassword(phone));
    }
  };

  React.useEffect(() => {
    if (success) {
      toast.success(message || "OTP sent successfully!");
      navigate('/verify-otp'); // Navigate to VerifyOTP page
      dispatch(clearAuthState());
    } else if (error) {
      toast.error(message || error || "Failed to send OTP.");
      dispatch(clearAuthState());
    }
  }, [success, error, message, dispatch, navigate]);

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
            <label>Phone Number</label>
            <div className="d_input_wrapper">
              <Phone size={18} />
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="d_auth_button" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

          <p className='text-center mt-2 text-light text-decoration-dashed text-opacity-75 small'>Remember Your password? <Link to="/login" className='fs-6 ' style={{color:'var(--accent-color)'}}>Back to Login</Link></p>
        </div>
      </div>
  );
};

export default ForgotPassword;
