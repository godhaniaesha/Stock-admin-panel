import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, resendOtp, clearAuthState } from '../../redux/slice/auth.slice';
import '../../styles/auth.css';
import { toast } from 'react-toastify';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success, message } = useSelector((state) => state.auth);
  const storedPhone = localStorage.getItem('forgot-phone');

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === 6 && storedPhone) {
      dispatch(verifyOtp({ phone: storedPhone, otp: otpValue }));
    } else if (!storedPhone) {
      toast.error("Phone number not found. Please try the forgot password process again.");
    } else {
      toast.error("Please enter a valid 6-digit OTP.");
    }
  };

  const handleResendOtp = async () => {
    if (storedPhone) {
      setIsResending(true);
      try {
        await dispatch(resendOtp(storedPhone)).unwrap();
        // Success is handled by the useEffect below
      } catch (err) {
        // Error is handled by the useEffect below
      } finally {
        setIsResending(false);
      }
    } else {
      toast.error("Phone number not found. Please try the forgot password process again.");
    }
  };

  useEffect(() => {
    if (success && message.includes("OTP verified successfully")) {
      toast.success(message || "OTP verified successfully!");
      navigate('/change-password'); // Navigate to ChangePassword page
      dispatch(clearAuthState());
    } else if (success && message.includes("New OTP sent successfully")) { // For resend OTP
      toast.success(message);
      dispatch(clearAuthState());
    } else if (error) {
      toast.error(message || error || "An error occurred.");
      dispatch(clearAuthState());
    }
  }, [success, error, message, dispatch, navigate]);

  return (
    <div className="d_auth_container" data-theme="dark">
      <div className="d_auth_card">
        <div className="d_auth_header">
          <img src="/logo192.png" alt="Logo" className="d_auth_logo" />
          <h2>Verify OTP</h2>
          <p>Enter the 6-digit code sent to your phone number: {storedPhone || 'your phone'}</p>
        </div>

        <form onSubmit={handleSubmit} className="d_auth_form">
          <div className="d_otp_group">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="d_otp_input"
                disabled={loading || isResending}
              />
            ))}
          </div>

          <button type="submit" className="d_auth_button" disabled={loading || isResending}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <div className="d_resend_otp">
            <p>Didn't receive the code?
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading || isResending}
              >
                {isResending ? 'Resending...' : 'Resend OTP'}
              </button>
            </p>
          </div>

        </form>

        <div className="d_auth_footer">
          <p><Link to="/login">Back to Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;

