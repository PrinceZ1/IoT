// WindLineChart.js

import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const WindLineChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" />
        <XAxis
          dataKey="time"
          tick={{ fill: "#ffffff" }}
          tickLine={{ stroke: "#ffffff" }}
        />
        <YAxis
          tick={{ fill: "#ffffff" }}
          tickLine={{ stroke: "#ffffff" }}
          domain={["auto", "auto"]}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "#333", borderColor: "#aaa" }}
          labelStyle={{ color: "#fff" }}
          itemStyle={{ color: "#fff" }}
        />
        <Line
          type="monotone"
          dataKey="wind"
          stroke="#ff7300"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default WindLineChart;
