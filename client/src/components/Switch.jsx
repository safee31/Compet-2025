import React, { useState } from "react";
import { Switch, Box } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const ThemeSwitch = () => {
  const [isChecked, setIsChecked] = useState(true);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    // You can add logic here to toggle themes (dark/light)
  };

  return (
    <Box display="flex" alignItems="center">
      <Brightness7Icon
        style={{
          color: isChecked ? "#1976d2" : "#9e9e9e",
          marginRight: 8,
        }}
      />
      <Switch
        checked={isChecked}
        onChange={handleToggle}
        color="primary"
        inputProps={{ "aria-label": "theme toggle" }}
      />
      <Brightness4Icon
        style={{
          color: isChecked ? "#9e9e9e" : "#1976d2",
          marginLeft: 8,
        }}
      />
    </Box>
  );
};

export default ThemeSwitch;
