import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Box, Typography, useTheme } from "@mui/material";
import { Header } from "../../components";
import { AirOutlined, WarningAmberOutlined } from "@mui/icons-material";
import { tokens } from "../../theme";
import { keyframes } from "@emotion/react";
import WindLineChart from "../../components/WindLineChart"; // Điều chỉnh đường dẫn nếu cần

// Định nghĩa animation nhấp nháy bằng keyframes
const blinkAnimation = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.1;
  }
`;

const NewTab = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State để lưu dữ liệu cảm biến hiện tại và lịch sử tốc độ gió
  const [sensorData, setSensorData] = useState({
    wind: null,
    warning: false,
  });
  const [windHistory, setWindHistory] = useState(() => {
    const savedHistory = localStorage.getItem("windHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Dùng ref để tránh gọi API liên tục khi chuyển tab
  const hasFetchedData = useRef(false);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const windResponse = await axios.get("http://localhost:8080/sensor/latest");
        const statusResponse = await axios.get("http://localhost:8080/led/status");

        const { wind } = windResponse.data;
        const warningStatus = statusResponse.data.warning;
        const warning = warningStatus === "on";

        setSensorData({ wind, warning });

        // Cập nhật windHistory và lưu vào localStorage chỉ khi có dữ liệu mới
        setWindHistory((prevHistory) => {
          const newHistory = [
            ...prevHistory.slice(-9), // Giữ lại tối đa 10 dữ liệu cuối
            { time: new Date().toLocaleTimeString(), wind },
          ];
          localStorage.setItem("windHistory", JSON.stringify(newHistory));
          return newHistory;
        });
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchSensorData(); // Gọi lần đầu tiên ngay khi component được mount
    const intervalId = setInterval(fetchSensorData, 1000);

    // Xóa interval khi component bị unmount
    return () => clearInterval(intervalId);
  }, []);

  // Hàm để lấy màu sắc dựa trên tốc độ gió
  const getWindSpeedColor = (wind) => {
    if (wind < 20) return "#80deea"; // Xanh nhạt
    if (wind < 40) return "#26c6da"; // Xanh trung bình
    if (wind < 60) return "#00acc1"; // Xanh đậm hơn
    return "#00838f"; // Xanh đậm nhất
  };

  return (
    <Box m="20px">
      <Header title="Dashboard" />

      {/* Main Grid Container */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridTemplateRows="repeat(2, 1fr)"
        gap="20px"
        height="calc(100vh - 100px)" // Điều chỉnh chiều cao để phù hợp với màn hình
      >
        {/* Wind Speed Box */}
        <Box
          gridColumn="span 3"
          gridRow="span 2"
          sx={{
            backgroundColor: colors.primary[400],
            borderRadius: "12px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: 3,
          }}
        >
          <AirOutlined
            sx={{
              color: getWindSpeedColor(sensorData.wind || 0),
              fontSize: "128px",
              marginBottom: "16px",
            }}
          />
          <Typography variant="h2" fontWeight="bold" color={colors.gray[100]}>
            {sensorData.wind !== null ? `${sensorData.wind} km/h` : "Loading..."}
          </Typography>
          <Typography variant="h4" color={colors.gray[100]}>
            Wind Speed
          </Typography>
        </Box>

        {/* Line Chart Box */}
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          sx={{
            backgroundColor: colors.primary[400],
            borderRadius: "12px",
            padding: "24px",
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5" fontWeight="bold" color={colors.gray[100]}>
            Wind Speed Over Time
          </Typography>
          <Box flexGrow={1} mt="20px">
            <WindLineChart data={windHistory} /> {/* Truyền windHistory qua props */}
          </Box>
        </Box>

        {/* Warning Box */}
        <Box
          gridColumn="span 3"
          gridRow="span 2"
          sx={{
            backgroundColor: sensorData.warning ? "#e57373" : colors.primary[400],
            borderRadius: "12px",
            padding: "24px",
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <WarningAmberOutlined
            sx={{
              color: sensorData.warning ? "#ffeb3b" : colors.gray[100],
              fontSize: "128px",
              marginBottom: "16px",
              ...(sensorData.warning && {
                animation: `${blinkAnimation} 1s infinite`,
              }),
            }}
          />
          <Typography variant="h3" color={colors.gray[100]} align="center">
            {sensorData.warning
              ? "Warning: High Wind Speed!"
              : "Wind Speed is Normal"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default NewTab;
