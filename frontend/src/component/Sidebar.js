import React, { useState, useEffect } from 'react';
import { Nav, Form, InputGroup, Badge } from 'react-bootstrap';
import { 
  FaTachometerAlt, FaBoxes, FaExchangeAlt, FaUsers, 
  FaChartLine, FaCog, FaSearch, FaAngleDown, 
  FaBoxOpen, FaClipboardList, FaShoppingCart, FaFileInvoice,
  FaUserCog, FaUserPlus, FaChartBar, FaChartPie,
  FaBell, FaStar, FaMoon, FaSun,
  FaBars
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ show, isDarkMode }) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMenus, setExpandedMenus] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleFavorite = (path) => {
    setFavorites(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  const toggleSubmenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/',
      icon: <FaTachometerAlt size={18} />,
      notifications: 3
    },
    {
      title: 'Inventory',
      icon: <FaBoxes size={18} />,
      submenu: [
        { title: 'Stock Items', path: '/inventory', icon: <FaBoxOpen size={16} />, notifications: 5 },
        { title: 'Categories', path: '/categories', icon: <FaClipboardList size={16} /> },
        { title: 'Orders', path: '/orders', icon: <FaShoppingCart size={16} />, notifications: 2 },
        { title: 'Invoices', path: '/invoices', icon: <FaFileInvoice size={16} /> }
      ]
    },
    {
      title: 'Transactions',
      path: '/transactions',
      icon: <FaExchangeAlt size={18} />
    },
    {
      title: 'Users',
      icon: <FaUsers size={18} />,
      submenu: [
        { title: 'User List', path: '/users', icon: <FaUsers size={16} /> },
        { title: 'User Roles', path: '/user-roles', icon: <FaUserCog size={16} /> },
        { title: 'Add User', path: '/add-user', icon: <FaUserPlus size={16} /> }
      ]
    },
    {
      title: 'Reports',
      icon: <FaChartLine size={18} />,
      submenu: [
        { title: 'Sales Report', path: '/sales-report', icon: <FaChartBar size={16} /> },
        { title: 'Inventory Report', path: '/inventory-report', icon: <FaChartPie size={16} /> }
      ]
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: <FaCog size={18} />
    }
  ];

  const renderMenuItem = (item) => {
    const isActive = location.pathname === item.path;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isMenuExpanded = expandedMenus[item.title];
    const isFavorite = item.path && favorites.includes(item.path);

    const menuContent = (
      <div className="d-flex align-items-center justify-content-between w-100">
        <div className="d-flex align-items-center">
          <span className="me-3">{item.icon}</span>
          {isExpanded && <span>{item.title}</span>}
        </div>
        {isExpanded && (
          <div className="d-flex align-items-center">
            {item.notifications && (
              <Badge bg="danger" className="me-2">{item.notifications}</Badge>
            )}
            {item.path && (
              <FaStar
                className={`favorite-icon ${isFavorite ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(item.path);
                }}
              />
            )}
            {hasSubmenu && (
              <FaAngleDown className={`submenu-arrow ms-2 ${isMenuExpanded ? 'expanded' : ''}`} />
            )}
          </div>
        )}
      </div>
    );

    if (hasSubmenu) {
      return (
        <div key={item.title} className="nav-item-wrapper">
          <div 
            className={`nav-link ${isMenuExpanded ? 'active' : ''}`}
            onClick={() => toggleSubmenu(item.title)}
            style={{ cursor: 'pointer' }}
          >
            {menuContent}
          </div>
          <div className={`submenu ${isMenuExpanded && isExpanded ? 'show' : ''}`}>
            {item.submenu.map(subItem => renderMenuItem(subItem))}
          </div>
        </div>
      );
    }

    return (
      <Nav.Link
        key={item.path}
        as={Link}
        to={item.path}
        className={`nav-link ${isActive ? 'active' : ''}`}
      >
        {menuContent}
      </Nav.Link>
    );
  };

  const filteredMenuItems = menuItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div 
      className={`sidebar ${isDarkMode ? 'bg-dark' : 'bg-light'} ${show ? 'show' : ''} ${isExpanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={`sidebar-header p-3 border-bottom ${isDarkMode ? 'border-secondary' : 'border-gray'}`}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          {isExpanded ? (
            <h5 className={`${isDarkMode ? 'text-white' : 'text-dark'} mb-0 fw-bold`}>Admin Panel</h5>
          ) : (
            <div className={`${isDarkMode ? 'text-white' : 'text-dark'} mb-0 fw-bold text-center w-100`}>
              <FaBars size={20} />
            </div>
          )}
          {isExpanded && (
            <div className="d-flex align-items-center">
              <FaBell 
                className={`${isDarkMode ? 'text-light' : 'text-dark'}`} 
                style={{ cursor: 'pointer' }} 
              />
            </div>
          )}
        </div>
        {isExpanded && (
          <InputGroup>
            <InputGroup.Text className={`bg-transparent ${isDarkMode ? 'border-secondary text-light' : 'border-gray text-dark'}`}>
              <FaSearch size={14} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search menu..."
              className={`bg-transparent ${isDarkMode ? 'border-secondary text-light' : 'border-gray text-dark'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        )}
      </div>
      <Nav className="flex-column py-2">
        {filteredMenuItems.map(renderMenuItem)}
      </Nav>
    </div>
  );
};

export default Sidebar;