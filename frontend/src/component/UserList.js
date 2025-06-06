import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Button, Form, InputGroup, Spinner, Alert, Modal } from 'react-bootstrap';
import { FaUsersViewfinder } from 'react-icons/fa6';
import { LuClipboardList } from 'react-icons/lu';
import { RiCustomerServiceLine, RiDeleteBin6Line } from 'react-icons/ri';
import { TbEdit, TbEye, TbFileInvoice, TbSearch } from 'react-icons/tb';
import { useOutletContext } from 'react-router-dom';

// Import your userSlice actions - adjust path as needed
import {
    db_fetchUsers,
    db_deleteUser,
    db_resetUserState
} from '../redux/slice/userSlice';

function UserList() {
    const { isDarkMode } = useOutletContext();
    const dispatch = useDispatch();

    // Safe Redux state access with multiple fallback patterns
    const fullState = useSelector(state => state);
    console.log('Full Redux State:', fullState); // Debug log

    // Try different possible state structures
    const userState = useSelector(state => {
        // Check common Redux state patterns
        if (state.user) return state.user;
        if (state.users) return state.users;
        if (state.userSlice) return state.userSlice;
        return {};
    });

    console.log('User State:', userState); // Debug log

    // Safely extract values with defaults
    const users = Array.isArray(userState.users) ? userState.users : [];
    const isLoading = Boolean(userState.isLoading || userState.loading);
    const error = userState.error || null;

    // Local state
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [timeFilter, setTimeFilter] = useState('This Month');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState([]);

    // Check if Redux store is properly configured
    useEffect(() => {
        if (!fullState.user && !fullState.users && !fullState.userSlice) {
            console.error('Redux store not properly configured. Available state keys:', Object.keys(fullState));
            console.error('Make sure you have added userReducer to your store configuration');
        }
    }, [fullState]);

    // Fetch users on component mount
    useEffect(() => {
        if (dispatch && db_fetchUsers) {
            dispatch(db_fetchUsers());
        } else {
            console.error('Redux dispatch or db_fetchUsers not available');
        }

        // Cleanup on unmount
        return () => {
            if (dispatch && db_resetUserState) {
                dispatch(db_resetUserState());
            }
        };
    }, [dispatch]);

    // Filter users based on search term and role filter
    useEffect(() => {
        let filtered = users;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(user =>
                (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.phone || '').includes(searchTerm) ||
                (user.city || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Role filter
        if (roleFilter !== 'All') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        setFilteredUsers(filtered);
    }, [users, searchTerm, roleFilter]);

    // Calculate statistics
    const stats = {
        totalCustomers: users.length,
        totalOrders: users.reduce((acc, user) => acc + (user.orders || 0), 0),
        serviceRequests: users.reduce((acc, user) => acc + (user.serviceRequests || 0), 0),
        totalRevenue: users.reduce((acc, user) => acc + (user.totalSpent || 0), 0)
    };

    // Handle checkbox selection
    const handleUserSelection = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map(user => user._id || user.id));
        }
    };

    // Handle delete user
    const handleDeleteUser = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (userToDelete && dispatch && db_deleteUser) {
            try {
                await dispatch(db_deleteUser(userToDelete._id || userToDelete.id)).unwrap();
                setShowDeleteModal(false);
                setUserToDelete(null);
                // Remove from selected users if it was selected
                setSelectedUsers(prev => prev.filter(id => id !== (userToDelete._id || userToDelete.id)));
            } catch (error) {
                console.error('Delete error:', error);
            }
        }
    };

    // Handle bulk delete
    const handleBulkDelete = async () => {
        if (selectedUsers.length > 0 && dispatch && db_deleteUser) {
            try {
                await Promise.all(
                    selectedUsers.map(userId => dispatch(db_deleteUser(userId)).unwrap())
                );
                setSelectedUsers([]);
            } catch (error) {
                console.error('Bulk delete error:', error);
            }
        }
    };

    // Get unique roles for filter dropdown
    const uniqueRoles = [...new Set(users.map(user => user.role).filter(Boolean))];

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    // Format numbers
    const formatNumber = (num) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return (num || 0).toString();
    };

    // Get user avatar or default
  

    // Show error if Redux is not properly configured
    if (!fullState.user && !fullState.users && !fullState.userSlice) {
        return (
            <div className="container mt-5">
                <Alert variant="danger">
                    <Alert.Heading>Redux Configuration Error</Alert.Heading>
                    <p>
                        The Redux store is not properly configured for user management.
                        Please ensure that:
                    </p>
                    <ul>
                        <li>Your Redux store includes the user reducer</li>
                        <li>The user slice is properly imported and added to the store</li>
                        <li>The Provider component wraps your app</li>
                    </ul>
                    <hr />
                    <p className="mb-0">
                        Available Redux state keys: {Object.keys(fullState).join(', ') || 'None'}
                    </p>
                </Alert>
            </div>
        );
    }

    if (isLoading && users.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <section className={`Z_product_section w-100 ${isDarkMode ? 'd_dark' : 'd_light'} mx-0 mx-lg-5 my-3`}>
            {/* Error Alert */}
            {error && (
                <Alert variant="danger" dismissible onClose={() => dispatch(db_resetUserState())}>
                    {error}
                </Alert>
            )}

            {/* Debug Info (remove in production) */}
            {process.env.NODE_ENV === 'development' && (
                <Alert variant="info" className="mb-3">
                    <small>
                        Debug: Users loaded: {users.length}, Loading: {isLoading.toString()},
                        Redux keys: {Object.keys(fullState).join(', ')}
                    </small>
                </Alert>
            )}

            {/* Statistics Cards */}
            <Row className="mb-4">
                <Col lg={3} className="mb-3">
                    <Card className="Z_order_card">
                        <Card.Body className="d-flex align-items-center justify-content-between">
                            <div>
                                <p className="Z_order_title">All Customers</p>
                                <h3 className="Z_order_count">+{formatNumber(stats.totalCustomers)}</h3>
                            </div>
                            <div className="Z_order_icon Z_progress_icon">
                                <FaUsersViewfinder size={24} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3} className="mb-3">
                    <Card className="Z_order_card">
                        <Card.Body className="d-flex align-items-center justify-content-between">
                            <div>
                                <p className="Z_order_title">Orders</p>
                                <h3 className="Z_order_count">+{formatNumber(stats.totalOrders)}</h3>
                            </div>
                            <div className="Z_order_icon Z_delivering_icon">
                                <LuClipboardList size={24} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3} className="mb-3">
                    <Card className="Z_order_card">
                        <Card.Body className="d-flex align-items-center justify-content-between">
                            <div>
                                <p className="Z_order_title">Services Request</p>
                                <h3 className="Z_order_count">+{formatNumber(stats.serviceRequests)}</h3>
                            </div>
                            <div className="Z_order_icon Z_shipped_icon">
                                <RiCustomerServiceLine size={24} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3} className="mb-3">
                    <Card className="Z_order_card">
                        <Card.Body className="d-flex align-items-center justify-content-between">
                            <div>
                                <p className="Z_order_title">Invoice & Payment</p>
                                <h3 className="Z_order_count">{formatCurrency(stats.totalRevenue)}</h3>
                            </div>
                            <div className="Z_order_icon Z_review_icon">
                                <TbFileInvoice size={24} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <div className="Z_table_wrapper">
                <div className="Z_table_header">
                    <h4>All Users List ({filteredUsers.length})</h4>
                    <div className="Z_table_actions d-flex gap-2 align-items-center flex-wrap">
                        {/* Search Input */}
                        <InputGroup style={{ width: '250px' }}>
                            <InputGroup.Text>
                                <TbSearch />
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>

                        {/* Role Filter */}
                        <Form.Select
                            style={{ width: '150px' }}
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="All">All Roles</option>
                            {uniqueRoles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </Form.Select>

                        {/* Time Filter
                        <Form.Select
                            className="Z_time_filter"
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value)}
                        >
                            <option value="This Month">This Month</option>
                            <option value="Last Month">Last Month</option>
                            <option value="Last 6 Months">Last 6 Months</option>
                            <option value="This Year">This Year</option>
                        </Form.Select> */}

                        {/* Bulk Actions */}
                        {selectedUsers.length > 0 && (
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={handleBulkDelete}
                                disabled={isLoading}
                            >
                                Delete Selected ({selectedUsers.length})
                            </Button>
                        )}
                    </div>
                </div>

                <div className="Z_table_scroll_container">
                    <table className="Z_product_table">
                        <thead>
                            <tr>
                                <th>
                                    <Form.Check
                                        type="checkbox"
                                        className="Z_table_checkbox"
                                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th>User Details</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>City</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">
                                        {isLoading ? (
                                            <Spinner animation="border" size="sm" />
                                        ) : (
                                            <div>
                                                <p className="mb-0">No users found</p>
                                                {searchTerm && <small className="text-muted">Try adjusting your search criteria</small>}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user._id || user.id}>
                                        <td>
                                            <Form.Check
                                                type="checkbox"
                                                className="Z_table_checkbox"
                                                checked={selectedUsers.includes(user._id || user.id)}
                                                onChange={() => handleUserSelection(user._id || user.id)}
                                            />
                                        </td>
                                        <td>
                                            <div className="Z_product_info_cell">
                                                <img
                                                    src={`http://localhost:2221/KAssets/image/${user.profileImage}`}
                                                    alt={user.name || 'User'}
                                                    className="Z_table_product_img"

                                                />
                                                <span className="Z_table_product_name">
                                                    {user.firstName || user.lastName || 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td>{user.email || 'N/A'}</td>
                                        <td>{user.phone || user.mobile || 'N/A'}</td>
                                        <td>{user.city || user.location || 'N/A'}</td>
                                        <td>
                                            <span className={`Z_user_role ${(user.role || '').toLowerCase()}`}>
                                                {user.role || 'User'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="Z_action_buttons">
                                                <button
                                                    className="Z_action_btn Z_view_btn"
                                                    title="View User"
                                                    onClick={() => {
                                                        console.log('View user:', user._id || user.id);
                                                    }}
                                                >
                                                    <TbEye size={22} />
                                                </button>
                                                <button
                                                    className="Z_action_btn Z_edit_btn"
                                                    title="Edit User"
                                                    onClick={() => {
                                                        console.log('Edit user:', user._id || user.id);
                                                    }}
                                                >
                                                    <TbEdit size={22} />
                                                </button>
                                                <button
                                                    className="Z_action_btn Z_delete_btn"
                                                    title="Delete User"
                                                    onClick={() => handleDeleteUser(user)}
                                                    disabled={isLoading}
                                                >
                                                    <RiDeleteBin6Line size={22} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete user "{userToDelete?.name || userToDelete?.username}"? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={confirmDelete}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </section>
    );
}

export default UserList;