// WindLineChart.js

import React, { useEffect, useState } from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axios from "axios";

const WindLineChart = () => {
  const [windDataHistory, setWindDataHistory] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchWindData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/sensor/latest");
        if (isMounted) {
          const { wind } = response.data;
          setWindDataHistory((prevData) => [
            ...prevData.slice(-10), // Keep only the last 10 entries
            { time: new Date().toLocaleTimeString(), wind },
          ]);
        }
      } catch (error) {
        console.error("Error fetching wind data:", error);
      }
    };

    // Fetch data immediately
    fetchWindData();

    // Set interval to fetch data every 5 seconds
    const intervalId = setInterval(fetchWindData, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={windDataHistory}>
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
