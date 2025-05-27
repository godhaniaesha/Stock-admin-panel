import React from 'react';
import { Row, Col, Card, Dropdown, Table } from 'react-bootstrap';
import { FaMoneyBillWave, FaTimesCircle, FaShippingFast, FaTruck, FaClipboardList, FaClock, FaBox, FaEnvelope } from 'react-icons/fa';
import { GiProgression } from 'react-icons/gi';
import { MdCancelPresentation, MdPendingActions, MdPlaylistAddCheck } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { TbEdit, TbEye } from 'react-icons/tb';

function OrderList(props) {

    const orders = [
        {
            id: '#583488/80',
            created_at: 'Apr 23, 2024',
            customer: 'Gail C. Anderson',
            priority: 'Normal',
            total: '$1,230.00',
            payment_status: 'Unpaid',
            items: 4,
            delivery_number: '-',
            order_status: 'Draft'
        },
        {
            id: '#456754/80',
            created_at: 'Apr 20, 2024',
            customer: 'Jung S. Ayala',
            priority: 'Normal',
            total: '$987.00',
            payment_status: 'Paid',
            items: 2,
            delivery_number: '-',
            order_status: 'Packaging'
        },
        {
            id: '#578246/80',
            created_at: 'Apr 19, 2024',
            customer: 'David A. Arnold',
            priority: 'High',
            total: '$1,478.00',
            payment_status: 'Paid',
            items: 5,
            delivery_number: '#D-57837678',
            order_status: 'Completed'
        },
        {
            id: '#348930/80',
            created_at: 'Apr 04, 2024',
            customer: 'Cecile D. Gordon',
            priority: 'Normal',
            total: '$720.00',
            payment_status: 'Refund',
            items: 4,
            delivery_number: '-',
            order_status: 'Canceled'
        },
        {
            id: '#391367/80',
            created_at: 'Apr 02, 2024',
            customer: 'William Moreno',
            priority: 'Normal',
            total: '$1,909.00',
            payment_status: 'Paid',
            items: 6,
            delivery_number: '#D-89734235',
            order_status: 'Completed'
        }
    ];

    return (
        <>
            <section className='Z_product_section mx-0 mx-lg-5 my-3'>
                <div className="Z_order_header d-flex justify-content-between align-items-center mb-4">
                    <h4 className="Z_order_title mb-0">ORDER LIST</h4>

                </div>
                <Row>
                    <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
                        <Card className="Z_order_card">
                            <Card.Body className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="Z_order_title">Delivered</h6>
                                    <h2 className="Z_order_count">200</h2>
                                </div>
                                <div className="Z_order_icon Z_delivered_icon">
                                    <MdPlaylistAddCheck size={30} />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
                        <Card className="Z_order_card">
                            <Card.Body className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="Z_order_title">In Progress</h6>
                                    <h2 className="Z_order_count">656</h2>
                                </div>
                                <div className="Z_order_icon Z_progress_icon">
                                    <GiProgression size={24} />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
                        <Card className="Z_order_card">
                            <Card.Body className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="Z_order_title">Pending Payment</h6>
                                    <h2 className="Z_order_count">608</h2>
                                </div>
                                <div className="Z_order_icon Z_pending_icon">
                                    <MdPendingActions size={24} />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
                        <Card className="Z_order_card">
                            <Card.Body className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="Z_order_title">Order Cancel</h6>
                                    <h2 className="Z_order_count">241</h2>
                                </div>
                                <div className="Z_order_icon Z_cancel_icon">
                                    <MdCancelPresentation size={24} />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <div className="Z_table_wrapper">
                    <div className="Z_order_header d-flex justify-content-between align-items-center mb-4">
                        <h5 className="Z_order_title mb-0">All Order List</h5>
                        <Dropdown className="Z_time_filter">
                            <Dropdown.Toggle variant="light" className="Z_filter_toggle">
                                This Month
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item>This Month</Dropdown.Item>
                                <Dropdown.Item>Last Month</Dropdown.Item>
                                <Dropdown.Item>Last 3 Months</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <Table className="Z_order_table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Created at</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Payment Status</th>
                                <th>Delivery Number</th>
                                <th>Order Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={index}>
                                    <td className="Z_order_id">{order.id}</td>
                                    <td>{order.created_at}</td>
                                    <td className="Z_customer_name">{order.customer}</td>
                                    <td className="Z_items_count">{order.items}</td>
                                    <td className="Z_order_total">{order.total}</td>
                                    <td>
                                        <span className={`Z_payment_status ${order.payment_status.toLowerCase()}`}>
                                            {order.payment_status}
                                        </span>
                                    </td>
                                    <td className="Z_delivery_number">{order.delivery_number}</td>
                                    <td>
                                        <span className={`Z_order_status ${order.order_status.toLowerCase()}`}>
                                            {order.order_status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <div className="Z_pagination d-flex justify-content-end align-items-center mt-4">
                        <button className="Z_page_btn" disabled>Previous</button>
                        <button className="Z_page_btn active">1</button>
                        <button className="Z_page_btn">2</button>
                        <button className="Z_page_btn">3</button>
                        <button className="Z_page_btn">Next</button>
                    </div>
                </div>
            </section>
        </>
    );
}

export default OrderList;