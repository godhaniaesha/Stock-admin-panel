// ../components/OrderList.js
import React, { useEffect } from 'react';
import { Row, Col, Card, Dropdown, Table } from 'react-bootstrap';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { GiProgression } from 'react-icons/gi';
import { MdCancelPresentation, MdPendingActions, MdPlaylistAddCheck } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../redux/slice/order.slice';
import { useOutletContext } from 'react-router-dom';
import { useState } from 'react'; 
import {  TbEye } from 'react-icons/tb';

function OrderList() {
  const { isDarkMode } = useOutletContext();
  const dispatch = useDispatch();
    const navigate = useNavigate();

  const { orders, isLoading, error } = useSelector((state) => state.order);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10); // You can adjust this number

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
const handleViewOrder = (orderId) => {
  navigate(`/orderdetail/${orderId}`);
};
  return (
    <section className={`Z_product_section mx-0 mx-lg-5 my-md-3 ${isDarkMode ? 'd_dark' : 'd_light'}`}>
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
              <th>Customer</th>
              {/* <th>Items</th> */}
              <th>Created at</th>
              <th>Total</th>
              {/* <th>Payment Status</th> */}
              {/* <th>Delivery Number</th> */}
              <th>Order Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="8">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan="8">Error: {error}</td></tr>
            ) : currentOrders.length === 0 ? (
              <tr><td colSpan="8">No Orders Found</td></tr>
            ) : (
              currentOrders.map((order, index) => (
                <tr key={order._id || index}>
                  <td className="Z_order_id">
                    {order._id ? `...${order._id.slice(-6)}` : 'N/A'}
                  </td>

                  <td className="Z_customer_name">
                    {order.userId ? `${order.userId.firstName}` : 'N/A'}
                  </td>
                  {/* <td className="Z_items_count">
                    {order.items ? order.items.map(item => (
                      <div key={item._id}>
                        {item.productId?.productName} (Qty: {item.quantity})
                      </div>
                    )) : 'N/A'}
                  </td> */}
                   <td>
                    {order.createdAt ? 
                      new Date(order.createdAt).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      }) + ' | ' + new Date(order.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      }) : 'N/A'}
                  </td>
                  <td className="Z_order_total">
                    {order.items ? order.items.reduce(
                      (total, item) => total + (item.productId?.price * item.quantity), 0
                    ).toFixed(2) : 'N/A'}
                  </td> 
                  {/* <td>
                    <span className={`Z_payment_status ${order.paymentMethod ? order.paymentMethod.toLowerCase() : ''}`}>
                      {order.paymentMethod || 'N/A'}
                    </span>
                  </td> */}
                  {/* <td className="Z_delivery_number">{order.phone || 'N/A'}</td> */}
                  <td>
                    <span className="Z_order_status">
                      {order.status || 'N/A'}
                    </span>
                  </td>
                  <td>
  <button 
    className="Z_action_btn Z_view_btn"
    onClick={() => handleViewOrder(order._id)}
  >
    <TbEye size={22} />
  </button>
</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        <div className="Z_pagination d-flex justify-content-end align-items-center mt-4">
          <button className="Z_page_btn" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}><FaAngleLeft /></button>
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`Z_page_btn ${currentPage === number ? 'active' : ''}`}
            >
              {number}
            </button>
          ))}
          <button className="Z_page_btn" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}><FaAngleRight /></button>
        </div>
      </div>
    </section>
  );
}

export default OrderList;