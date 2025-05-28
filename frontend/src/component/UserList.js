import React from 'react';
import { Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { BiSearchAlt } from 'react-icons/bi';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { FaUsersViewfinder } from 'react-icons/fa6';
import { LuClipboardList } from 'react-icons/lu';
import { RiCustomerServiceLine, RiDeleteBin6Line } from 'react-icons/ri';
import { TbEdit, TbEye, TbFileInvoice } from 'react-icons/tb';

function UserList() {
    const customers = [
        {
            id: 1,
            name: "Michael A. Miner",
            image: "https://randomuser.me/api/portraits/men/1.jpg",
            invoiceId: "#INV2540",
            status: "Completed",
            totalAmount: "$4,521",
            amountDue: "$8,901",
            dueDate: "07 Jan, 2023",
            paymentMethod: "Mastercard"
        },
        {
            id: 2,
            name: "Theresa T. Brose",
            image: "https://randomuser.me/api/portraits/women/2.jpg",
            invoiceId: "#INV3924",
            status: "Cancel",
            totalAmount: "$7,836",
            amountDue: "$9,902",
            dueDate: "03 Dec, 2023",
            paymentMethod: "Visa"
        }
        // ... Add more customer data as needed
    ];

    return (
        <section className="Z_product_section mx-0 mx-lg-5 my-3">
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
                    <h4>All Customers List</h4>
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
                                <th>Customer Name</th>
                                <th>Invoice ID</th>
                                <th>Status</th>
                                <th>Total Amount</th>
                                <th>Amount Due</th>
                                <th>Due Date</th>
                                <th>Payment Method</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(customer => (
                                <tr key={customer.id}>
                                    <td>
                                        <Form.Check type="checkbox" className="Z_table_checkbox" />
                                    </td>
                                    <td>
                                        <div className="Z_product_info_cell">
                                            <img src={customer.image} alt={customer.name} className="Z_table_product_img" />
                                            <span className="Z_table_product_name">{customer.name}</span>
                                        </div>
                                    </td>
                                    <td>{customer.invoiceId}</td>
                                    <td>
                                        <span className={`Z_order_status ${customer.status.toLowerCase()}`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td>{customer.totalAmount}</td>
                                    <td>{customer.amountDue}</td>
                                    <td>{customer.dueDate}</td>
                                    <td>{customer.paymentMethod}</td>
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