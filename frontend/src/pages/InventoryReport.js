import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext, useNavigate } from 'react-router-dom';
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
  ArcElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { Table } from 'react-bootstrap';
import { TbEdit, TbEye } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaAngleLeft, FaAngleRight, FaCaretDown } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventoryMetrics, fetchProductMovement } from '../redux/slice/sales.slice';
import { fetchInventories, deleteInventory } from '../redux/slice/inventory.Slice';
// import { fetchProductMovement } from '../redux/slice/sales.slice';
import { IMG_URL } from '../utils/baseUrl';

ChartJS.register(LineElement, BarElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, ArcElement);

export default function InventoryReport() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { inventory, isLoading, error } = useSelector((state) => state.inventory);
  const { productMovement } = useSelector((state) => state.report.productMovement);
  const linechart = useSelector((state) => state);
  console.log('Inventory Data:', inventory);

  const { isDarkMode } = useOutletContext();


  const inventoryData = useSelector((state) => state.report.inventory);

  const [selectedRange, setSelectedRange] = useState('Last 7 Days');
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination logic for inventory table
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil((inventory?.length || 0) / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInventory = (inventory || []).slice(indexOfFirstItem, indexOfLastItem);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 1;
    if (totalPages <= maxVisiblePages + 1) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (totalPages > 2) {
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (totalPages === 2) {
        pageNumbers.push(2);
      }
    }
    return pageNumbers;
  };

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

    dispatch(fetchInventoryMetrics({ period, ...params }))
  }, [dispatch, selectedRange, startDate, endDate])

  useEffect(() => {
    dispatch(fetchProductMovement());
  }, [dispatch]);


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

  // const productMovementData = {
  //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  //   datasets: [
  //     {
  //       label: 'Products Added',
  //       data: [150, 180, 120, 200, 250, 230],
  //       borderColor: '#a3c6c4',
  //       backgroundColor: 'rgba(163,198,196,0.2)',
  //       tension: 0.4,
  //       fill: true,
  //       pointRadius: 0,
  //     },
  //     {
  //       label: 'Products Sold',
  //       data: [100, 130, 90, 160, 180, 170],
  //       borderColor: '#D3CEDF',
  //       backgroundColor: 'rgba(218, 182, 209, 0.2)',
  //       tension: 0.4,
  //       fill: true,
  //       pointRadius: 0,
  //     },
  //   ],
  // };

  useEffect(() => {
    dispatch(fetchInventories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProductMovement());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      try {
        await dispatch(deleteInventory(id)).unwrap();
        dispatch(fetchInventories());
      } catch (error) {
        alert('Failed to delete inventory item: ' + error);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const inventorySummaryData = {
    totalProducts: 1250,
    outOfStock: 45,
    lowStock: 120,
    stockValue: 150000,
  };
  console.log(productMovement)
  const productMovementData = {
    labels: productMovement?.labels || [],
    datasets: [
      {
        label: 'Products Added',
        data: productMovement?.datasets?.[0]?.data || [],
        borderColor: '#a3c6c4',
        backgroundColor: 'rgba(163,198,196,0.2)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
      {
        label: 'Products Sold',
        data: productMovement?.datasets?.[1]?.data || [],
        borderColor: '#D3CEDF',
        backgroundColor: 'rgba(218, 182, 209, 0.2)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  // const stockByCategoryData = {
  //   labels: ['Fashion', 'Accessories', 'Electronics', 'Footwear'],
  //   datasets: [
  //     {
  //       label: 'Stock Quantity',
  //       data: [500, 300, 200, 250],
  //       backgroundColor: [
  //         '#A3C6C4',
  //         '#79A3B1',
  //         '#E5E1DA',
  //         '#D3CEDF',
  //       ],
  //       borderColor: isDarkMode ? '#1a1a1a' : '#ffffff',
  //       borderWidth: 2,
  //     },
  //   ],
  // };

  const stockByCategoryData = {
    labels: inventoryData?.StockByCategory?.slice(0, 4)?.map(category => category?.categoryName),
    datasets: [
      {
        label: 'Stock Quantity',
        data: inventoryData?.StockByCategory?.slice(0, 4)?.map(category => category?.count),
        // backgroundColor: inventoryData?.StockByCategory?.slice(0, 4).map(category => category?.backgroundColor),
        backgroundColor: [
          '#A3C6C4',
          '#79A3B1',
          '#E5E1DA',
          '#D3CEDF',
        ],
        borderColor: isDarkMode ? '#1a1a1a' : '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const stockByCategoryOptions = {
    responsive: true,
    maintainAspectRatio: false, // Essential for controlling size
    plugins: {
      legend: {
        position: 'right', // Generally good for pie charts
        labels: {
          color: isDarkMode ? '#E0E0E0' : '#424242',
          font: {
            size: 14,
          },
          usePointStyle: true, // Makes legend markers circular
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed + ' products';
            }
            return label;
          },
        },
      },
    },
    layout: {
      padding: 20, // Add some padding around the chart
    },
    // Added for better responsiveness on smaller screens
    onResize: function (chart, size) {
      if (size.width < 768) { // Adjust legend position for smaller screens
        chart.options.plugins.legend.position = 'bottom';
      } else {
        chart.options.plugins.legend.position = 'right';
      }
      chart.update(); // Update chart to apply new options
    }
  };

  const productMovementOptions = {
    responsive: true,
    maintainAspectRatio: false, // Added for consistency with pie chart
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
        grid: { display: false },
        ticks: {
          color: isDarkMode ? '#ccc' : '#333',
          autoSkip: true, // Allow ticks to be skipped for better readability on smaller screens
          maxRotation: 0, // Keep labels horizontal for cleaner look
          minRotation: 0,
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

  return (
    <div className={`Z_product_section d_sales-report-container ${isDarkMode ? 'd_dark' : 'd_light'}`}>
      <div className="d_header-section">
        <div>
          <h1 className="d_main-title">Inventory Report</h1>
          <p className="d_subtitle">Detailed overview of your product stock</p>
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
          <select className={`d_filter-select ${isDarkMode ? 'd_dark' : 'd_light'}`} value={selectedRange}
            onChange={handleRangeChange}>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>Custom Range</option>
          </select>
        </div>
      </div>

      <div className="d_summary-cards">
        <div className="d_summary-card">
          <h4>Total Products</h4>
          <p>{inventoryData?.TotalProducts || 0}</p>
        </div>
        <div className="d_summary-card">
          <h4>Out of Stock</h4>
          <p>{inventoryData?.TotalOutStock || 0}</p>
        </div>
        <div className="d_summary-card">
          <h4>Low Stock</h4>
          <p>{inventoryData?.TotalLowStock || 0}</p>
        </div>
        <div className="d_summary-card">
          <h4>Total Stock Value</h4>
          <p>${inventoryData?.TotalStockValue || 0}</p>
        </div>
      </div>

      <div className="row d_chart-section">
        <div className="col-lg-6 col-12">
          <div className="d_chart-container">
            <h3 className="d_chart-title">Product Movement</h3>
            <Line data={productMovementData} options={productMovementOptions} />
          </div>
        </div>
        <div className="col-lg-6 col-12">
          <div className="d_chart-container">
            <h3 className="d_chart-title">Stock by Category</h3>
            <Pie data={stockByCategoryData} options={stockByCategoryOptions} />
          </div>
        </div>
      </div>

      <section className='m-0'>
        <div className="Z_table_wrapper">
          <div className="Z_table_header">
            <h4>All Product Inventory</h4>
            <div className="Z_table_actions">
              <button className="Z_add_product_btn" onClick={() => navigate('/stock')}>Add Product</button>
              <div className='Z_select_wrapper'>
                <select className="Z_time_filter">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>Last 3 Months</option>
                </select>
                <div className="Z_select_caret"><FaCaretDown size={20} color='white' /></div>
              </div>
            </div>
          </div>
          <div className="Z_table_scroll_container">
            <Table className="Z_product_table p-1">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Details</th>
                  {/* <th>Category</th> */}
                  <th>Stock</th>
                  <th>Price</th>
                  <th>SKU</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentInventory.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>
                      <div className="Z_subcategory_details_cell">
                        <img
                          src={item.product && item.product.images && item.product.images.length > 0 ? `${IMG_URL}${item.product.images[0]}` : 'https://via.placeholder.com/60'}
                          alt={item.productData?.productName || item.product?.productName || 'Product Image'}
                          className="Z_table_subcategory_img"
                          width={60}
                          height={60}
                          style={{
                            objectFit: 'cover',
                            borderRadius: '4px',
                            border: '1px solid #e0e0e0'
                          }}
                        />
                        <div className="Z_table_subcategory_name">
                          {item.productData?.productName || item.product?.productName || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td>{item.quantity}</td>
                    <td>${item.productData?.price?.toFixed(2) || item.product?.price?.toFixed(2) || '0.00'}</td>
                    <td>{item.productData?.sku || item.product?.sku || 'N/A'}</td>
                    <td>
                      <div className="Z_action_buttons">
                        <button className="Z_action_btn Z_edit_btn" onClick={() => navigate(`/stock/edit/${item._id}`)}>
                          <TbEdit size={22} />
                        </button>
                        <button className="Z_action_btn Z_delete_btn" onClick={() => handleDelete(item._id)}>
                          <RiDeleteBin6Line size={22} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="Z_pagination d-flex justify-content-end align-items-center mt-4">
            <button className="Z_page_btn" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              <FaAngleLeft />
            </button>
            {getPageNumbers().map((number, index) => (
              <button
                key={index}
                className={`Z_page_btn ${currentPage === number ? 'active' : ''} ${typeof number !== 'number' ? 'disabled' : ''}`}
                onClick={() => typeof number === 'number' ? setCurrentPage(number) : null}
                disabled={typeof number !== 'number'}
              >
                {number}
              </button>
            ))}
            <button className="Z_page_btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
              <FaAngleRight />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}