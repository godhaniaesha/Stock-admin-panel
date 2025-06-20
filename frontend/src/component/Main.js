    import '../styles/admin.css';
    import React, { useState } from 'react';
    import { Outlet } from 'react-router-dom';
    import TopNavbar from './Navbar';
    import Sidebar from './Sidebar';
    import Profile from './Profile';
    import Dashboard from './Dashboard';
    import 'bootstrap/dist/css/bootstrap.min.css';
    import CartList from './CartList';
    import CheckoutPage from './CheckoutPage';
    import D_StockManagementChart from './D_StockManagementChart';

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
          className="d-flex w-100" 
          style={{ 
            backgroundColor: `var(${isDarkMode ? '--dark-bg' : '--light-bg'})`,
            color: `var(${isDarkMode ? '--dark-text' : '--light-text'})`
          }}
        >
          <Sidebar show={showSidebar} isDarkMode={isDarkMode} toggleSidebar={toggleSidebar} />
          <div 
            className="content-wrapper " 
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
              style={{ 
                zIndex: 1111,
              }}
            />
            <div className="content w-100">
              {showProfile ? (
                <Profile isDarkMode={isDarkMode} />
              ) : (
                <div 
                  className="rounded d-flex justify-content-center shadow-sm px-md-4 mt-5"
                  style={{
                    backgroundColor: `var(${isDarkMode ? '--dark-card-bg' : '--light-card-bg'})`,
                    color: `var(${isDarkMode ? '--dark-text' : '--light-text'})`,
                    borderColor: `var(${isDarkMode ? '--dark-border' : '--light-border'})`,
                     height: "calc(100vh - 100px)",
                    overflowY: "scroll"
                  }}
                >
                  {/* <Dashboard isDarkMode={isDarkMode} /> */}
                  <Outlet context={{ isDarkMode }} />
                  {/* <D_StockManagementChart /> */}
                </div>
              )}
            </div>
          </div>
        </div>
      );  
    }
