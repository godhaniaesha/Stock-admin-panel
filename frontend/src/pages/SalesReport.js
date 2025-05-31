import React from 'react';
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
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Table } from 'react-bootstrap';
import { TbEdit, TbEye } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

ChartJS.register(LineElement, BarElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function SalesReport() {
  const { isDarkMode } = useOutletContext();

  const summaryData = {
    totalSales: 24580,
    totalOrders: 485,
    avgOrderValue: 50.68,
    conversionRate: 3.2,
  };

  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sales',
        data: [3000, 3500, 2800, 4200, 5000, 4700, 4600],
        borderColor: '#6A9C89',
        backgroundColor: 'rgba(106, 156, 137, 0.2)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  const barChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Orders',
        data: [45, 50, 42, 60, 72, 68, 70],
        backgroundColor: '#F2B705',
        borderRadius: 6,
      },
      {
        label: 'Sales',
        data: [3000, 3500, 2800, 4200, 5000, 4700, 4600],
        backgroundColor: '#6A9C89',
        borderRadius: 6,
      },
    ],
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
  const subcategories = [
    {
      id: 1,
      categoryName: "Fashion",
      image: "https://i.ibb.co/VpW4x5t/roll-up-t-shirt.png",
      name: "Fashion Men, Women & Kid's",
      description: "All types of fashion clothing for men, women and kids"
    },
    {
      id: 2,
      categoryName: "Accessories",
      image: "https://i.ibb.co/CtqLGfZ/green-bag.png",
      name: "Women Hand Bag",
      description: "Stylish hand bags for women"
    },
    {
      id: 3,
      categoryName: "Accessories",
      image: "https://i.ibb.co/TRw8qzb/black-cap.png",
      name: "Cap and Hat",
      description: "Trendy caps and hats collection"
    },
    {
      id: 4,
      categoryName: "Electronics",
      image: "https://i.ibb.co/9ZXPN8n/headphone.png",
      name: "Electronics Headphone",
      description: "High-quality audio headphones"
    },
    {
      id: 5,
      categoryName: "Footwear",
      image: "https://i.ibb.co/QJfzwXx/shoes.png",
      name: "Foot Wares",
      description: "Comfortable and stylish footwear"
    },
    {
      id: 6,
      categoryName: "Accessories",
      image: "https://i.ibb.co/Lx6zw4v/wallet.png",
      name: "Wallet Categories",
      description: "Premium quality wallets"
    }
  ];

  return (
    <div className={`Z_product_section d_sales-report-container ${isDarkMode ? 'd_dark' : 'd_light'}`}>
      <div className="d_header-section">
        <div>
          <h1 className="d_main-title">Sales Report</h1>
          <p className="d_subtitle">Overview of your store's performance</p>
        </div>
        <div className="d_date-filter">
          <select className={`d_filter-select ${isDarkMode ? 'd_dark' : 'd_light'}`}>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>Custom Range</option>
          </select>
        </div>
      </div>

      <div className="d_summary-cards">
        <div className="d_summary-card">
          <h4>Total Sales</h4>
          <p>${summaryData.totalSales.toLocaleString()}</p>
        </div>
        <div className="d_summary-card">
          <h4>Total Orders</h4>
          <p>{summaryData.totalOrders}</p>
        </div>
        <div className="d_summary-card">
          <h4>Avg. Order Value</h4>
          <p>${summaryData.avgOrderValue}</p>
        </div>
        <div className="d_summary-card">
          <h4>Conversion Rate</h4>
          <p>{summaryData.conversionRate}%</p>
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
      <section className=' m-0'>
<<<<<<< HEAD
        <div className="Z_table_wrapper ">
=======
        <div className="Z_table_wrapper">
>>>>>>> 818acf246a083e8358a82becc48e3fe98e883725
          <div className="Z_table_header">
            <h4>All Subcategory List</h4>
            <div className="Z_table_actions">
              <button className="Z_add_product_btn">Add Subcategory</button>
              <select className="Z_time_filter">
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
              </select>
            </div>
          </div>
          <div className="Z_table_scroll_container">
<<<<<<< HEAD
            <Table className="Z_product_table p-1">
=======
            <Table className="Z_product_table">
>>>>>>> 818acf246a083e8358a82becc48e3fe98e883725
              <thead>
                <tr>
                  <th>
                    <div className="Z_custom_checkbox">
                      <input type="checkbox" id="selectAll" className="Z_checkbox_input" />
                      <label htmlFor="selectAll" className="Z_checkbox_label"></label>
                    </div>
                  </th>
                  <th>Subcategory ID</th>
                  <th>Category Name</th>
                  <th>Subcategory Details</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {subcategories.map((subcategory) => (
                  <tr key={subcategory.id}>
                    <td>
                      <div className="Z_custom_checkbox">
                        <input
                          type="checkbox"
                          id={`checkbox-${subcategory.id}`}
                          className="Z_checkbox_input"
                        />
                        <label
                          htmlFor={`checkbox-${subcategory.id}`}
                          className="Z_checkbox_label"
                        ></label>
                      </div>
                    </td>
                    <td>#{subcategory.id}</td>
                    <td>
                      <div className="Z_category_name_cell">
                        <div className="Z_table_product_name">{subcategory.categoryName}</div>
                      </div>
                    </td>
                    <td>
                      <div className="Z_subcategory_details_cell">
                        <img
                          src={subcategory.image}
                          alt={subcategory.name}
                          className="Z_table_subcategory_img"
                          width={60}
                          height={60}
                        />
                        <div className="Z_table_subcategory_name">{subcategory.name}</div>
                      </div>
                    </td>
                    <td>
                      <div className="Z_category_description_cell">
                        <div className="Z_table_product_description">{subcategory.description}</div>
                      </div>
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
