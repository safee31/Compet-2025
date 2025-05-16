import React, { Component } from "react";
import { Box, Typography, Button, Container, Stack } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Stack
          maxWidth="sm"
          sx={{
            height: "50vh",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            bgcolor: "#ffebee",
            color: "#d32f2f",
            borderRadius: "12px",
            m: "auto",
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" fontWeight="bold">
            Oops! Something went wrong 😞
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, mb: 3 }}>
            An unexpected error occurred. Please try again.
          </Typography>
          <Button variant="contained" color="error" onClick={this.handleReload}>
            Reload Page
          </Button>
        </Stack>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
