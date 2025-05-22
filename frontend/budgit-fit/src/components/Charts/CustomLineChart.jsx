import React from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart
} from "recharts";
import "./CustomLineChart.css";


const CustomLineChart = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
       <div className="tooltip-container">
  <p className="tooltip-title">{payload[0].payload.category}</p>
  <p className="tooltip-amount">
    Amount: <span>${payload[0].payload.amount}</span>
  </p>
</div>

      );
    }
    return null;
  };

  return (
    <div className="chart-container">
  <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#875cf5" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#875cf5" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="none" />
          {/* ✅ Fixed: `dateKey` → `dataKey` */}
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
          <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
          <Tooltip />

          {/* ✅ Fixed: stroke color & prop name */}
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#875cf5"
            fill="url(#incomeGradient)"
            strokeWidth={3}
            dot={{ r: 3, fill: "#ab8df8" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;

