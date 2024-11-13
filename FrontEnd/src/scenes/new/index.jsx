import React, { useEffect, useState } from "react";
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

  // State để lưu dữ liệu cảm biến
  const [sensorData, setSensorData] = useState({
    wind: null,
    warning: false,
  });

  // Fetch dữ liệu cảm biến
  useEffect(() => {
    let isMounted = true;

    const fetchSensorData = async () => {
      try {
        // Gọi API để lấy dữ liệu wind
        const windResponse = await axios.get("http://localhost:8080/sensor/latest");

        // Gọi API để lấy trạng thái warning từ backend
        const statusResponse = await axios.get("http://localhost:8080/led/status");

        if (isMounted) {
          const { wind } = windResponse.data;

          // Lấy trạng thái warning từ statusResponse
          const warningStatus = statusResponse.data.warning;

          // Chuyển đổi warningStatus thành boolean
          const warning = warningStatus === "on";

          setSensorData({ wind, warning });
        }
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchSensorData();
    const intervalId = setInterval(fetchSensorData, 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
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
            <WindLineChart />
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
              // Áp dụng animation nhấp nháy khi warning hoạt động
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
