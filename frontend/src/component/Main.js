import '../styles/admin.css';
import React, { useState } from 'react';
import TopNavbar from './Navbar';
import Sidebar from './Sidebar';
import Profile from './Profile';
import 'bootstrap/dist/css/bootstrap.min.css';
import CartList from './CartList';
import CheckoutPage from './CheckoutPage';

export default function Main() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleContentClick = (e) => {
    if (showSidebar) {
      setShowSidebar(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light-mode');
  };

  return (
    <div 
      className="d-flex" 
      style={{ 
        backgroundColor: `var(${isDarkMode ? '--dark-bg' : '--light-bg'})`,
        color: `var(${isDarkMode ? '--dark-text' : '--light-text'})`
      }}
    >
      <Sidebar show={showSidebar} isDarkMode={isDarkMode} toggleSidebar={toggleSidebar} />
      <div 
        className="content-wrapper" 
        onClick={handleContentClick}
        style={{ 
          backgroundColor: `var(${isDarkMode ? '--dark-bg' : '--light-bg'})`,
          color: `var(${isDarkMode ? '--dark-text' : '--light-text'})`
        }}
      >
        <TopNavbar 
          toggleSidebar={toggleSidebar} 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode} 
          setShowProfile={setShowProfile}
        />
        <div className="content">
          {showProfile ? (
            // <Profile isDarkMode={isDarkMode} />
            // <CartList isDarkMode={isDarkMode} />
            <CheckoutPage isDarkMode={isDarkMode} />
          ) : (
            <div 
              className="rounded shadow-sm p-4"
              style={{
                backgroundColor: `var(${isDarkMode ? '--dark-card-bg' : '--light-card-bg'})`,
                color: `var(${isDarkMode ? '--dark-text' : '--light-text'})`,
                borderColor: `var(${isDarkMode ? '--dark-border' : '--light-border'})`
              }}
            >
              <h2 className="mb-4">Welcome to Stock Admin Panel</h2>
              <p style={{ color: `var(${isDarkMode ? '--dark-text-secondary' : '--light-text-secondary'})` }}>
                Select an option from the sidebar to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
