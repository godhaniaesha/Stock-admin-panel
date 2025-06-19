import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import '../../styles/auth.css';
import { clearAuthState, loginUser } from '../../redux/slice/auth.slice';
import { toast } from 'react-toastify';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success, user, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (success && user) {
      toast.success(message || "Login successful!");
      dispatch(clearAuthState());
      navigate('/');
    } else if (error) {
      toast.error(message || error || "Login failed.");
      dispatch(clearAuthState());
    }
  }, [success, error, user, message, navigate, dispatch]);

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(loginUser(formData));
    }
  };

  return (
    <div className="d_auth_container" data-theme="dark">
      <div className="d_auth_card">
        <div className="d_auth_header">
          <img src="/logo192.png" alt="Logo" className="d_auth_logo" />
          <h2>Welcome Back</h2>
          <p>Enter your credentials to access your account</p>
        </div>

        <form className="d_auth_form">
          <div className="d_input_group">
            <label>Email Address</label>
            <div className="d_input_wrapper">
              <Mail size={18} />
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            {formErrors.email && <p className="d_input_error">{formErrors.email}</p>}
          </div>

          <div className="d_input_group">
            <label>Password</label>
            <div className="d_input_wrapper">
              <Lock size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="d_password_toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {formErrors.password && <p className="d_input_error">{formErrors.password}</p>}
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
            <Link to="/forgot-password" className="d_forgot_link">
              Forgot Password?
            </Link>
          </div>

          {error && <p className="d_form_error">{error}</p>}
          {/* {message && !error && <p className="d_form_success">{message}</p>} */}

          <button type="submit" className="d_auth_button" disabled={loading}   onClick={handleSubmit}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="d_auth_footer">
          <p>
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
