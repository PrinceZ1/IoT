import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faGithub,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faBook, faFilePdf } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        padding: "20px",
      }}
    >
      <Box
        width="350px"
        borderRadius="15px"
        textAlign="center"
        overflow="hidden"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          margin: "0 30px",
          padding: "30px",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          transition: "0.3s",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: "0 12px 24px rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <Box
          sx={{
            width: "130px",
            height: "130px",
            overflow: "hidden",
            borderRadius: "50%",
            border: "4px solid rgba(255, 255, 255, 0.3)",
            margin: "0 auto 20px",
            transition: "0.25s",
            "& img": {
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              transition: "0.25s",
            },
            "&:hover img": {
              transform: "scale(1.1)",
            },
          }}
        >
          <img
            src="/src/assets/images/avatar.png"
            alt="Profile"
          />
        </Box>
        <Typography variant="h5" color="#ffffff" mb="10px" fontWeight="bold">
          Trịnh Tân Nguyên
        </Typography>
        <Typography variant="body1" color="#bbbbbb" mb="20px">
          B21DCCN569
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
          mb="20px"
        >
          {[
            {
              icon: faBook,
              label: "API doc",
              href: "https://documenter.getpostman.com/view/33324107/2sAXxY5Ux7",
            },
            {
              icon: faFilePdf,
              label: "PDF",
              href: "https://drive.google.com/file/d/1hkqvbpzKIYvK7X9ji9MBZ6T6hmFRmrwl/view?usp=sharing",
            },
            {
              icon: faGithub,
              label: "GitHub",
              href: "https://github.com/PrinceZ1/IoT",
            },
          ].map((item) => (
            <Button
              key={item.label}
              variant="contained"
              startIcon={<FontAwesomeIcon icon={item.icon} />}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#ffffff",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                padding: "10px 30px",
                borderRadius: "25px",
                transition: "0.25s",
                width: "100%",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
