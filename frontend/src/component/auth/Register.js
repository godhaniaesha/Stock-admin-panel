import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import '../../styles/auth.css';
import { clearAuthState, registerUser } from '../../redux/slice/auth.slice';
import { toast } from 'react-toastify';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [db_submitted, setDbSubmitted] = useState(false);
  const { loading, error, success, message } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username) {
      errors.username = 'Full name is required';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach(err => toast.error(err));
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (validateForm()) {
      setDbSubmitted(true);
      dispatch(registerUser({
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      }));
    }
  };

  useEffect(() => {
    if (db_submitted) {
      if (success) {
        toast.success(message || "Registration successful!");
        dispatch(clearAuthState());
        navigate('/SellerGST-verify'); // ✅ Redirect to GST number page
      } else if (error && message) {
        toast.error(message || "Registration failed.");
        dispatch(clearAuthState());
        setDbSubmitted(false); // reset submission flag
      }
    }
  }, [success, error, message, navigate, dispatch, db_submitted]);


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
                name="username"
                placeholder="Enter your full name"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="d_input_group">
            <label>Email Address</label>
            <div className="d_input_wrapper">
              <Mail size={18} />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="d_input_group">
            <label>Phone Number</label>
            <div className="d_input_wrapper">
              <Phone size={18} />
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="d_input_group">
            <label>Password</label>
            <div className="d_input_wrapper">
              <Lock size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="d_password_toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ?  <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <div className="d_input_group">
            <label>Confirm Password</label>
            <div className="d_input_wrapper">
              <Lock size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="d_auth_button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {loading && <p>Loading...</p>}
        {/* {error && <p className="error-message">{message || error}</p>} */}
        {/* {success && <p className="success-message">{message}</p>} */}

        <div className="d_auth_footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
