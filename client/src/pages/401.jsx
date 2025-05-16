import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, Paper, Stack } from "@mui/material";

const Page401 = () => {
  return (
    <Stack
      sx={{
        minHeight: "50vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <>
        <Typography variant="h1" fontWeight="bold" color="error">
          401
        </Typography>
        <Typography variant="h5" fontWeight="medium" color="black" py={2}>
          Oops! Unauthenticated.
        </Typography>

        {/* Redirect Button */}
        <Button component={Link} to="/" variant="contained">
          HOME
        </Button>
      </>
    </Stack>
  );
};

export default Page401;
