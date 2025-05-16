import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";

const Spinner = ({ size = 48, screenH = "100vh" }) => {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{ height: screenH }}
    >
      <CircularProgress size={size} />
    </Box>
  );
};

const SpinnerMd = ({ size = 40 }) => {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      minHeight={"50vh"}
    >
      <CircularProgress size={size} />
    </Box>
  );
};

const SpinnerSm = ({ size = 32, isPage = false, message = "" }) => {
  message = message?.trim();
  return (
    <Stack
      justifyContent={"center"}
      alignItems={"center"}
      minHeight={isPage ? "100%" : "10vh"}
      gap={1}
    >
      <CircularProgress size={size} />
      {message}
    </Stack>
  );
};

export { Spinner, SpinnerMd, SpinnerSm };
