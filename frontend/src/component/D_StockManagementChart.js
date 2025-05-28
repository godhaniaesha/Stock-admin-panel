import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const D_StockManagementChart = ({ theme = "light" }) => {
  const isDark = theme === "dark";

  const d_chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Stock Level",
        data: [120, 150, 100, 180, 90, 140],
        borderColor: "#6A9C89",
        backgroundColor: "transparent",
        tension: 0.4,
      },
    ],
  };

  const d_chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: isDark ? "#ccd1d6" : "#282f36",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDark ? "#dadee2" : "#282f36",
        },
        grid: {
          color: isDark ? "#333" : "#ccc",
        },
      },
      y: {
        ticks: {
          color: isDark ? "#dadee2" : "#282f36",
        },
        grid: {
          color: isDark ? "#333" : "#ccc",
        },
      },
    },
  };

  return (
    <div
      className={`d_container py-4 px-3 min-vh-100 ${
        isDark ? "bg-dark" : "bg-light"
      }`}
      style={{
        backgroundColor: isDark ? "var(--dark-bg)" : "var(--light-bg)",
        color: isDark ? "var(--dark-text)" : "var(--light-text)",
      }}
    >
      <div
        className="d_header mb-4 text-center"
        style={{
          borderBottom: `1px solid ${
            isDark ? "var(--dark-border)" : "var(--light-border)"
          }`,
        }}
      >
        <h2 className="d_title fw-bold">Stock Management Overview</h2>
      </div>

      <div
        className="d_chart_card rounded p-4 mx-auto shadow"
        style={{
          backgroundColor: isDark ? "var(--dark-card-bg)" : "var(--light-card-bg)",
          maxWidth: "900px",
        }}
      >
        <Line data={d_chartData} options={d_chartOptions} />
      </div>
    </div>
  );
};

export default D_StockManagementChart;
