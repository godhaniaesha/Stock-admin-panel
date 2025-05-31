import React, { useState, useEffect } from 'react';
import { Nav, Form, InputGroup, Badge } from 'react-bootstrap';
import { 
  FaTachometerAlt, FaBoxes, FaExchangeAlt, FaUsers, 
  FaChartLine, FaCog, FaSearch, FaAngleDown, 
  FaBoxOpen, FaClipboardList, FaShoppingCart, FaFileInvoice,
  FaUserCog, FaUserPlus, FaChartBar, FaChartPie,
  FaBell, FaStar, FaMoon, FaSun, FaEdit, FaEye,
  FaPlus, FaHeart, FaShoppingBag, FaBars, FaTags,
  FaLayerGroup, FaList
} from 'react-icons/fa';
import { RiCoupon3Fill } from "react-icons/ri";
import { BsFillGrid1X2Fill } from "react-icons/bs";
import { Link, useLocation } from 'react-router-dom';
import '../styles/admin.css';  

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
    setExpandedMenus(prev => {
      const newState = {};
      // Close all menus except the clicked one
      Object.keys(prev).forEach(key => {
        newState[key] = key === menu ? !prev[menu] : false;
      });
      // If the menu wasn't previously in state, add it as open
      if (!(menu in prev)) {
        newState[menu] = true;
      }
      return newState;
    });
  };

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/',
      icon: <FaTachometerAlt size={18} />,
      notifications: 3
    },
    {
      title: 'Stock Management',
      icon: <FaList size={18} />,
      submenu: [
        { title: 'Stock Overview', path: '/stock', icon: <FaList size={14} /> },
        { title: 'Add Stock', path: '/stock/add', icon: <FaPlus size={14} /> },
        { title: 'Low Stock Alerts', path: '/stock/alerts', icon: <FaBell size={14} /> }
      ]
    },
    {
      title: 'Categories',
      icon: <FaTags size={18} />,
      submenu: [
        { title: 'Category List', path: '/categories', icon: <FaList size={14} /> },
        { title: 'Add Category', path: '/categories/add', icon: <FaPlus size={14} /> },
        { title: 'Edit Category', path: '/categories/edit', icon: <FaEdit size={14} /> },
      
      ]
    },
    { 
      title: 'Subcategories',
      icon: <FaLayerGroup size={16} />,
      submenu: [
        { title: 'Subcategory List', path: '/subcategories', icon: <FaList size={14} /> },
        { title: 'Add Subcategory', path: '/subcategories/add', icon: <FaPlus size={14} /> },
        { title: 'Edit Subcategory', path: '/subcategories/edit', icon: <FaEdit size={14} /> }
      ]
    },
    {
      title: 'Products',
      icon: <FaBoxes size={18} />,
      submenu: [
        { title: 'Product Grid', path: '/products', icon: <BsFillGrid1X2Fill size={16} />, notifications: 5 },
        { title: 'Add Product', path: '/products/add', icon: <FaPlus size={16} /> },
        { title: 'Edit Product', path: '/products/edit', icon: <FaEdit size={16} /> },
        { title: 'View Product', path: '/products/view', icon: <FaEye size={16} /> }
      ]
    },
    {
      title: 'Coupons',
      icon: <RiCoupon3Fill size={18} />,
      submenu: [
        { title: 'Coupon List', path: '/coupons', icon: <FaList size={14} /> },
        { title: 'Add Coupon', path: '/coupons/add', icon: <FaPlus size={14} /> },
        { title: 'Edit Coupon', path: '/coupons/edit', icon: <FaEdit size={14} /> }
      ]
    },
    {
      title: 'Orders',
      icon: <FaShoppingCart size={18} />,
      submenu: [
        { title: 'Order List', path: '/orders', icon: <FaClipboardList size={16} />, notifications: 2 },
        { title: 'Shopping Cart', path: '/cart', icon: <FaShoppingBag size={16} /> },
        { title: 'Wishlist', path: '/wishlist', icon: <FaHeart size={16} /> },
        { title: 'Checkout', path: '/checkout', icon: <FaFileInvoice size={16} /> }
      ]
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
    const isSubmenuActive = hasSubmenu && item.submenu.some(subItem => location.pathname === subItem.path);

    const menuContent = (
      <div className={`d-flex align-items-center justify-content-between w-100 ${(isActive || isSubmenuActive) ? 'active-item' : ''}`}>
        <div className="d-flex align-items-center">
          <span className={`me-3 ${(isActive || isSubmenuActive) ? 'active-icon' : ''}`}>{item.icon}</span>
          {isExpanded && <span className={isActive ? 'active-text' : ''}>{item.title}</span>}
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
        <div key={item.title} className={`nav-item-wrapper ${isSubmenuActive ? 'active-submenu' : ''}`}>
          <div 
            className={`nav-link ${isMenuExpanded ? 'expanded' : ''} ${isSubmenuActive ? 'active' : ''}`}
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
      className={`sidebar overflow-hidden ${show ? 'show' : ''} ${isExpanded ? 'expanded' : 'collapsed'} ${!isDarkMode ? 'light-mode' : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      style={{ 
        backgroundColor: `var(${isDarkMode ? '--dark-card-bg' : '--light-card-bg'})`,
        color: `var(${isDarkMode ? '--dark-text' : '--light-text'})`,
        borderRight: `1px solid var(${isDarkMode ? '--dark-border' : '--light-border'})`
      }}
    >
      <div 
        className="sidebar-header p-3 border-bottom"
        style={{ 
          borderColor: `var(${isDarkMode ? '--dark-border' : '--light-border'})`,
          backgroundColor: `var(${isDarkMode ? '--dark-card-bg' : '--light-card-bg'})`
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          {isExpanded ? (
            <h5 
              className="mb-0 fw-bold"
              style={{ color: `var(${isDarkMode ? '--dark-text' : '--light-text'})` }}
            >
              Admin Panel
            </h5>
          ) : (
            <div 
              className="mb-0 fw-bold text-center w-100"
              style={{ color: `var(${isDarkMode ? '--dark-text' : '--light-text'})` }}
            >
              <FaBars size={20} />
            </div>
          )}
          {isExpanded && (
            <div className="d-flex align-items-center">
              <FaBell 
                style={{ 
                  cursor: 'pointer',
                  color: `var(${isDarkMode ? '--dark-text' : '--light-text'})` 
                }} 
              />
            </div>
          )}
        </div>
        {isExpanded && (
          <InputGroup>
            <InputGroup.Text 
              style={{ 
                backgroundColor: 'transparent',
                borderColor: `var(${isDarkMode ? '--dark-border' : '--light-border'})`,
                color: `var(${isDarkMode ? '--dark-text' : '--light-text'})` 
              }}
            >
              <FaSearch size={14} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search menu..."
              style={{ 
                backgroundColor: 'transparent',
                borderColor: `var(${isDarkMode ? '--dark-border' : '--light-border'})`,
                color: `var(${isDarkMode ? '--dark-text' : '--light-text'})`,
                '::placeholder': {
                  color: `var(${isDarkMode ? '--dark-text-secondary' : '--light-text-secondary'})`
                }
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        )}
      </div>
      <Nav className="flex-column py-2">
        {filteredMenuItems.map(item => (
          <div 
            key={item.title} 
            className="nav-item"
            style={{
              backgroundColor: location.pathname === item.path ? 
                `var(${isDarkMode ? '--dark-border' : '--light-border'})` : 'transparent',
              borderLeft: `3px solid ${location.pathname === item.path ? 
                'var(--accent-color)' : 'transparent'}`
            }}
          >
            {renderMenuItem(item)}
          </div>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;
