import React from "react";
import { ToggleButton, ToggleButtonGroup, Box } from "@mui/material";

const ContainedTabsFilter = ({
  options = ["Day", "Week", "Month"], // Default options
  value,
  onChange,
  activeColor = "#0E57FF",
  inactiveColor = "#888", // Inactive text color
  borderColor = "grey", // Light border color
  sx = {}, // Extra styling
}) => {
  return (
    <Box
      sx={{
        display: "inline-flex",
        borderRadius: 1.5,
        border: `1px solid ${borderColor}`,
        overflow: "hidden",
        ...sx,
      }}
    >
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(e, newValue) => newValue && onChange(newValue)}
        sx={{ borderRadius: 1.5, overflow: "hidden" }}
      >
        {options.map((option) => (
          <ToggleButton
            key={option}
            value={option.toLowerCase()}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              fontSize: "14px",
              paddingY: 0,
              px: 1.8,
              borderRadius: 1.5,
              border: "none",
              color: value === option.toLowerCase() ? "#fff" : inactiveColor,
              bgcolor:
                value === option.toLowerCase() ? activeColor : "transparent",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                bgcolor:
                  value === option.toLowerCase() ? activeColor : "#f0f0f0",
              },
              "&.Mui-selected": {
                bgcolor: activeColor + " !important",
                color: "#fff",
              },
              "&.Mui-selected:hover": {
                bgcolor: activeColor,
              },
            }}
          >
            {option}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default ContainedTabsFilter;
