import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { FaBars, FaUserCircle, FaBell, FaCog, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../redux/slice/auth.slice';
import { MdLightMode } from 'react-icons/md';

const TopNavbar = ({ toggleSidebar, isDarkMode, toggleDarkMode, setShowProfile }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login'); // or your desired route
  };
  return (
    <Navbar 
      style={{
        backgroundColor: `var(${isDarkMode ? '--dark-card-bg' : '--light-card-bg'})`,
        color: `var(${isDarkMode ? '--dark-text' : '--light-text'})`,
        padding: '16px 0',
        // position:'fixed',
        // width:"-webkit-fill-available",
        // zIndex:'1111'
      }}
      className={`mb-0 border-bottom ${isDarkMode ? 'border-secondary' : 'border-gray'} shadow-sm`}
    >
      <Container fluid>
        <div className="d-flex align-items-center">
          <button
            className="btn border-0 me-2 d-lg-none d-block shadow-none"
            style={{
              backgroundColor: `var(${isDarkMode ? '--dark-card-bg' : '--light-card-bg'})`,
              color: `var(${isDarkMode ? '--dark-text' : '--light-text'})`
            }}
            onClick={toggleSidebar}
          >
            <FaBars size={16} />
          </button>
          <Navbar.Brand href="#" className="ms-2 fw-bold d-flex align-items-center">
            <img
              src="/logo192.png"
              width="24"
              height="24"
              className="d-inline-block align-top me-2"
              alt="Logo"
            />
            <span style={{ color: `var(${isDarkMode ? '--dark-text' : '--light-text'})` }} className="d-none d-sm-inline">
              Stock Admin Panel
            </span>
          </Navbar.Brand>
        </div>

        <Nav className="d-flex align-items-center ms-auto">
          <div className="d-none d-md-flex align-items-center gap-3">
            <div
              className="theme-toggle d-flex align-items-center justify-content-center"
              onClick={toggleDarkMode}
              style={{ 
                color: `var(${isDarkMode ? '--dark-text' : '--light-text'})`,
                width: '32px',
                height: '32px',
                cursor: 'pointer'
              }}
            >
              {isDarkMode ? 
                <MdLightMode size={20} /> : 
                <FaMoon size={20} />
              }
            </div>
            {/* Bell icon with similar styling */}
            {/* <div 
              className="d-flex align-items-center justify-content-center position-relative"
              style={{ 
                width: '32px',
                height: '32px',
                cursor: 'pointer'
              }}
            >
              <FaBell size={20} style={{ color: `var(${isDarkMode ? '--dark-text' : '--light-text'})` }} />
              <span className="position-absolute top-0 start-75 translate-middle badge rounded-pill bg-danger p-1">
                3
              </span>
            </div> */}
          </div>
          <div className="custom-dropdown" ref={dropdownRef}>
            <button 
              className="custom-dropdown-toggle"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                padding: '8px 12px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                color: `var(${isDarkMode ? '--dark-text' : '--light-text'})`,
                transition: 'all 0.3s ease'
              }}
            >
              <FaUserCircle 
                size={20} 
                className="me-2"
                style={{ 
                  color: `var(${isDarkMode ? '--dark-text' : '--light-text'})`,
                  transition: 'color 0.3s ease'
                }} 
              />
              <span className="">Admin</span>
            </button>
            {isDropdownOpen && (
              <div 
                className="custom-dropdown-menu"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: '0',
                  minWidth: '200px',
                  padding: '8px',
                  backgroundColor: `var(${isDarkMode ? '--dark-card-bg' : '--light-card-bg'})`,
                  border: `1px solid var(${isDarkMode ? '--dark-border' : '--light-border'})`,
                  borderRadius: '8px',
                  boxShadow: `0 4px 6px var(${isDarkMode ? '--dark-border' : '--light-border'})`,
                  zIndex: 1000
                }}
              >
                <button 
                  className="custom-dropdown-item"
                  onClick={() => {
                    navigate('/profile')
                    setIsDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    color: `var(${isDarkMode ? '--dark-text' : '--light-text'})`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginBottom: '4px',
                    textAlign: 'left',
                    border:'none'
                  }}
                >
                  <FaUserCircle 
                    size={14} 
                    className="me-2"
                    style={{ color: `var(--accent-color)` }} 
                  />
                  Profile
                </button>
                {/* <button 
                  className="custom-dropdown-item"
                  onClick={() => console.log('Settings clicked')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '8px 16px',
                    border: 'none',
                    borderBottom: `1px solid var(${isDarkMode ? '--dark-border' : '--light-border'})`,
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    color: `var(${isDarkMode ? '--dark-text' : '--light-text'})`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginBottom: '4px',
                    textAlign: 'left'
                  }}
                >
                  <FaCog 
                    size={14} 
                    className="me-2"
                    style={{ color: `var(--accent-color)` }} 
                  />
                  Settings
                </button> */}
                <button 
                  className="custom-dropdown-item d-md-none"
                  onClick={toggleDarkMode}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    color: `var(${isDarkMode ? '--dark-text' : '--light-text'})`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginBottom: '4px',
                    textAlign: 'left'
                  }}
                >
                  {isDarkMode ? (
                    <>
                      <FaSun 
                        size={14} 
                        className="me-2"
                        style={{ color: `var(--accent-color)` }} 
                      />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <FaMoon 
                        size={14} 
                        className="me-2"
                        style={{ color: `var(--accent-color)` }} 
                      />
                      Dark Mode
                    </>
                  )}
                </button>
                <div 
                  style={{ 
                    height: '1px', 
                    backgroundColor: `var(${isDarkMode ? '--dark-border' : '--light-border'})`,
                    margin: '8px 0' 
                  }} 
                />
                <button 
                  className="custom-dropdown-item"
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    color: `var(--accent-color)`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'left'
                  }}
                >
                  <FaSignOutAlt size={14} className="me-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
