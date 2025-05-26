import React from 'react';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { FaBars, FaUserCircle, FaBell, FaCog, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa';

const TopNavbar = ({ toggleSidebar, isDarkMode, toggleDarkMode }) => {
  return (
    <Navbar bg={isDarkMode ? 'dark' : 'light'} variant={isDarkMode ? 'dark' : 'light'} expand="lg" 
      className={`mb-0 border-bottom ${isDarkMode ? 'border-secondary' : 'border-gray'} shadow-sm`}>
      <Container fluid>
        <div className="d-flex align-items-center">
          <button
            className={`btn ${isDarkMode ? 'btn-dark' : 'btn-light'} d-lg-none border-0 me-2 shadow-none`}
            onClick={toggleSidebar}
          >
            <FaBars size={20} />
          </button>
          <Navbar.Brand href="#" className="ms-2 fw-bold d-flex align-items-center">
            <img
              src="/logo192.png"
              width="30"
              height="30"
              className="d-inline-block align-top me-2"
              alt="Logo"
            />
            <span className={isDarkMode ? 'text-light' : 'text-dark'}>Stock Admin Panel</span>
          </Navbar.Brand>
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <div
              className="theme-toggle px-3"
              onClick={toggleDarkMode}
              style={{ cursor: 'pointer' }}
            >
              {isDarkMode ? 
                <FaSun className="text-light" size={18} /> : 
                <FaMoon className="text-dark" size={18} />
              }
            </div>
            <Nav.Link href="#" className="px-3 position-relative">
              <FaBell size={18} />
              <span className="position-absolute top-0 start-75 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </Nav.Link>
            <Dropdown align="end">
              <Dropdown.Toggle 
                variant={isDarkMode ? 'dark' : 'light'} 
                id="profile-dropdown" 
                className="d-flex align-items-center border-0 bg-transparent"
              >
                <FaUserCircle size={20} className="me-2" />
                <span>Admin</span>
              </Dropdown.Toggle>
              <Dropdown.Menu className={`shadow-sm ${isDarkMode ? 'dropdown-menu-dark' : ''}`}>
                <Dropdown.Item href="#">
                  <FaUserCircle className="me-2" /> Profile
                </Dropdown.Item>
                <Dropdown.Item href="#">
                  <FaCog className="me-2" /> Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="#" className="text-danger">
                  <FaSignOutAlt className="me-2" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;