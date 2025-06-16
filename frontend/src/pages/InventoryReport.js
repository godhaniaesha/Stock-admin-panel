import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
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
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventoryMetrics, fetchProductMovement } from '../redux/slice/sales.slice';

ChartJS.register(LineElement, BarElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, ArcElement);

export default function InventoryReport() {
  const { isDarkMode } = useOutletContext();
  const dispatch = useDispatch()

  const inventoryData = useSelector((state) => state.dashboard.inventory);
  const productMovement = useSelector((state) => state.dashboard.productMovement)
  const [selectedRange, setSelectedRange] = useState('Last 7 Days');
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

  const inventorySummaryData = {
    totalProducts: 1250,
    outOfStock: 45,
    lowStock: 120,
    stockValue: 150000,
  };
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

  const products = [
    {
      id: 1,
      name: "Men's T-Shirt",
      category: "Fashion",
      stock: 150,
      price: 25.00,
      sku: "MT-001",
      image: "https://i.ibb.co/VpW4x5t/roll-up-t-shirt.png",
    },
    {
      id: 2,
      name: "Women's Handbag",
      category: "Accessories",
      stock: 75,
      price: 45.00,
      sku: "WHB-002",
      image: "https://i.ibb.co/CtqLGfZ/green-bag.png",
    },
    {
      id: 3,
      name: "Bluetooth Headphones",
      category: "Electronics",
      stock: 30,
      price: 75.00,
      sku: "BTH-003",
      image: "https://i.ibb.co/9ZXPN8n/headphone.png",
    },
    {
      id: 4,
      name: "Running Shoes",
      category: "Footwear",
      stock: 100,
      price: 60.00,
      sku: "RNS-004",
      image: "https://i.ibb.co/QJfzwXx/shoes.png",
    },
    {
      id: 5,
      name: "Leather Wallet",
      category: "Accessories",
      stock: 50,
      price: 35.00,
      sku: "LWL-005",
      image: "https://i.ibb.co/Lx6zw4v/wallet.png",
    },
    {
      id: 6,
      name: "Baseball Cap",
      category: "Accessories",
      stock: 90,
      price: 20.00,
      sku: "BSC-006",
      image: "https://i.ibb.co/TRw8qzb/black-cap.png",
    },
  ];

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
          <p>{inventoryData?.TotalProducts}</p>
        </div>
        <div className="d_summary-card">
          <h4>Out of Stock</h4>
          <p>{inventoryData.TotalOutStock}</p>
        </div>
        <div className="d_summary-card">
          <h4>Low Stock</h4>
          <p>{inventoryData.TotalLowStock}</p>
        </div>
        <div className="d_summary-card">
          <h4>Total Stock Value</h4>
          <p>${inventoryData.TotalStockValue}</p>
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
              <button className="Z_add_product_btn">Add Product</button>
              <select className="Z_time_filter">
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
              </select>
            </div>
          </div>
          <div className="Z_table_scroll_container">
            <Table className="Z_product_table p-1">
              <thead>
                <tr>
                  <th>
                    <div className="Z_custom_checkbox">
                      <input type="checkbox" id="selectAll" className="Z_checkbox_input" />
                      <label htmlFor="selectAll" className="Z_checkbox_label"></label>
                    </div>
                  </th>
                  <th>Product ID</th>
                  <th>Product Details</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>SKU</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="Z_custom_checkbox">
                        <input
                          type="checkbox"
                          id={`checkbox-${product.id}`}
                          className="Z_checkbox_input"
                        />
                        <label
                          htmlFor={`checkbox-${product.id}`}
                          className="Z_checkbox_label"
                        ></label>
                      </div>
                    </td>
                    <td>#{product.id}</td>
                    <td>
                      <div className="Z_subcategory_details_cell">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="Z_table_subcategory_img"
                          width={60}
                          height={60}
                        />
                        <div className="Z_table_subcategory_name">{product.name}</div>
                      </div>
                    </td>
                    <td>
                      <div className="Z_category_name_cell">
                        <div className="Z_table_product_name">{product.category}</div>
                      </div>
                    </td>
                    <td>{product.stock}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.sku}</td>
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
            </Table>
          </div>
          <div className="Z_pagination d-flex justify-content-end align-items-center mt-4">
            <button className="Z_page_btn" disabled>
              <FaAngleLeft />
            </button>
            <button className="Z_page_btn active">1</button>
            <button className="Z_page_btn">2</button>
            <button className="Z_page_btn">3</button>
            <button className="Z_page_btn">
              <FaAngleRight />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}