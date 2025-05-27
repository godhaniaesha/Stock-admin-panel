import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.css';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    // Handle OTP verification
  };

  return (
    <div className="d_auth_container" data-theme="dark">
      <div className="d_auth_card">
        <div className="d_auth_header">
          <img src="/logo192.png" alt="Logo" className="d_auth_logo" />
          <h2>Verify OTP</h2>
          <p>Enter the 6-digit code sent to your email</p>
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
              />
            ))}
          </div>

          <button type="submit" className="d_auth_button">Verify OTP</button>

          <div className="d_resend_otp">
            <p>Didn't receive the code? <button type="button">Resend OTP</button></p>
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