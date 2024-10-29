/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  YAxis,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const LineChartComponent = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:8080/sensor/latest")
        .then((response) => response.json())
        .then((sensorData) => {
          const { temperature, humidity, light, wind } = sensorData;

          setData((prevData) =>
            [
              ...prevData,
              {
                time: new Date().toLocaleTimeString(),
                temperature,
                humidity,
                light,
                wind,
              },
            ].slice(-5)
          );
        })
        .catch((error) => {
          console.error("Error fetching data from API:", error);
        });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const temperaturePayload = payload.find((p) => p.dataKey === "temperature");
      const humidityPayload = payload.find((p) => p.dataKey === "humidity");
      const lightPayload = payload.find((p) => p.dataKey === "light");
      const windPayload = payload.find((p) => p.dataKey === "wind");

      return (
        <div
          style={{
            backgroundColor: colors.primary[500],
            padding: "10px",
            borderRadius: "5px",
            color: "white",
            border: `1px solid ${colors.gray[200]}`,
          }}
        >
          <p style={{ fontWeight: "bold", fontSize: "14px" }}>
            {`Time: ${payload[0].payload.time}`}
          </p>
          <p style={{ color: "#FF6F61", fontSize: "12px" }}>
            {`Temperature: ${
              temperaturePayload ? temperaturePayload.value : "N/A"
            }°C`}
          </p>
          <p style={{ color: "#1E88E5", fontSize: "12px" }}>
            {`Humidity: ${humidityPayload ? humidityPayload.value : "N/A"}%`}
          </p>
          <p style={{ color: "#FFEB3B", fontSize: "12px" }}>
            {`Light: ${lightPayload ? lightPayload.value : "N/A"} Lux`}
          </p>
          <p style={{ color: "#00C49F", fontSize: "12px" }}>
            {`Wind: ${windPayload ? windPayload.value : "N/A"} m/s`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={colors.gray[400]} />
        <XAxis
          dataKey="time"
          tick={{ fill: colors.gray[100], fontSize: 12 }}
        />
        <YAxis
          yAxisId="left"
          domain={[0, 100]}
          tick={{ fill: colors.gray[100], fontSize: 12 }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 1000]}
          tick={{ fill: colors.gray[100], fontSize: 12 }}
        />
        <YAxis
          yAxisId="windAxis"
          orientation="right"
          domain={[0, 100]}
          axisLine={false}
          tickLine={false}
          tick={{ fill: colors.gray[100], fontSize: 12 }}
          label={{
            value: "Wind (m/s)",
            angle: 90,
            position: "insideRight",
            fill: colors.gray[100],
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" align="right" />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="temperature"
          stroke="#FF6F61"
          activeDot={{ r: 8 }}
          dot={{ stroke: "#FF6F61", strokeWidth: 2 }}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="humidity"
          stroke="#1E88E5"
          activeDot={{ r: 8 }}
          dot={{ stroke: "#1E88E5", strokeWidth: 2 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="light"
          stroke="#FFEB3B"
          activeDot={{ r: 8 }}
          dot={{ stroke: "#FFEB3B", strokeWidth: 2 }}
        />
        <Line
          yAxisId="windAxis"
          type="monotone"
          dataKey="wind"
          stroke="#00C49F"
          activeDot={{ r: 8 }}
          dot={{ stroke: "#00C49F", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
