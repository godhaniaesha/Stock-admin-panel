import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../styles/sales.css';
import '../styles/Z_styles.css';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Table, Modal } from 'react-bootstrap';
import { TbEdit, TbEye } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { fetchSalesMetrics, fetchOrdersBySeller } from '../redux/slice/sales.slice';
import { fetchOrders } from '../redux/slice/order.slice';
import { useNavigate } from 'react-router-dom';

ChartJS.register(LineElement, BarElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function SalesReport() {
  const { isDarkMode } = useOutletContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const salesState = useSelector((state) => state.dashboard.dashboardData);
  const { totalSales, totalOrders, avgOrderValue, conversionRate, ordersAndSalesOverTime = [], loading = false, error = null } = salesState || {};
  const { orders, isLoading: ordersLoading, error: ordersError } = useSelector((state) => state.order);
  const { sellerOrders = [] } = useSelector((state) => state.sales) || {};

  const [selectedRange, setSelectedRange] = useState('Last 7 Days');
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  console.log(selectedOrder);


  useEffect(() => {
    let period;
    let params = {};

    switch (selectedRange) {
      case 'Last 7 Days':
        period = 'last_7_days';
        break;
      case 'Last 30 Days':
        period = 'last_30_days';
        break;
      case 'Last Quarter':
        period = 'last_quarter';
        break;
      case 'Custom Range':
        if (startDate && endDate) {
          period = 'custom';
          params = {
            startDate,
            endDate
          };
        } else {
          return;
        }
        break;
      default:
        period = 'last_7_days';
    }

    dispatch(fetchSalesMetrics({ period, ...params }));

  }, [dispatch, selectedRange, startDate, endDate]);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch])

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Calculate total pages
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handleViewOrder = (orderId) => {
    const order = orders.find(order => order._id === orderId);
    if (order && order.items && order.items.length > 0) {
      const sellerId = order.items[0].productId?.sellerId?._id;
      if (sellerId) {
        dispatch(fetchOrdersBySeller(sellerId));
      }
    }
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  // const handleViewOrder = (orderId) => {
  //   navigate(`/orderdetail/${orderId}`);
  // };

  const lineChartData = {
    labels: ordersAndSalesOverTime.map(item => item.day) || [],
    datasets: [
      {
        label: 'Sales',
        data: ordersAndSalesOverTime.map(item => item.sales) || [],
        borderColor: '#D3CEDF',
        backgroundColor: 'rgba(222, 140, 230, 0.45)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  const barChartData = {
    labels: ordersAndSalesOverTime.map(item => item.day) || [],
    datasets: [
      {
        label: 'Orders',
        data: ordersAndSalesOverTime.map(item => item.orders) || [],
        backgroundColor: '#a3c6c4',
        borderRadius: 6,
      },
      {
        label: 'Sales',
        data: ordersAndSalesOverTime.map(item => item.sales) || [],
        backgroundColor: '#D3CEDF',
        borderRadius: 6,
      },
    ],
  };

  const summaryData = {
    totalSales: 24580,
    totalOrders: 485,
    avgOrderValue: 50.68,
    conversionRate: 3.2,
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: isDarkMode ? '#ccc' : '#333',
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        ticks: { color: isDarkMode ? '#ccc' : '#333' },
        grid: {
          color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    // maintainAspectRatio: false, // <-- Add this line
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#ccc' : '#333',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        stacked: false,
        ticks: { color: isDarkMode ? '#ccc' : '#333' },
      },
      y: {
        beginAtZero: true,
        ticks: { color: isDarkMode ? '#ccc' : '#333' },
        grid: {
          color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        },
      },
    },
  };

  const handleRangeChange = (e) => {
    const value = e.target.value;
    setSelectedRange(value);
    if (value === 'Custom Range') {
      setShowCustomRange(true);
    } else {
      setShowCustomRange(false);
      setStartDate('');
      setEndDate('');
    }
  };

  return (
    <div className={`Z_product_section d_sales-report-container ${isDarkMode ? 'd_dark' : 'd_light'}`}>
      <div className="d_header-section mb-4">
        <div>
          <h1 className="d_main-title">Sales Report</h1>
          <p className="d_subtitle mb-0">Overview of your store's performance</p>
        </div>
        <div className="d_date-filter">
          {showCustomRange && (
            <div className="d_custom-range-picker">
              <input
                type="date"
                className={`d_date-input ${isDarkMode ? 'd_dark' : 'd_light'}`}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="d_date-separator">to</span>
              <input
                type="date"
                className={`d_date-input ${isDarkMode ? 'd_dark' : 'd_light'}`}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          )}
          <select
            className={`d_filter-select ${isDarkMode ? 'd_dark' : 'd_light'}`}
            value={selectedRange}
            onChange={handleRangeChange}
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>Custom Range</option>
          </select>

        </div>
      </div>

      {loading ? (
        <div className="d_loading">Loading...</div>
      ) : error ? (
        <div className="d_error">Error: {error}</div>
      ) : (
        <>
          <div className="d_summary-cards">
            <div className="d_summary-card">
              <h4>Total Sales</h4>
              <p>${totalSales}</p>
            </div>
            <div className="d_summary-card">
              <h4>Total Orders</h4>
              <p>{totalOrders}</p>
            </div>
            <div className="d_summary-card">
              <h4>Avg. Order Value</h4>
              <p>${avgOrderValue}</p>
            </div>
            <div className="d_summary-card">
              <h4>Conversion Rate</h4>
              <p>{conversionRate}</p>
            </div>
          </div>

          <div className="row d_chart-section">
            <div className="col-lg-6 col-12">
              <div className="d_chart-container">
                <h3 className="d_chart-title">Sales Over Time</h3>
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </div>
            <div className="col-lg-6 col-12">
              <div className="d_chart-container">
                <h3 className="d_chart-title">Orders vs Sales</h3>
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </div>
          </div>

          <section className='m-0'>
            <div className="Z_table_wrapper">
              <div className="Z_table_header">
                <h4>Recent Orders</h4>
                <div className="Z_table_actions">
                  <select className="Z_time_filter" value={selectedRange} onChange={handleRangeChange}>
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last Quarter</option>
                    <option>Custom Range</option>
                  </select>
                </div>
              </div>
              <div className="Z_table_scroll_container">
                <Table className="Z_product_table p-1">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Total</th>
                      <th>Quantity</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersLoading ? (
                      <tr><td colSpan="6">Loading...</td></tr>
                    ) : ordersError ? (
                      <tr><td colSpan="6">Error: {ordersError}</td></tr>
                    ) : currentOrders.length === 0 ? (
                      <tr><td colSpan="6">No Orders Found</td></tr>
                    ) : (
                      currentOrders.map((order) => (
                        <tr key={order._id}>
                          <td className="Z_order_id">
                            {/* #{indexOfFirstOrder + index + 1} */}
                            {order._id ? `${order._id}` : 'N/A'}
                          </td>
                          <td>
                            {/* ${order.finalAmount.toFixed(2)} */}
                            ${Math.floor(order.finalAmount)}
                          </td>
                          <td className="Z_quantity">
                            {order.items ? order.items.reduce((total, item) => total + item.quantity, 0) : 0}
                          </td>
                          <td>
                            <div className="Z_action_buttons">
                              <button
                                className="Z_action_btn Z_view_btn"
                                onClick={() => handleViewOrder(order._id)}
                              >
                                <TbEye size={22} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
              <div className="Z_pagination d-flex justify-content-end align-items-center mt-4">
                <button
                  className="Z_page_btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <FaAngleLeft />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    className={`Z_page_btn ${currentPage === number ? 'active' : ''}`}
                    onClick={() => setCurrentPage(number)}
                  >
                    {number}
                  </button>
                ))}
                <button
                  className="Z_page_btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <FaAngleRight />
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className='a_main_price'>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className='a_modal_body'>
          {selectedOrder && (
            <div className="order-details">
              <div className="mb-3">
                <h5>Order ID: {selectedOrder._id}</h5>
                <p>Total Amount: ${Math.floor(selectedOrder.finalAmount)}</p>
                <p>Total Items: {selectedOrder.items ? selectedOrder.items.reduce((total, item) => total + item.quantity, 0) : 0}</p>
              </div>
              <div className="order-items">
                <h6>Items:</h6>
                <Table striped bordered hover>
                  <thead>
                    <tr className='a_main_tr'>
                      {/* <th className='a_main_tr'>Product</th> */}
                      <th className='a_main_tr'>Product Name</th>
                      <th className='a_main_tr'>Quantity</th>
                      <th className='a_main_tr'>Price</th>
                      {/* <th className='a_main_tr'>Seller</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items && selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        {/* <td className='a_main_tr'>{item.productId?.name || 'N/A'}</td> */}
                        <td className='a_main_tr'>{item?.productId?.productName}</td>
                        <td className='a_main_tr'>{item?.quantity}</td>
                        <td className='a_main_tr'>${item?.productId?.price}</td>
                        {/* <td className='a_main_tr'>{item.productId?.sellerId?.name || 'N/A'}</td> */}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              {sellerOrders && sellerOrders.length > 0 && (
                <div className="seller-orders mt-4">
                  <h6>Other Orders from this Seller:</h6>
                  <Table striped bordered hover>
                    <thead>
                      <tr className='a_main_tr'>
                        <th className='a_main_tr'>Order ID</th>
                        <th className='a_main_tr'>Total Amount</th>
                        <th className='a_main_tr'>Items</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellerOrders.map((order, index) => (
                        <tr key={index}>
                          <td className='a_main_tr'>{order._id}</td>
                          <td className='a_main_tr'>${Math.floor(order.finalAmount)}</td>
                          <td className='a_main_tr'>{order.items.reduce((total, item) => total + item.quantity, 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
