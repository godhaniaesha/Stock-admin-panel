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
import { FaDesktop, FaMobileAlt, FaTabletAlt } from 'react-icons/fa';
import { MdShoppingCart, MdPerson, MdRateReview, MdEmail } from 'react-icons/md';
import { GiTargetDummy } from 'react-icons/gi';
import { IoMdFlash } from 'react-icons/io';
import { BsStars } from 'react-icons/bs';
import { FaUserTie, FaUserCog, FaUserNinja, FaUserCheck } from 'react-icons/fa';
import { MdMeetingRoom, MdLaunch, MdCall } from 'react-icons/md';
import './Dashboard.css';
import { useOutletContext } from 'react-router-dom';


const Dashboard = () => {
    const { isDarkMode } = useOutletContext();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [notifications, setNotifications] = useState(5);
    const [activeChart, setActiveChart] = useState('line');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('7d');

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const salesData = {
        '7d': [
            { name: 'Mon', value: 4000, orders: 120, users: 450 },
            { name: 'Tue', value: 3000, orders: 98, users: 380 },
            { name: 'Wed', value: 5000, orders: 150, users: 520 },
            { name: 'Thu', value: 2780, orders: 89, users: 310 },
            { name: 'Fri', value: 1890, orders: 67, users: 280 },
            { name: 'Sat', value: 2390, orders: 78, users: 340 },
            { name: 'Sun', value: 3490, orders: 110, users: 420 }
        ],
        '30d': [
            { name: 'Week 1', value: 24000, orders: 580, users: 2100 },
            { name: 'Week 2', value: 18000, orders: 420, users: 1800 },
            { name: 'Week 3', value: 32000, orders: 720, users: 2400 },
            { name: 'Week 4', value: 28000, orders: 650, users: 2200 }
        ]
    };

    const pieData = [
        { name: 'Desktop', value: 45, color: 'var(--accent-color)', icon: <FaDesktop /> },
        { name: 'Mobile', value: 35, color: '#8BBEA8', icon: <FaMobileAlt /> },
        { name: 'Tablet', value: 20, color: '#A8D5BA', icon: <FaTabletAlt /> },
    ];

    const recentActivities = [
        { id: 1, user: 'John Doe', action: 'Made a purchase', time: '2 hours ago', amount: '$234.50', type: 'purchase', status: 'completed', icon: <MdShoppingCart /> },
        { id: 2, user: 'Sarah Wilson', action: 'Updated profile', time: '4 hours ago', amount: null, type: 'profile', status: 'completed', icon: <MdPerson /> },
        { id: 3, user: 'Mike Johnson', action: 'Left a review', time: '6 hours ago', amount: null, type: 'review', status: 'pending', icon: <MdRateReview /> },
        { id: 4, user: 'Emma Davis', action: 'Made a purchase', time: '8 hours ago', amount: '$89.99', type: 'purchase', status: 'completed', icon: <MdShoppingCart /> },
        { id: 5, user: 'Alex Chen', action: 'Subscribed to newsletter', time: '12 hours ago', amount: null, type: 'subscribe', status: 'completed', icon: <MdEmail /> },
    ];

    const topProducts = [
        { id: 1, name: 'Premium Widget', sales: 245, revenue: '$12,450', trend: '+15%', image: <GiTargetDummy /> },
        { id: 2, name: 'Smart Device', sales: 189, revenue: '$9,870', trend: '+8%', image: <IoMdFlash /> },
        { id: 3, name: 'Digital Service', sales: 156, revenue: '$7,800', trend: '-3%', image: <BsStars /> },
    ];

    const teamMembers = [
        { id: 1, name: 'Alice Johnson', role: 'Product Manager', status: 'online', avatar: <FaUserTie /> },
        { id: 2, name: 'Bob Smith', role: 'Developer', status: 'away', avatar: <FaUserCog /> },
        { id: 3, name: 'Carol White', role: 'Designer', status: 'online', avatar: <FaUserNinja /> },
        { id: 4, name: 'David Brown', role: 'Marketing', status: 'offline', avatar: <FaUserCheck /> },
    ];

    const upcomingEvents = [
        { id: 1, title: 'Team Meeting', time: '10:00 AM', date: 'Today', type: 'meeting', icon: <MdMeetingRoom /> },
        { id: 2, title: 'Product Launch', time: '2:00 PM', date: 'Tomorrow', type: 'launch', icon: <MdLaunch /> },
        { id: 3, title: 'Client Call', time: '4:30 PM', date: 'Today', type: 'call', icon: <MdCall /> },
    ];
    const toggleTheme = () => {
        // This function should be handled by the parent component
        // Remove this function if not needed
    };

    const refreshData = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1500);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle size={16} className="text-success" />;
            case 'pending': return <AlertCircle size={16} className="text-warning" />;
            case 'failed': return <XCircle size={16} className="text-danger" />;
            default: return <Clock size={16} className="opacity-50" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'online': return '#4ade80';
            case 'away': return '#fbbf24';
            case 'offline': return '#6b7280';
            default: return '#6b7280';
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
                      Here's what's happening with your business today. You have
                      3 meetings scheduled and 12 pending tasks.
                    </p>
                    <div className="d-flex gap-2">
                      <button className="btn btn-light btn-sm">
                        <Calendar size={16} className="me-1" />
                        View Schedule
                      </button>
                      <button className="btn btn-outline-light btn-sm">
                        <Download size={16} className="me-1" />
                        Export Data
                      </button>
                    </div>
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
                <h3 className="h4 fw-bold mb-1">$24,780</h3>
                <p className="mb-2 opacity-75">Total Revenue</p>
                <div className="d-flex align-items-center justify-content-between">
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
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="d_stat-card">
                <div className="d-flex justify-content-between align-items-start mb-md-3 mb-2">
                  <div className="d_icon-wrapper">
                    <Users size={24} />
                  </div>
                  
                </div>
                <h3 className="h4 fw-bold mb-1">1,429</h3>
                <p className="mb-2 opacity-75">Active Users</p>
                <div className="d-flex align-items-center justify-content-between">
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
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="d_stat-card">
                <div className="d-flex justify-content-between align-items-start mb-md-3 mb-2">
                  <div className="d_icon-wrapper">
                    <ShoppingCart size={24} />
                  </div>
                  
                </div>
                <h3 className="h4 fw-bold mb-1">856</h3>
                <p className="mb-2 opacity-75">Orders</p>
                <div className="d-flex align-items-center justify-content-between">
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
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="d_stat-card">
                <div className="d-flex justify-content-between align-items-start mb-md-3 mb-2">
                  <div className="d_icon-wrapper">
                    <TrendingUp size={24} />
                  </div>
                  
                </div>
                <h3 className="h4 fw-bold mb-1">94.2%</h3>
                <p className="mb-2 opacity-75">Conversion Rate</p>
                <div className="d-flex align-items-center justify-content-between">
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
                </div>
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
                    <div className="btn-group">
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
                    <button
                      className="d_btn-ghost btn-sm"
                      style={{ color: isDarkMode ? "#fff" : "inherit" }}
                    >
                      <Download size={16} />
                    </button>
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
                      data={salesData[selectedPeriod]}
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
                    <h5 className="fw-bold mb-0">Traffic Sources</h5>
                    <p className="mb-0 opacity-75 small">
                      Where your visitors come from
                    </p>
                  </div>
                  <button className="d_btn-ghost btn-sm">
                    <PieChartIcon size={16} />
                  </button>
                </div>
                <div style={{ height: "280px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: isDarkMode
                            ? "var(--dark-card-bg)"
                            : "var(--light-card-bg)",
                          border: `1px solid var(--${
                            isDarkMode ? "dark" : "light"
                          }-border)`,
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3">
                  {pieData.map((item, index) => (
                    <div
                      key={index}
                      className="d-flex justify-content-between align-items-center mb-3 p-2 rounded"
                      style={{ background: `${item.color}15` }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <span style={{ fontSize: "20px" }}>{item.icon}</span>
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
                    <h5 className="fw-bold mb-0">Recent Activities</h5>
                    <p className="mb-0 opacity-75 small">
                      Latest user interactions and system events
                    </p>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="d_btn-ghost btn-sm">
                      <Filter size={16} />
                    </button>
                    <button className="d_btn-primary btn-sm">
                      <Eye size={16} className="me-1" />
                      View All
                    </button>
                  </div>
                </div>
                <div>
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="d_activity-item">
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
                            {activity.type === "purchase" ? (
                              <MdShoppingCart />
                            ) : activity.type === "profile" ? (
                              <MdPerson />
                            ) : activity.type === "review" ? (
                              <MdRateReview />
                            ) : (
                              <MdEmail />
                            )}
                          </div>
                          <div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <h6 className="fw-medium mb-0">
                                {activity.user}
                              </h6>
                              {getStatusIcon(activity.status)}
                            </div>
                            <p className="mb-1 opacity-75">{activity.action}</p>
                            <div className="d-flex align-items-center gap-3">
                              <span className="small opacity-75 d-flex align-items-center gap-1">
                                <Clock size={12} />
                                {activity.time}
                              </span>
                              {activity.amount && (
                                <span
                                  className="badge"
                                  style={{
                                    background: "var(--accent-color)",
                                    color: "white",
                                  }}
                                >
                                  {activity.amount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex gap-1">
                          <button className="d_btn-ghost btn-sm">
                            <Heart size={14} />
                          </button>
                          <button className="d_btn-ghost btn-sm">
                            <Share2 size={14} />
                          </button>
                        </div>
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
                    <h5 className="fw-bold mb-0">Upcoming Events</h5>
                    <p className="mb-0 opacity-75 small">
                      Your schedule for today
                    </p>
                  </div>
                  <button className="d_btn-ghost btn-sm">
                    <Calendar size={16} />
                  </button>
                </div>
                <div>
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="d-flex align-items-center gap-3 mb-3 p-3 rounded"
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
                        {event.type === "meeting" ? (
                          <MdMeetingRoom />
                        ) : event.type === "launch" ? (
                          <MdLaunch />
                        ) : (
                          <MdCall />
                        )}
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-medium">{event.title}</div>
                        <div className="small opacity-75">
                          {event.date} at {event.time}
                        </div>
                      </div>
                      <button className="d_btn-ghost btn-sm">
                        <ArrowUp
                          size={14}
                          style={{ transform: "rotate(45deg)" }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
                <button className="d_btn-primary w-100 mt-2">
                  <Plus size={16} className="me-1" />
                  Add Event
                </button>
              </div>

              {/* Quick Stats Mini Cards */}
              <div className="row g-3">
                <div className="col-6">
                  <div className="d_card text-center p-3">
                    <Globe
                      size={24}
                      className="mx-auto mb-2"
                      style={{ color: "var(--accent-color)" }}
                    />
                    <div className="fw-bold">23</div>
                    <div className="small opacity-75">Countries</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d_card text-center p-3">
                    <Zap
                      size={24}
                      className="mx-auto mb-2"
                      style={{ color: "var(--accent-color)" }}
                    />
                    <div className="fw-bold">98.9%</div>
                    <div className="small opacity-75">Uptime</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d_card text-center p-3">
                    <Target
                      size={24}
                      className="mx-auto mb-2"
                      style={{ color: "var(--accent-color)" }}
                    />
                    <div className="fw-bold">847</div>
                    <div className="small opacity-75">Goals</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d_card text-center p-3">
                    <Star
                      size={24}
                      className="mx-auto mb-2"
                      style={{ color: "var(--accent-color)" }}
                    />
                    <div className="fw-bold">4.9</div>
                    <div className="small opacity-75">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          className="d_floating-action"
          onClick={() => setNotifications(0)}
        >
          <Plus size={24} />
        </button>
      </div>
    );
};

export default Dashboard;