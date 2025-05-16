import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";

const RealTimeClock = ({
  hour12 = false,
  showSeconds = false,
  showPeriod = true,
}) => {
  const [time, setTime] = useState("");

  const formatTime = (date) => {
    let hours = date.getHours();
    let period = "";

    if (hour12) {
      period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    }

    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = showSeconds
      ? `:${String(date.getSeconds()).padStart(2, "0")}`
      : "";
    const timePeriod = showPeriod && hour12 ? ` ${period}` : "";

    return `${String(hours).padStart(
      2,
      "0"
    )}:${minutes}${seconds}${timePeriod}`;
  };

  useEffect(() => {
    const updateTime = () => {
      setTime(formatTime(new Date()));
    };

    // Update immediately
    updateTime();

    // Set interval for updates
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [hour12, showSeconds, showPeriod]);

  return (
    <Typography variant="h4" align="center">
      {time}
    </Typography>
  );
};

export default RealTimeClock;
