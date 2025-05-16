import { Stack, Typography } from "@mui/material";
import React from "react";

const DataInfo = ({ message = "No Data Found." }) => {
  return (
    <Stack
      direction={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{ minHeight: "20vh" }}
    >
      <Typography color="info" textAlign={"center"}>
        {message}
      </Typography>
    </Stack>
  );
};

export default DataInfo;
