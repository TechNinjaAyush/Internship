import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useDispatch, useSelector } from "react-redux";
import {
  nextPosition,
  toggleConnection,
  selectPosition,
  selectConnectedPairs,
} from "./redux/counterSlice";
import {
  Button,
  Menu,
  MenuItem,
  Typography,
  Select,
  FormControl,
  InputLabel,
  Paper,
  IconButton,
} from "@mui/material";

const getColor = (value) => {
  if (value === 0) return "#FF4C4C"; // Red
  if (value === 50) return "#FFA500"; // Orange
  if (value === 100) return "#4CAF50"; // Green
  return "gray";
};

const Task1 = () => {
  const positions = useSelector(selectPosition);
  const connectedPairs = useSelector(selectConnectedPairs);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const presetOptions = [
    { value: "none", label: "No Links (Independent)" },
    { value: "1-2", label: "Link Sliders 1-2" },
    { value: "1-3", label: "Link Sliders 1-3" },
    { value: "2-3", label: "Link Sliders 2-3" },
  ];

  // Update body background color when dark mode changes
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#121212" : "#f5f5f5";
    document.body.style.color = darkMode ? "#ffffff" : "#333333";
    document.body.style.transition = "background-color 0.3s ease, color 0.3s ease";
    
    // Clean up function to reset styles when component unmounts
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
      document.body.style.transition = "";
    };
  }, [darkMode]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSliderChange = (sliderIndex) => {
    dispatch(nextPosition(sliderIndex));
    handleClose();
  };

  const handlePresetChange = (event) => {
    const preset = event.target.value;
    setSelectedPreset(preset);
    
    // Reset all connections first
    Object.keys(connectedPairs).forEach(key => {
      if (connectedPairs[key]) {
        dispatch(toggleConnection(key));
      }
    });
    
    if (preset === "1-2") {
      dispatch(toggleConnection("0-1"));
    } else if (preset === "1-3") {
      dispatch(toggleConnection("0-2"));
    } else if (preset === "2-3") {
      dispatch(toggleConnection("1-2"));
    }
    // If "none" is selected, all connections remain unlinked
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Check if any of the preset configurations match the current state
  const updateSelectedPresetFromConnections = () => {
    if (connectedPairs["0-1"] && !connectedPairs["0-2"] && !connectedPairs["1-2"]) {
      return "1-2";
    } else if (connectedPairs["0-2"] && !connectedPairs["0-1"] && !connectedPairs["1-2"]) {
      return "1-3";
    } else if (connectedPairs["1-2"] && !connectedPairs["0-1"] && !connectedPairs["0-2"]) {
      return "2-3";
    } else {
      return "none";
    }
  };

  // Dynamic styles based on dark mode
  const getBgColor = () => darkMode ? "#1e1e1e" : "rgba(255, 255, 255, 0.7)";
  const getTextColor = () => darkMode ? "#fff" : "#333";
  const getPaperBgColor = () => darkMode ? "rgba(45, 45, 45, 0.8)" : "rgba(255, 255, 255, 0.5)";

  return (
    <Box
      sx={{
        width: 400,
        textAlign: "center",
        mx: "auto",
        my: 10,
        p: 4,
        bgcolor: getBgColor(),
        color: getTextColor(),
        backdropFilter: "blur(10px)",
        borderRadius: 3,
        boxShadow: darkMode ? "0 4px 30px rgba(0, 0, 0, 0.3)" : "0 4px 30px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: getTextColor() }}>
          🤖
        </Typography>
        <IconButton 
          onClick={toggleDarkMode}
          sx={{ 
            color: getTextColor(),
            transition: "0.3s ease",
            ":hover": { transform: "scale(1.1)" }
          }}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Box>
      
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: getTextColor() }}>
        Control Panel
      </Typography>

      {positions.map((value, index) => (
        <Paper
          key={index}
          elevation={3}
          sx={{
            p: 2,
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
            bgcolor: getPaperBgColor(),
            backdropFilter: "blur(20px)",
            transition: "all 0.3s ease",
          }}
        >
          <VolumeDownIcon sx={{ color: getTextColor() }} />
          <Slider
            value={value}
            min={0}
            max={100}
            step={50}
            sx={{
              mx: 2,
              color: getColor(value),
              transition: "0.3s ease",
            }}
            aria-label={`Slider ${index + 1}`}
          />
          <VolumeUpIcon sx={{ color: getTextColor() }} />
        </Paper>
      ))}

      <Typography variant="h6" sx={{ my: 2, fontWeight: "bold", color: getTextColor() }}>
        🔗 Link Options
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel sx={{ color: darkMode ? "rgba(255, 255, 255, 0.7)" : undefined }}>
          Slider Links
        </InputLabel>
        <Select
          value={selectedPreset || updateSelectedPresetFromConnections()}
          onChange={handlePresetChange}
          sx={{
            color: getTextColor(),
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : undefined
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : undefined
            },
          }}
        >
          {presetOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="outlined"
        onClick={handleClick}
        sx={{
          display: "block",
          mx: "auto",
          my: 2,
          fontWeight: "bold",
          borderRadius: 2,
          transition: "0.3s ease",
          color: getTextColor(),
          borderColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : undefined,
          ":hover": { 
            transform: "scale(1.05)",
            borderColor: darkMode ? 'rgba(255, 255, 255, 0.8)' : undefined 
          },
        }}
      >
        🎚️ Select Slider
      </Button>

      <Menu 
        anchorEl={anchorEl} 
        open={Boolean(anchorEl)} 
        onClose={handleClose}
        PaperProps={{
          sx: darkMode ? {
            bgcolor: '#1e1e1e',
            color: '#fff'
          } : {}
        }}
      >
        {positions.map((_, index) => (
          <MenuItem key={index} onClick={() => handleSliderChange(index)}>
            Move Slider {index + 1}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default Task1;