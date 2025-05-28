import React from 'react';
import '../styles/admin.css';
import { FaChartLine, FaUsers, FaBoxes, FaShoppingCart } from 'react-icons/fa';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement, 
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement, 
    Title,
    Tooltip,
    Legend
);

const Dashboard = ({ isDarkMode }) => {
    const stats = [
        {
            title: 'Total Sales',
            value: '$24,780',
            increase: '+12.5%',
            icon: <FaChartLine size={24} />,
            color: '#6A9C89'
        },
        {
            title: 'Total Users',
            value: '1,482',
            increase: '+8.2%',
            icon: <FaUsers size={24} />,
            color: '#7C81AD'
        },
        {
            title: 'Total Products',
            value: '384',
            increase: '+5.7%',
            icon: <FaBoxes size={24} />,
            color: '#AF7AB3'
        },
        {
            title: 'Total Orders',
            value: '856',
            increase: '+14.3%',
            icon: <FaShoppingCart size={24} />,
            color: '#E4A5FF'
        }
    ];

    const salesByProductData = {
        labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Others'],
        datasets: [{
            data: [30, 25, 20, 15, 10],
            backgroundColor: [
                '#6A9C89',
                '#7C81AD',
                '#AF7AB3',
                '#E4A5FF',
                '#95B1AF'
            ],
            borderColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.8)',
            borderWidth: 2,
            hoverOffset: 15
        }]
    };
    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: isDarkMode ? '#ccd1d6' : '#282f36',
                    font: {
                        size: 12,
                        weight: 'bold'
                    },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            title: {
                display: true,
                text: 'Sales Distribution',
                color: isDarkMode ? '#ccd1d6' : '#282f36',
                font: {
                    size: 16,
                    weight: 'bold'
                },
                padding: {
                    top: 10,
                    bottom: 20
                }
            },
            tooltip: {
                backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                titleColor: isDarkMode ? '#ffffff' : '#000000',
                bodyColor: isDarkMode ? '#ffffff' : '#000000',
                borderColor: isDarkMode ? '#333333' : '#e5e5e5',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value}%`;
                    }
                }
            }
        },
        cutout: '60%',
        rotation: -90,
        animation: {
            animateRotate: true,
            animateScale: true
        }
    };

    const recentActivities = [
        {
            id: 1,
            action: 'New Order',
            description: 'John Doe placed an order',
            time: '2 minutes ago',
            status: 'success'
        },
        {
            id: 2,
            action: 'Stock Update',
            description: 'Inventory updated for Product X',
            time: '15 minutes ago',
            status: 'info'
        },
        {
            id: 3,
            action: 'Low Stock Alert',
            description: 'Product Y is running low',
            time: '1 hour ago',
            status: 'warning'
        },
        {
            id: 4,
            action: 'New User',
            description: 'Jane Smith registered',
            time: '2 hours ago',
            status: 'success'
        }
    ];


    return (
        <div className="dashboard-container">
            <h2 className="mb-4">Dashboard Overview</h2>

            <div className="row g-4">
                {stats.map((stat, index) => (
                    <div key={index} className="col-12 col-sm-6 col-xl-3">
                        <div
                            className="p-4 rounded-3 shadow-sm"
                            style={{
                                backgroundColor: `var(${isDarkMode ? '--dark-card-bg' : '--light-card-bg'})`,
                                color: `var(${isDarkMode ? '--dark-text' : '--light-text'})`,
                                border: `1px solid var(${isDarkMode ? '--dark-border' : '--light-border'})`
                            }}
                        >
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="mb-2">{stat.title}</h6>
                                    <h3 className="mb-1">{stat.value}</h3>
                                    <span
                                        className="small"
                                        style={{ color: '#6A9C89' }}
                                    >
                                        {stat.increase} this month
                                    </span>
                                </div>
                                <div
                                    className="rounded-circle p-3"
                                    style={{
                                        backgroundColor: `${stat.color}20`,
                                        color: stat.color
                                    }}
                                >
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4 mt-4">
                <div className="col-12 col-lg-4">
                    <div
                        className="p-4 rounded-3 shadow-sm"
                        style={{
                            backgroundColor: `var(${isDarkMode ? '--dark-card-bg' : '--light-card-bg'})`,
                            color: `var(${isDarkMode ? '--dark-text' : '--light-text'})`,
                            border: `1px solid var(${isDarkMode ? '--dark-border' : '--light-border'})`,
                            height: '100%'
                        }}
                    >
                        <h5 className="mb-4">Sales Distribution by Category</h5>
                        <div style={{ height: 'calc(100% - 100px)' }}>
                            <Doughnut data={salesByProductData} options={doughnutOptions} />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4">
                    <div
                        className="p-4 rounded-3 shadow-sm"
                        style={{
                            backgroundColor: `var(${isDarkMode ? '--dark-card-bg' : '--light-card-bg'})`,
                            color: `var(${isDarkMode ? '--dark-text' : '--light-text'})`,
                            border: `1px solid var(${isDarkMode ? '--dark-border' : '--light-border'})`,
                            height: '100%',
                            overflowY: 'auto'
                        }}
                    >
                        <h5 className="mb-4">Recent Activities</h5>
                        <div className="activities-list">
                            {recentActivities.map(activity => (
                                <div
                                    key={activity.id}
                                    className="activity-item d-flex align-items-center mb-3 pb-3 border-bottom"
                                    style={{ borderColor: `var(${isDarkMode ? '--dark-border' : '--light-border'})` }}
                                >
                                    <div className="flex-grow-1">
                                        <h6 className="mb-1">{activity.action}</h6>
                                        <p className="mb-1 small text-muted">{activity.description}</p>
                                        <small style={{ color: '#6A9C89' }}>{activity.time}</small>
                                    </div>
                                    <div className={`badge bg-${activity.status}`}>
                                        {activity.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
