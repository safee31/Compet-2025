import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, Paper, Stack } from "@mui/material";

const Page404 = () => {
  return (
    <Stack
      sx={{
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <>
        <Typography variant="h1" fontWeight="bold" color="error">
          404
        </Typography>
        <Typography variant="h5" fontWeight="medium" color="white" py={2}>
          Oops! Page not found
        </Typography>

        {/* Redirect Button */}
        <Button component={Link} to="/" variant="contained">
          HOME
        </Button>
      </>
    </Stack>
  );
};

export default Page404;
