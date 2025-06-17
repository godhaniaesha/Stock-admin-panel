import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import {
    Bell,
    Search,
    TrendingUp,
    Users,
    DollarSign,
    ShoppingCart,
    Calendar,
    Activity,
    ArrowUp,
    ArrowDown,
    MoreVertical,
    Plus,
    Filter,
    Settings,
    Download,
    Star,
    MessageSquare,
    Globe,
    Zap,
    Target,
    Award,
    Eye,
    Heart,
    Share2,
    RefreshCw,
    BarChart3,
    PieChart as PieChartIcon,
    TrendingDown,
    Mail,
    Phone,
    MapPin,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    Sparkles
} from 'lucide-react';
import { PiHandWavingDuotone } from "react-icons/pi";
import { FaDesktop, FaMobileAlt, FaShoppingBag, FaTabletAlt } from 'react-icons/fa';
import { MdShoppingCart, MdPerson, MdRateReview, MdEmail } from 'react-icons/md';
import { GiTargetDummy } from 'react-icons/gi';
import { IoMdFlash } from 'react-icons/io';
import { BsStars } from 'react-icons/bs';
import { FaUserTie, FaUserCog, FaUserNinja, FaUserCheck } from 'react-icons/fa';
import { MdMeetingRoom, MdLaunch, MdCall } from 'react-icons/md';
import './Dashboard.css';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { BiRightArrow } from 'react-icons/bi';
import { getAxios } from '../utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { Sales_Performance,getHeaderdata,getAllSellerOrder } from '../redux/slice/dashboard.slice';


const Dashboard = () => {
    const dispatch = useDispatch();
    const naviget = useNavigate();
    const { isDarkMode } = useOutletContext();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [notifications, setNotifications] = useState(5);
    const [activeChart, setActiveChart] = useState('line');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('7d');
    const [dashboardData, setDashboardData] = useState({
        userRevenue: 0,
        overallRevenue: 0
    });

    const userName = localStorage.getItem('userName')

    const [categoryWiseProducts , setCategoryWiseProducts] = useState([]);

    const {sellingRate,ConfirmOrder,categoryStats,lowStockProducts,salesPerformance,sellerOrders,totalOrders,totalProducts,totalUsers,userRevenue} = useSelector(state => state.dashboard.dashboardHeader)

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
      dispatch(getHeaderdata());
  }, []);

  useEffect(() => {
    if (categoryStats && categoryStats.length > 0) {
        const colors = ['var(--accent-color)', '#8BBEA8', '#A8D5BA', '#FFB6C1']; 
        const icons = [<FaDesktop />, <FaMobileAlt />, <FaTabletAlt />, <FaShoppingBag />]; 

        const transformedData = categoryStats.map((category, index) => ({
            name: category.categoryName,
            image:category.image,
            value: parseFloat(category.salesPercentage),
            color: colors[index % colors.length], 
            icon: icons[index % icons.length] 
        }));

        setCategoryWiseProducts(transformedData);
    }
}, [categoryStats]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return <CheckCircle size={16} className="text-success" />;
            case 'pending': return <AlertCircle size={16} className="text-warning" />;
            case 'cancelled': return <XCircle size={16} className="text-danger" />;
            default: return <Clock size={16} className="opacity-50" />;
        }
    };

    return (
      <div
        className={`d_dashboard w-100 ${
          isDarkMode ? "d_theme-dark" : "d_theme-light"
        }`}
      >
        <div className="container-fluid px-md-4  py-md-4 p-1">
          {/* Time & Welcome Section */}
          <div className="row mb-md-4 mb-2">
            <div className="col-12">
              <div className="d_card d_gradient-bg ">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h2 className="fw-bold mb-2">
                      Good{" "}
                      {currentTime.getHours() < 12
                        ? "Morning"
                        : currentTime.getHours() < 18
                        ? "Afternoon"
                        : "Evening"}
                      ! <PiHandWavingDuotone></PiHandWavingDuotone>{" "}
                    </h2>
                    <p className="mb-md-3 mb-2 opacity-90">
                      Welcome, {userName}! Here's a summary of your business activities today.
                    </p>
                    {/* <div className="d-flex gap-2">
                      <button className="btn btn-light btn-sm">
                        <Calendar size={16} className="me-1" />
                        View Schedule
                      </button>
                      <button className="btn btn-outline-light btn-sm">
                        <Download size={16} className="me-1" />
                        Export Data
                      </button>
                    </div> */}
                  </div>
                  <div className="col-md-4 text-end d-none d-md-block">
                    <div className="fs-1 fw-bold opacity-75">
                      {currentTime.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="row g-4 mb-md-4 mb-2">
            <div className="col-xl-3 col-md-6">
              <div className="d_stat-card">
                <div className="d-flex justify-content-between align-items-start mb-mb-3 mb-2">
                  <div className="d_icon-wrapper">
                    <DollarSign size={24} />
                  </div>
                </div>
                <h3 className="h4 fw-bold mb-1">${userRevenue}</h3>
                <p className="mb-2 opacity-75">Total Revenue</p>
                {/* <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-1">
                    <ArrowUp size={16} className="d_metric-positive" />
                    <span className="d_metric-positive fw-medium">+12.5%</span>
                  </div>
                  <div className="d_progress-bar" style={{ width: "60px" }}>
                    <div
                      className="d_progress-fill"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div> */}
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="d_stat-card">
                <div className="d-flex justify-content-between align-items-start mb-md-3 mb-2">
                  <div className="d_icon-wrapper">
                    <Users size={24} />
                  </div>
                </div>
                <h3 className="h4 fw-bold mb-1">{totalProducts}</h3>
                <p className="mb-2 opacity-75">Total Products</p>
                {/* <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-1">
                    <ArrowUp size={16} className="d_metric-positive" />
                    <span className="d_metric-positive fw-medium">+8.2%</span>
                  </div>
                  <div className="d_progress-bar" style={{ width: "60px" }}>
                    <div
                      className="d_progress-fill"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                </div> */}
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="d_stat-card">
                <div className="d-flex justify-content-between align-items-start mb-md-3 mb-2">
                  <div className="d_icon-wrapper">
                    <ShoppingCart size={24} />
                  </div>
                </div>
                <h3 className="h4 fw-bold mb-1">{ConfirmOrder}</h3>
                <p className="mb-2 opacity-75">Confirm Order</p>
                {/* <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-1">
                    <ArrowDown size={16} className="d_metric-negative" />
                    <span className="d_metric-negative fw-medium">-3.1%</span>
                  </div>
                  <div className="d_progress-bar" style={{ width: "60px" }}>
                    <div
                      className="d_progress-fill"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div> */}
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="d_stat-card">
                <div className="d-flex justify-content-between align-items-start mb-md-3 mb-2">
                  <div className="d_icon-wrapper">
                    <TrendingUp size={24} />
                  </div>
                </div>
                <h3 className="h4 fw-bold mb-1">{sellingRate} %</h3>
                {/* // total stock quantity compare to total sold quantity */}
                <p className="mb-2 opacity-75">Selling rate</p>
                {/* <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-1">
                    <ArrowUp size={16} className="d_metric-positive" />
                    <span className="d_metric-positive fw-medium">+5.7%</span>
                  </div>
                  <div className="d_progress-bar" style={{ width: "60px" }}>
                    <div
                      className="d_progress-fill"
                      style={{ width: "94%" }}
                    ></div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          {/* Enhanced Charts Section */}
          <div className="row g-4 mb-md-4 mb-2">
            <div className="col-lg-8">
              <div className="d_card" style={{ height: "100%" }}>
                <div className="d-flex justify-content-between align-items-center mb-md-4 mb-2">
                  <div>
                    <h5 className="fw-bold mb-0">Analytics Overview</h5>
                    <p className="mb-0 opacity-75 small">
                      Sales performance over time
                    </p>
                  </div>
                  <div className="d-flex gap-2">
                    <div className="btn-group gap-2">
                      <button
                        className={`d_btn-ghost btn-sm ${
                          selectedPeriod === "7d" ? "d_btn-primary" : ""
                        }`}
                        onClick={() => setSelectedPeriod("7d")}
                        style={{ color: isDarkMode ? "#fff" : "inherit" }}
                      >
                        7D
                      </button>
                      <button
                        className={`d_btn-ghost btn-sm ${
                          selectedPeriod === "30d" ? "d_btn-primary" : ""
                        }`}
                        onClick={() => setSelectedPeriod("30d")}
                        style={{ color: isDarkMode ? "#fff" : "inherit" }}
                      >
                        30D
                      </button>
                    </div>
                    {/* <button
                      className="d_btn-ghost btn-sm"
                      style={{ color: isDarkMode ? "#fff" : "inherit" }}
                    >
                      <Download size={16} />
                    </button> */}
                  </div>
                </div>
                <div
                  style={{
                    flex: 1,
                    height: "100%",
                    minHeight: "400px",
                    maxHeight: "calc(100vh - 500px)",
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesPerformance?.[selectedPeriod]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--accent-color)"
                        opacity={0.1}
                      />
                      <XAxis
                        dataKey="name"
                        stroke="var(--accent-color)"
                        tick={{ fill: "var(--accent-color)" }}
                        axisLine={{
                          stroke: "var(--accent-color)",
                          opacity: 0.2,
                        }}
                      />
                      <YAxis
                        stroke="var(--accent-color)"
                        tick={{ fill: "var(--accent-color)" }}
                        axisLine={{
                          stroke: "var(--accent-color)",
                          opacity: 0.2,
                        }}
                      />
                      <Tooltip
                        cursor={{
                          fill: isDarkMode
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.05)",
                        }}
                        contentStyle={{
                          background: isDarkMode
                            ? "var(--dark-card-bg)"
                            : "var(--light-card-bg)",
                          border: "none",
                          borderRadius: "8px",
                          boxShadow: isDarkMode
                            ? "0 8px 25px rgba(0,0,0,0.2)"
                            : "0 8px 25px rgba(0,0,0,0.1)",
                          color: isDarkMode ? "#fff" : "#333",
                          padding: "12px",
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill="var(--accent-color)"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={50}
                      />
                      <Bar
                        dataKey="orders"
                        fill="#8BBEA8"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={50}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Chart Legend */}
                <div className="d-flex justify-content-center gap-4 mt-md-3 mt-2">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: "var(--accent-color)",
                      }}
                    ></div>
                    <span className="small">Revenue</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <div
                      style={{
                        width: "12px",
                        height: "2px",
                        background: "#8BBEA8",
                      }}
                    ></div>
                    <span className="small">Orders</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="d_card" style={{ height: "100%" }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 className="fw-bold mb-0">Category Wise Products</h5>
                    <p className="mb-0 opacity-75 small">
                      Product Distribution by Category
                    </p>
                  </div>
                  {/* <button className="d_btn-ghost btn-sm">
                    <PieChartIcon size={16} />
                  </button> */}
                </div>
                <div style={{ height: "280px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryWiseProducts}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryWiseProducts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: isDarkMode
                            ? "var(--dark-card-bg)"
                            : "var(--light-card-bg)",
                          color: isDarkMode
                            ? "var(--dark-text)"
                            : "var(--light-text)",
                          border: `1px solid var(--${
                            isDarkMode ? "dark" : "light"
                          }-border)`,
                          borderRadius: "5px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div
                  className="mt-3 overflow-y-scroll"
                  style={{
                    height: "250px",
                    maxHeight: "250px",
                  }}
                >
                  {categoryWiseProducts.map((item, index) => (
                    <div
                      key={index}
                      className="d-flex justify-content-between align-items-center mb-3 p-2 rounded"
                      style={{ background: `${item.color}15` }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <span style={{ fontSize: "20px" }}>
                          {" "}
                          <img
                            src={
                              item?.image
                                ? `http://localhost:2221/${item?.image}`
                                : "placeholder.jpg"
                            }
                            // alt={item?.name}
                            className="Z_table_product_img"
                            style={{maxWidth: "50px"}}
                          />
                        </span>
                        <div>
                          <div className="fw-medium">{item.name}</div>
                          <div className="small opacity-75">
                            {item.value}% of traffic
                          </div>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold" style={{ color: item.color }}>
                          {item.value}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Activities & Events Section */}
          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <div className="d_card">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 className="fw-bold mb-0">Recent Order</h5>
                    <p className="mb-0 opacity-75 small">
                      Latest Orders and Transactions
                    </p>
                  </div>
                  <div className="d-flex gap-2">
                    {/* <button className="d_btn-ghost btn-sm">
                      <Filter size={16} />
                    </button> */}
                    <button
                      className="d_btn-primary btn-sm"
                      onClick={() => {
                        naviget("/orders");
                      }}
                    >
                      <Eye size={16} className="me-1" />
                      View All
                    </button>
                  </div>
                </div>
                <div>
                  {sellerOrders?.slice(0, 5)?.map((activity) => (
                    <div key={activity._id} className="d_activity-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex gap-3">
                          <div
                            className="d-flex align-items-center justify-content-center"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              background: "var(--accent-color)",
                              color: "white",
                              fontSize: "16px",
                              flexShrink: 0,
                            }}
                          >
                            {/* {activity.type === "purchase" ? ( */}
                            <MdShoppingCart />
                            {/* ) : activity.type === "profile" ? (
                              <MdPerson />
                            ) : activity.type === "review" ? (
                              <MdRateReview />
                            ) : (
                              <MdEmail />
                            )} */}
                          </div>
                          <div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <h6 className="fw-medium mb-0">
                                {activity?.orderDetails?.firstName}{" "}
                                {activity?.orderDetails?.lastName}
                              </h6>
                              {getStatusIcon(activity?.orderDetails?.status)}
                            </div>
                            <p className="mb-1 opacity-75">Made as Perches</p>
                            <div className="d-flex align-items-center gap-3">
                              <span className="small opacity-75 d-flex align-items-center gap-1">
                                <Clock size={12} />
                                {new Date(activity?.orderDetails?.createdAt) ===
                                new Date()
                                  ? "Today"
                                  : new Date(
                                      activity?.orderDetails?.createdAt
                                    ) ===
                                    new Date(
                                      new Date().setDate(
                                        new Date().getDate() - 1
                                      )
                                    )
                                  ? "1 day ago"
                                  : new Date(
                                      activity?.orderDetails?.createdAt
                                    ) ===
                                    new Date(
                                      new Date().setDate(
                                        new Date().getDate() - 2
                                      )
                                    )
                                  ? "2 days ago"
                                  : new Date(
                                      activity?.orderDetails?.createdAt
                                    ).toLocaleDateString("en-US", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "2-digit",
                                    })}
                              </span>
                              {activity?.sellerTotalAfterDiscount && (
                                <span
                                  className="badge"
                                  style={{
                                    background: "var(--accent-color)",
                                    color: "white",
                                  }}
                                >
                                  {(activity?.sellerTotalAfterDiscount).toFixed(
                                    2
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* <div className="d-flex gap-1">
                          <button className="d_btn-ghost btn-sm">
                            <Heart size={14} />
                          </button>
                          <button className="d_btn-ghost btn-sm">
                            <Share2 size={14} />
                          </button>
                        </div> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="d_card mb-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 className="fw-bold mb-0">Low stocks</h5>
                    <p className="mb-0 opacity-75 small">
                      Items running low in inventory
                    </p>
                  </div>
                  {/* <button className="d_btn-ghost btn-sm">
                    <Calendar size={16} />
                  </button> */}
                </div>
                <div
                  style={{
                    height: "575px",
                    maxHeight: "575px",
                    // display: "flex",
                    // justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {lowStockProducts?.length > 0 ? (
                    lowStockProducts.map((event) => (
                      <div
                        key={event._id}
                        className="d-flex align-items-center gap-3 mb-3 p-3 rounded w-100"
                        style={{
                          background: `var(--${
                            isDarkMode ? "dark" : "light"
                          }-border)`,
                        }}
                      >
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "10px",
                            background:
                              event.type === "meeting"
                                ? "var(--accent-color)"
                                : event.type === "launch"
                                ? "#8BBEA8"
                                : "#A8D5BA",
                            color: "white",
                          }}
                        >
                          {/* <img src={event.productImage} /> */}
                          <img
                            src={
                              event?.productImage
                                ? `http://localhost:2221/${event?.productImage[0]}`
                                : "placeholder.jpg"
                            }
                            alt={event?.productName}
                            className="Z_table_product_img"
                          />
                          {/* {event.type === "meeting" ? (
                            <MdMeetingRoom />
                          ) : event.type === "launch" ? (
                            <MdLaunch />
                          ) : (
                            <MdCall />
                          )} */}
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-medium">{event?.productName}</div>
                          <div className="small opacity-75">
                            {/* {event.date} at {event.time} */}
                            Quantity : {event?.currentStock}
                          </div>
                        </div>
                        {/* <button className="d_btn-ghost btn-sm">
                          <ArrowUp
                            size={14}
                            style={{ transform: "rotate(45deg)" }}
                          />
                        </button> */}
                      </div>
                    ))
                  ) : (
                    <div className="text-center">
                      <p>No low stock products to show.</p>
                    </div>
                  )}
                </div>
                <button
                  className="d_btn-primary w-100 mt-2"
                  onClick={() => {
                    naviget("/stock/alerts");
                  }}
                >
                  <BiRightArrow size={16} className="me-1" />
                  View All
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          className="d_floating-action"
          style={{
            display: window.scrollY > 0 ? "block" : "none",
            transform: "rotate(0deg)",
          }}
          onClick={() => window.scrollTo(0, 0)}
        >
          <ArrowUp size={24} />
        </button>
      </div>
    );
};

export default Dashboard;