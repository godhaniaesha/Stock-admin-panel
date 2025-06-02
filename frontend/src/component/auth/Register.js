import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { User, Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch and useSelector
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
  const navigate = useNavigate(); // Initialize useNavigate
  const { loading, error, success, message } = useSelector((state) => state.auth); // Access auth state

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle registration submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation (add more robust validation as needed)
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    dispatch(registerUser({
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    }));
  };

  // Effect to handle redirection or clear state after registration attempt
  // useEffect(() => {
  //   if (success) {
  //     alert(message); // Or use a toast notification
  //     dispatch(clearAuthState()); // Clear success state after displaying message
  //     navigate('/login'); // Redirect to login page on successful registration
  //   }
  //   if (error) {
  //     alert(message || error); // Display error message
  //     dispatch(clearAuthState()); // Clear error state after displaying message
  //   }
  // }, [success, error, message, navigate, dispatch]);
  useEffect(() => {
    if (success) {
      toast.success(message || "Registration successful!");
      dispatch(clearAuthState());
      navigate('/login');
    }

    if (error) {
      toast.error(message || error || "Registration failed.");
      dispatch(clearAuthState());
    }
  }, [success, error, message, navigate, dispatch]);


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
                name="username" // Add name attribute
                placeholder="Enter your full name"
                value={formData.username}
                onChange={handleChange}
                required // Add HTML5 validation
              />
            </div>
          </div>

          <div className="d_input_group">
            <label>Email Address</label>
            <div className="d_input_wrapper">
              <Mail size={18} />
              <input
                type="email"
                name="email" // Add name attribute
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
                name="phone" // Add name attribute
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
                name="password" // Add name attribute
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
                name="confirmPassword" // Add name attribute
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

        {/* Display messages based on Redux state */}
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{message || error}</p>}
        {success && <p className="success-message">{message}</p>}

        <div className="d_auth_footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;