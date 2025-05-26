import '../styles/admin.css';
import React, { useState } from 'react';
import TopNavbar from './Navbar';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Main() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light-mode');
  };

  return (
    <div className={`d-flex ${isDarkMode ? 'bg-dark' : 'bg-light'}`}>
      <Sidebar show={showSidebar} isDarkMode={isDarkMode} />
      <div className="content-wrapper">
        <TopNavbar 
          toggleSidebar={toggleSidebar} 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode} 
        />
        <div className="content">
          <div className={`rounded shadow-sm p-4 ${isDarkMode ? 'bg-dark text-light' : 'bg-white text-dark'}`}>
            <h2 className="mb-4">Welcome to Stock Admin Panel</h2>
            <p className={isDarkMode ? 'text-light' : 'text-muted'}>Select an option from the sidebar to get started.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
