import React, { useState, useEffect } from 'react';
import { Nav, Form, InputGroup, Badge } from 'react-bootstrap';
import {
  FaTachometerAlt, FaBoxes, FaUsers, FaChartLine, FaCog, FaSearch, FaAngleDown,
  FaClipboardList, FaShoppingCart, FaFileInvoice, FaUserPlus, FaChartBar, FaChartPie,
  FaBell, FaStar, FaPlus, FaHeart, FaShoppingBag, FaBars, FaTags, FaLayerGroup, FaList, FaEdit, FaEye
} from 'react-icons/fa';
import { RiCoupon3Fill } from "react-icons/ri";
import { BsFillGrid1X2Fill } from "react-icons/bs";
import { Link, useLocation } from 'react-router-dom';
import '../styles/admin.css';
import { TbListDetails } from 'react-icons/tb';
import { useDispatch } from 'react-redux';
import { db_fetchUserById } from '../redux/slice/userSlice';
import { BiDetail } from 'react-icons/bi';
import Cookies from 'js-cookie';

const Sidebar = ({ show, isDarkMode }) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMenus, setExpandedMenus] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // When the sidebar is 'shown' (e.g., as an offcanvas on smaller screens),
    // ensure it is expanded internally to display all menu items.
    if (show) {
      setIsExpanded(true);
    } else {
      // When the sidebar is hidden (e.g., offcanvas closes), reset to collapsed
      // state for desktop view or next open.
      setIsExpanded(false);
    }
  }, [show]); // Depend on 'show' prop to react to offcanvas visibility changes

  const toggleFavorite = (path) => {
    setFavorites(prev => prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]);
  };

  const toggleSubmenu = (menu) => {
    setExpandedMenus(prev => {
      const newState = {};
      Object.keys(prev).forEach(key => {
        newState[key] = key === menu ? !prev[menu] : false;
      });
      if (!(menu in prev)) newState[menu] = true;
      return newState;
    });
  };

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const userId = localStorage.getItem('user');
        if (userId) {
          const result = await dispatch(db_fetchUserById(userId)).unwrap();
          setUserRole(result.role);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };

    checkUserRole();
  }, [dispatch]);

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
        { title: 'Edit Category', path: '/categories/edit', icon: <FaEdit size={14} />, hidden: true },

      ]
    },
    {
      title: 'Subcategories',
      icon: <FaLayerGroup size={16} />,
      submenu: [
        { title: 'Subcategory List', path: '/subcategories', icon: <FaList size={14} /> },
        { title: 'Add Subcategory', path: '/subcategories/add', icon: <FaPlus size={14} /> },
        { title: 'Edit Subcategory', path: '/subcategories/edit', icon: <FaEdit size={14} />, hidden: true }
      ]
    },
    {
      title: 'Products',
      icon: <FaBoxes size={18} />,
      submenu: [
        { title: 'Product Grid', path: '/products', icon: <BsFillGrid1X2Fill size={16} />, notifications: 5 },
        { title: 'Add Product', path: '/products/add', icon: <FaPlus size={16} /> },
        { title: 'Product Details', path: '/products/details/:id', icon: <TbListDetails size={16} />, hidden: true },
        { title: 'Edit Product', path: '/products/edit', icon: <FaEdit size={16} />, hidden: true },
        { title: 'View Product', path: '/products/view', icon: <FaEye size={16} /> }
      ]
    },
    {
      title: 'Coupons',
      icon: <RiCoupon3Fill size={18} />,
      show: userRole === 'admin',
      submenu: [
        { title: 'Coupon List', path: '/coupons', icon: <FaList size={14} /> },
        { title: 'Add Coupon', path: '/coupons/add', icon: <FaPlus size={14} /> },
        // { title: 'Edit Coupon', path: '/coupons/edit', icon: <FaEdit size={14} /> }
        { title: 'Edit Coupon', path: '/coupons/edit', icon: <FaEdit size={14} />, hidden: true }
      ]
    },
    {
      title: 'Orders',
      icon: <FaShoppingCart size={18} />,
      submenu: [
        { title: 'Order List', path: '/orders', icon: <FaClipboardList size={16} />, notifications: 2 },
        { title: 'Order detail', path: '/orderdetail/', icon: <FaClipboardList size={16} />, hidden: true },

        { title: 'Shopping Cart', path: '/cart', icon: <FaShoppingBag size={16} /> },
        { title: 'Wishlist', path: '/wishlist', icon: <FaHeart size={16} /> },
        { title: 'Checkout', path: '/checkout', icon: <FaFileInvoice size={16} /> }
      ]
    },
    {
      title: 'Users',
      icon: <FaUsers size={18} />,
      show: userRole === 'admin',
      submenu: [
        { title: 'User List', path: '/users', icon: <FaUsers size={16} /> },
        // { title: 'User Roles', path: '/user-roles', icon: <FaUserCog size={16} /> },
        { title: 'Add User', path: '/add-user', icon: <FaUserPlus size={16} /> },
        { title: 'User Detail', path: 'userdetail/:id', icon: <BiDetail size={16} />, hidden: true }
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
    // {
    //   title: 'Settings',
    //   path: '/settings',
    //   icon: <FaCog size={18} />
    // }
  ];

  const renderMenuItem = (item) => {
    const isActive = location.pathname === item.path;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isMenuExpanded = expandedMenus[item.title];
    const isFavorite = item.path && favorites.includes(item.path);
    const isSubmenuActive = hasSubmenu && item.submenu.some(subItem => location.pathname.startsWith(subItem.path));

    const menuContent = (
      <div className={`d-flex align-items-center justify-content-between w-100 ${(isActive || isSubmenuActive) ? 'active-item' : ''}`}>
        <div className="d-flex align-items-center">
          <span className={`me-3 ${(isActive || isSubmenuActive) ? 'active-icon' : ''}`}>{item.icon}</span>
          {isExpanded && <span className={isActive ? 'active-text' : ''}>{item.title}</span>}
        </div>
        {isExpanded && (
          <div className="d-flex align-items-center">
            {item.notifications && <Badge bg="danger" className="me-2">{item.notifications}</Badge>}
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
            {hasSubmenu && <FaAngleDown className={`submenu-arrow ms-2 ${isMenuExpanded ? 'expanded' : ''}`} />}
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
            {item.submenu.filter(subItem => !subItem.hidden).map(subItem => renderMenuItem(subItem))}
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

  const filteredMenuItems = menuItems.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div
      className={`sidebar overflow-hidden ${show ? 'show' : ''} ${isExpanded ? 'expanded' : 'collapsed'} ${!isDarkMode ? 'light-mode' : ''}`}
      onMouseEnter={() => !show && setIsExpanded(true)} // Only expand on hover if not in offcanvas mode
      onMouseLeave={() => !show && setIsExpanded(false)} // Only collapse on leave if not in offcanvas mode
      style={{
        zIndex: '11111',
        backgroundColor: `var(${isDarkMode ? '--dark-card-bg' : '--light-card-bg'})`,
        color: `var(${isDarkMode ? '--dark-text' : '--light-text'})`,
        borderRight: `1px solid var(${isDarkMode ? '--dark-border' : '--light-border'})`,
        // zIndex:'11111',
        // marginTop:'4.6rem'
      }}
    >
      <div className="sidebar-header p-3 border-bottom" style={{ borderColor: `var(${isDarkMode ? '--dark-border' : '--light-border'})` }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          {isExpanded ? (
            <h5 className="mb-0 fw-bold" style={{ color: `var(${isDarkMode ? '--dark-text' : '--light-text'})` }}>Admin Panel</h5>
          ) : (
            <div className="mb-0 fw-bold text-center w-100" style={{ color: `var(${isDarkMode ? '--dark-text' : '--light-text'})` }}>
              <FaBars size={20} />
            </div>
          )}
          {isExpanded && (
            <FaBell style={{ cursor: 'pointer', color: `var(${isDarkMode ? '--dark-text' : '--light-text'})` }} />
          )}
        </div>
        {isExpanded && (
          <InputGroup>
            <InputGroup.Text style={{ backgroundColor: 'transparent', borderColor: `var(${isDarkMode ? '--dark-border' : '--light-border'})`, color: `var(${isDarkMode ? '--dark-text' : '--light-text'})` }}>
              <FaSearch size={14} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search menu..."
              style={{ backgroundColor: 'transparent', borderColor: `var(${isDarkMode ? '--dark-border' : '--light-border'})`, color: `var(${isDarkMode ? '--dark-text' : '--light-text'})` }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        )}
      </div>
      <Nav className="flex-column py-2"
        style={
          {
            maxHeight: '79vh',
            overflow: 'scroll',
            flexDirection: 'column',
            flexWrap: 'nowrap',
          }
        }
      >
        {filteredMenuItems.map(item => (
          item.show !== false && (
            <div
              key={item.title}
              className="nav-item"
              style={{
                backgroundColor: location.pathname === item.path ? `var(${isDarkMode ? '--dark-border' : '--light-border'})` : 'transparent',
                borderLeft: `3px solid ${location.pathname === item.path ? 'var(--accent-color)' : 'transparent'}`
              }}
            >
              {renderMenuItem(item)}
            </div>
          )
        ))}
      </Nav>
    </div >
  );
};

export default Sidebar;
