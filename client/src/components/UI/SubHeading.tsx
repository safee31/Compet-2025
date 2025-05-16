import {Box, Typography} from "@mui/material";
import React from "react";

export default function SubHeading({heading}) {
  return (
    <Box position="relative">
      <Typography variant="h6" fontWeight="bold">
        {heading}
      </Typography>
      <Box
        position="absolute"
        left={0}
        bottom={-2}
        width={32}
        height={3}
        bgcolor="green"
      />
    </Box>
  );
}
