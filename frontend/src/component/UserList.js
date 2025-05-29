import React from 'react';
import { Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { FaUsersViewfinder } from 'react-icons/fa6';
import { LuClipboardList } from 'react-icons/lu';
import { RiCustomerServiceLine, RiDeleteBin6Line } from 'react-icons/ri';
import { TbEdit, TbEye, TbFileInvoice } from 'react-icons/tb';
import { useOutletContext } from 'react-router-dom';

function UserList() {
    const { isDarkMode } = useOutletContext();
    const users = [
        {
            id: 1,
            name: "Michael Anderson",
            image: "https://randomuser.me/api/portraits/men/1.jpg",
            email: "michael.anderson@example.com",
            phone: "+1 (555) 123-4567",
            city: "New York",
            role: "Admin"
        },
        {
            id: 2,
            name: "Sarah Johnson",
            image: "https://randomuser.me/api/portraits/women/2.jpg",
            email: "sarah.johnson@example.com",
            phone: "+1 (555) 234-5678",
            city: "Los Angeles",
            role: "Manager"
        },
        {
            id: 3,
            name: "David Wilson",
            image: "https://randomuser.me/api/portraits/men/3.jpg",
            email: "david.wilson@example.com",
            phone: "+1 (555) 345-6789",
            city: "Chicago",
            role: "User"
        },
        {
            id: 4,
            name: "Emily Brown",
            image: "https://randomuser.me/api/portraits/women/4.jpg",
            email: "emily.brown@example.com",
            phone: "+1 (555) 456-7890",
            city: "Houston",
            role: "Editor"
        },
        {
            id: 5,
            name: "James Taylor",
            image: "https://randomuser.me/api/portraits/men/5.jpg",
            email: "james.taylor@example.com",
            phone: "+1 (555) 567-8901",
            city: "Phoenix",
            role: "User"
        }
    ];

    return (
        <section className={`Z_product_section w-100 ${isDarkMode ? 'd_dark' : 'd_light'} mx-0 mx-lg-5 my-3`}>
            <Row className="mb-4">
                <Col lg={3} className="mb-3">
                    <Card className="Z_order_card">
                        <Card.Body className="d-flex align-items-center justify-content-between">
                            <div>
                                <p className="Z_order_title">All Customers</p>
                                <h3 className="Z_order_count">+22.63k</h3>
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
                                <h3 className="Z_order_count">+4.5k</h3>
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
                                <h3 className="Z_order_count">+1.03k</h3>
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
                                <h3 className="Z_order_count">$38,908.00</h3>
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
                    <h4>All Users List</h4>
                    <div className="Z_table_actions">
                        <Form.Select className="Z_time_filter">
                            <option>This Month</option>
                            <option>Last Month</option>
                            <option>Last 6 Months</option>
                            <option>This Year</option>
                        </Form.Select>
                    </div>
                </div>

                <div className="Z_table_scroll_container">
                    <table className="Z_product_table">
                        <thead>
                            <tr>
                                <th>
                                    <Form.Check type="checkbox" className="Z_table_checkbox" />
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
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <Form.Check type="checkbox" className="Z_table_checkbox" />
                                    </td>
                                    <td>
                                        <div className="Z_product_info_cell">
                                            <img src={user.image} alt={user.name} className="Z_table_product_img" />
                                            <span className="Z_table_product_name">{user.name}</span>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.city}</td>
                                    <td>
                                        <span className={`Z_user_role ${user.role.toLowerCase()}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="Z_action_buttons">
                                            <button className="Z_action_btn Z_view_btn">
                                                <TbEye size={22} />
                                            </button>
                                            <button className="Z_action_btn Z_edit_btn">
                                                <TbEdit size={22} />
                                            </button>
                                            <button className="Z_action_btn Z_delete_btn">
                                                <RiDeleteBin6Line size={22} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default UserList;