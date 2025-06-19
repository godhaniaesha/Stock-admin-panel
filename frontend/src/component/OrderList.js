// ../components/OrderList.js
import React, { useEffect } from 'react';
import { Row, Col, Card, Dropdown, Table } from 'react-bootstrap';
import { FaAngleLeft, FaAngleRight, FaCaretDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { GiProgression } from 'react-icons/gi';
import { MdCancelPresentation, MdPendingActions, MdPlaylistAddCheck } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../redux/slice/order.slice';
import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import { TbEdit, TbEye } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';

function OrderList() {
  const { isDarkMode } = useOutletContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //  const [selectedTimeFilter, setSelectedTimeFilter] = useState('All');
      const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');

  const { orders, isLoading, error } = useSelector((state) => state.order);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5); // Changed from 10 to 6

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Filter orders based on selectedStatusFilter
  const filteredOrders = selectedStatusFilter === 'All'
    ? orders
    : orders.filter(order => (order.status || '').toLowerCase() === selectedStatusFilter.toLowerCase());

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 1;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 1; i <= maxVisiblePages; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 1) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const handleViewOrder = (orderId) => {
    navigate(`/orderdetail/${orderId}`);
  };
  return (
    <section className={`Z_product_section mx-0 mx-lg-5 my-md-3 ${isDarkMode ? 'd_dark' : 'd_light'}`}>
      <div className="Z_order_header d-flex justify-content-between align-items-center mb-4">
        <h4 className="Z_order_title mb-0 mt-3 ms-1">ORDER LIST</h4>
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
          <h5 className="Z_order_title mb-0 ">All Order List</h5>
          {/* <Dropdown className="Z_time_filter">
            <Dropdown.Toggle variant="light" className="Z_filter_toggle">
              This Month
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>This Month</Dropdown.Item>
              <Dropdown.Item>Last Month</Dropdown.Item>
              <Dropdown.Item>Last 3 Months</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> */}
          <div className='Z_select_wrapper'>
            <select
              className="Z_time_filter"
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
            >
              <option value="All">All Order</option>
              <option value="delivered">Delivered</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>

            </select>
            <div className="Z_select_caret"><FaCaretDown size={20} color='white' /></div>
          </div>
        </div>

        <Table className="Z_order_table">
          <thead>
            <tr style={{textWrap :"nowrap"}}>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Created at</th>
              <th>Total</th>
              <th>Order Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="6">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan="6">Error: {error}</td></tr>
            ) : currentOrders.length === 0 ? (
              <tr><td colSpan="6">No Orders Found</td></tr>
            ) : (
              currentOrders.map((order, index) => (
                <tr key={order._id || index}>
                  <td className="Z_order_id">
                    {order._id ? `...${order._id.slice(-6)}` : 'N/A'}
                  </td>
                  <td className="Z_customer_name">
                    {order.userId ? `${order.userId.firstName}` : 'N/A'}
                  </td>
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
          {getPageNumbers().map((number, index) => (
            <button
              key={index}
              onClick={() => typeof number === 'number' ? paginate(number) : null}
              className={`Z_page_btn ${currentPage === number ? 'active' : ''} ${typeof number !== 'number' ? 'disabled' : ''}`}
              disabled={typeof number !== 'number'}
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