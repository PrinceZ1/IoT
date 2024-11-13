import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { Header, LineChart } from "../../components";
import {
  WbSunnyOutlined,
  WaterDropOutlined,
  LightOutlined,
} from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFan,
  faWind,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import { tokens } from "../../theme";

// Animations
const spinAnimation = `
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
`;

const acBlowAnimation = `
@keyframes blowWind {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(10px);
  }
  100% {
    transform: translateX(0);
  }
}
`;

const blinkAnimation = `
@keyframes blinkLightbulb {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.1;
  }
}
`;

// Inject animations into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `${spinAnimation}${acBlowAnimation}${blinkAnimation}`;
document.head.appendChild(styleSheet);

function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const isXsDevices = useMediaQuery("(max-width: 436px)");

// Helper functions for colors
const getTemperatureColor = (temp) => {
  if (temp < 20) return "#4fc3f7";
  if (temp < 22) return "#29b6f6";
  if (temp < 25) return "#ffee58";
  if (temp < 28) return "#fdd835";
  if (temp < 31) return "#ffb74d";
  if (temp < 34) return "#f4511e";
  return "#c62828";           
};


  const getHumidityColor = (humidity) => {
    if (humidity < 20) return "#ff7043";
    if (humidity < 30) return "#ffb74d";
    if (humidity < 40) return "#ffeb3b";
    if (humidity < 50) return "#c0ca33";
    if (humidity < 60) return "#66bb6a";
    if (humidity < 70) return "#42a5f5";
    if (humidity < 80) return "#29b6f6";
    if (humidity < 90) return "#1e88e5";
    return "#1565c0";
  };

  const getLightColor = (light) => {
    if (light < 100) return "#4e342e";
    if (light < 300) return "#8d6e63";
    if (light < 500) return "#bcaaa4";
    if (light < 700) return "#d7ccc8";
    if (light < 900) return "#f5f5f5";
    if (light < 1100) return "#ffffff";
    return "#ffffff";
  };

  const getWindSpeedColor = (wind) => {
    if (wind < 1) return "#e0f7fa";
    if (wind < 3) return "#80deea";
    if (wind < 7) return "#26c6da";
    if (wind < 12) return "#00acc1";
    if (wind < 18) return "#00838f";
    if (wind < 24) return "#006064";
    return "#004d40";
  };

  // Initialize switchState without localStorage
  const [switchState, setSwitchState] = useState({
    fan: false,
    airConditioner: false,
    lightbulb: false,
  });

  // Initialize switchLoading
  const [switchLoading, setSwitchLoading] = useState({
    fan: false,
    airConditioner: false,
    lightbulb: false,
  });

  const [sensorData, setSensorData] = useState({
    temperature: null,
    humidity: null,
    light: null,
  });

  // Fetch device status when component mounts
  useEffect(() => {
    let isMounted = true;
    const fetchDeviceStatus = async () => {
      try {
        const response = await axios.get("http://localhost:8080/led/status");
        if (isMounted) {
          const { fan, airConditioner, lightbulb } = response.data;
          setSwitchState({
            fan: fan === "on",
            airConditioner: airConditioner === "on",
            lightbulb: lightbulb === "on",
          });
        }
      } catch (error) {
        console.error("Error fetching device status:", error);
      }
    };

    fetchDeviceStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch sensor data
  useEffect(() => {
    let isMounted = true;
    const fetchSensorData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/sensor/latest");
        if (isMounted) {
          const { temperature, humidity, light } = response.data;
          setSensorData({ temperature, humidity, light });
        }
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchSensorData();
    const intervalId = setInterval(fetchSensorData, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const handleSwitchChange = (event) => {
    const { name } = event.target;

    // Set switchLoading to true for the device
    setSwitchLoading((prev) => ({ ...prev, [name]: true }));

    // Send POST request to the API
    const deviceName = name;
    const desiredState = !switchState[name]; // Desired state after toggle
    const active = desiredState ? "on" : "off";

    axios
      .post("http://localhost:8080/led/control", {
        deviceName,
        active,
      })
      .then((response) => {
        console.log("Data sent successfully:", response.data);

        // Update switch state based on desired state
        setSwitchState((prev) => ({ ...prev, [name]: desiredState }));
        setSwitchLoading((prev) => ({ ...prev, [name]: false }));
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        setSwitchLoading((prev) => ({ ...prev, [name]: false }));
        // Optionally, handle the error (e.g., show a message to the user)
        alert(`Failed to control ${name}. Please try again.`);
      });
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between">
        <Header title="Dashboard" />
        {!isXsDevices && <Box></Box>}
      </Box>

      {/* SENSOR */}
      <Box
        display="grid"
        gridTemplateColumns={
          isXlDevices
            ? "repeat(12, 1fr)"
            : isMdDevices
            ? "repeat(6, 1fr)"
            : "repeat(3, 1fr)"
        }
        gridAutoRows="140px"
        gap="20px"
      >
        {/* Temperature */}
        <Box
          gridColumn="span 4"
          sx={{
            background: `linear-gradient(to right, ${getTemperatureColor(
              sensorData.temperature
            )}, #ff4d4d)`,
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "16px",
          }}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h3" fontWeight="bold" color={colors.gray[800]}>
              {sensorData.temperature
                ? `${sensorData.temperature}℃`
                : "Loading..."}
            </Typography>
            <Typography variant="subtitle1" color={colors.gray[700]}>
              Temperature
            </Typography>
          </Box>
          <WbSunnyOutlined
            sx={{
              color: "#FFD700",
              fontSize: "40px",
              marginLeft: "16px",
            }}
          />
        </Box>

        {/* Humidity */}
        <Box
          gridColumn="span 4"
          sx={{
            background: `linear-gradient(to right, ${getHumidityColor(
              sensorData.humidity
            )}, #1e88e5)`,
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "16px",
          }}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h3" fontWeight="bold" color={colors.gray[800]}>
              {sensorData.humidity ? `${sensorData.humidity}%` : "Loading..."}
            </Typography>
            <Typography variant="subtitle1" color={colors.gray[700]}>
              Humidity
            </Typography>
          </Box>
          <WaterDropOutlined
            sx={{
              color: "#E0F7FA",
              fontSize: "40px",
              marginLeft: "16px",
            }}
          />
        </Box>

        {/* Light */}
        <Box
          gridColumn="span 4"
          sx={{
            background: `linear-gradient(to right, ${getLightColor(
              sensorData.light
            )}, ${colors.gray[300]})`,
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "16px",
          }}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h3" fontWeight="bold" color={colors.gray[800]}>
              {sensorData.light ? `${sensorData.light} lux` : "Loading..."}
            </Typography>
            <Typography variant="subtitle1" color={colors.gray[700]}>
              Light
            </Typography>
          </Box>
          <LightOutlined
            sx={{
              color: "#FF7043",
              fontSize: "40px",
              marginLeft: "16px",
            }}
          />
        </Box>

        {/* Wind Speed */}
        {/* <Box
          gridColumn="span 3"
          sx={{
            background: `linear-gradient(to right, ${getWindSpeedColor(
              sensorData.wind
            )}, ${colors.gray[300]})`,
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "16px",
          }}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h3" fontWeight="bold" color={colors.gray[800]}>
              {sensorData.wind ? `${sensorData.wind} m/s` : "Loading..."}
            </Typography>
            <Typography variant="subtitle1" color={colors.gray[700]}>
              Wind Speed
            </Typography>
          </Box>
          <AirOutlined
            sx={{
              color: "#81d4fa",
              fontSize: "40px",
              marginLeft: "16px",
            }}
          />
        </Box> */}

        {/* ---------------- Row 2 ---------------- */}

        {/* Line Chart */}
        <Box
          gridColumn={
            isXlDevices ? "span 8" : isMdDevices ? "span 6" : "span 3"
          }
          gridRow="span 2"
          bgcolor={colors.primary[400]}
        >
          <Box
            mt="25px"
            px="30px"
            display="flex"
            justifyContent="space-between"
          ></Box>
          <Box height="250px" mt="-20px">
            <LineChart isDashboard={true} />
          </Box>
        </Box>

        {/* Control Panel */}
        <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          bgcolor={colors.primary[400]}
          overflow="auto"
          p="20px"
          borderRadius="8px"
        >
          <Typography variant="h4" fontWeight="600" mb="20px">
            Control
          </Typography>

          <Box display="flex" flexDirection="column" gap="16px">
            {/* Fan Control */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p="16px"
              bgcolor={colors.primary[400]}
              borderRadius="12px"
              boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
            >
              <Typography
                variant="h6"
                fontWeight="600"
                color={colors.textPrimary}
              >
                Fan
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={switchState.fan}
                    onChange={handleSwitchChange}
                    name="fan"
                    disabled={switchLoading.fan}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: colors.greenAccent[600],
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: colors.greenAccent[600],
                      },
                      "& .MuiSwitch-track": {
                        backgroundColor: colors.redAccent[500],
                      },
                    }}
                  />
                }
                label={
                  <Box display="flex" alignItems="center">
                    {switchLoading.fan ? (
                      <CircularProgress size={24} />
                    ) : (
                      <FontAwesomeIcon
                        icon={faFan}
                        color={
                          switchState.fan
                            ? colors.greenAccent[600]
                            : colors.redAccent[600]
                        }
                        size="2x"
                        style={{
                          animation: switchState.fan
                            ? "spin 2s linear infinite"
                            : "none",
                        }}
                      />
                    )}
                    <Typography
                      variant="body2"
                      ml="12px"
                      color={colors.textSecondary}
                    >
                      {switchState.fan ? "ON" : "OFF"}
                    </Typography>
                  </Box>
                }
                labelPlacement="start"
              />
            </Box>

            {/* Air Conditioner Control */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p="16px"
              bgcolor={colors.primary[400]}
              borderRadius="12px"
              boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
            >
              <Typography
                variant="h6"
                fontWeight="600"
                color={colors.textPrimary}
              >
                Air Conditioner
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={switchState.airConditioner}
                    onChange={handleSwitchChange}
                    name="airConditioner"
                    disabled={switchLoading.airConditioner}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: colors.greenAccent[600],
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: colors.greenAccent[600],
                      },
                      "& .MuiSwitch-track": {
                        backgroundColor: colors.redAccent[500],
                      },
                    }}
                  />
                }
                label={
                  <Box display="flex" alignItems="center">
                    {switchLoading.airConditioner ? (
                      <CircularProgress size={24} />
                    ) : (
                      <FontAwesomeIcon
                        icon={faWind}
                        color={
                          switchState.airConditioner
                            ? colors.greenAccent[600]
                            : colors.redAccent[600]
                        }
                        size="2x"
                        style={{
                          animation: switchState.airConditioner
                            ? "blowWind 1.5s ease-in-out infinite"
                            : "none",
                        }}
                      />
                    )}
                    <Typography
                      variant="body2"
                      ml="12px"
                      color={colors.textSecondary}
                    >
                      {switchState.airConditioner ? "ON" : "OFF"}
                    </Typography>
                  </Box>
                }
                labelPlacement="start"
              />
            </Box>

            {/* Lightbulb Control */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p="16px"
              bgcolor={colors.primary[400]}
              borderRadius="12px"
              boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
            >
              <Typography
                variant="h6"
                fontWeight="600"
                color={colors.textPrimary}
              >
                Lightbulb
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={switchState.lightbulb}
                    onChange={handleSwitchChange}
                    name="lightbulb"
                    disabled={switchLoading.lightbulb}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: colors.greenAccent[600],
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: colors.greenAccent[600],
                      },
                      "& .MuiSwitch-track": {
                        backgroundColor: colors.redAccent[500],
                      },
                    }}
                  />
                }
                label={
                  <Box display="flex" alignItems="center">
                    {switchLoading.lightbulb ? (
                      <CircularProgress size={24} />
                    ) : (
                      <FontAwesomeIcon
                        icon={faLightbulb}
                        color={
                          switchState.lightbulb
                            ? colors.greenAccent[600]
                            : colors.redAccent[600]
                        }
                        size="2x"
                        style={{
                          animation: switchState.lightbulb
                            ? "blinkLightbulb 1s infinite"
                            : "none",
                        }}
                      />
                    )}
                    <Typography
                      variant="body2"
                      ml="12px"
                      color={colors.textSecondary}
                    >
                      {switchState.lightbulb ? "ON" : "OFF"}
                    </Typography>
                  </Box>
                }
                labelPlacement="start"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
