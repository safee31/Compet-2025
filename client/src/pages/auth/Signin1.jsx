import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
// import { useLoginUserMutation } from "../../apis/user";
import {
  Box,
  Typography,
  Avatar,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
} from "@mui/material";
import { setUser } from "../../redux/Slices/User";
import { useDispatch } from "react-redux";
import SignIn2 from "./Signin2";

const SignIn1 = () => {
  let defaultForm = { email: "", password: "" };
  const [steps, setSteps] = useState(2);
  const [loginForm, setLoginForm] = useState(defaultForm);
  const dispatch = useDispatch();
  const handleSteps = (role) => {
    setLoginForm({ ...loginForm, role });
    setSteps(2);
  };

  // const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm?.email?.trim() || !loginForm?.password?.trim()) {
      toast.error("All fields are required!");
      return;
    }
    // loginUser(loginForm, {
    //   onSuccess: () => {
    //     setLoginForm(defaultForm);
    //   },
    // });
    dispatch(
      setUser({
        _id: "64f98abc1e72f3001a5f6d8c",
        loginAt: "2025-01-03T10:30:00Z",
        logoutAt: "2025-01-03T12:00:00Z",
        firstName: "John",
        lastName: "Doe",
        userName: "john.doe",
        user_type: 4,
        is_verified: true,
        email: "john.doe@example.com",
        image: "https://example.com/profile/johndoe.jpg",
        password: "hashed_password_here",
        phone: "+1234567890",
      })
    );
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Box display="flex" width="100%" overflow="auto">
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            sx={{
              bgcolor: "white.main",
              color: "text.primary",
              py: 5,
              px: 3,
              maxWidth: 600,
              width: "100%",
            }}
          >
            <Stack direction="column" alignItems="center" spacing={2} mb={3}>
              <Avatar
                src="/images/probe_logo.png"
                alt="Probe Logo"
                sx={{ width: 60, height: 60 }}
              />

              <Typography variant="h4" fontWeight="bold" align="center">
                Sign In
              </Typography>
            </Stack>
            {steps === 1 ? (
              <List>
                {["Admin", "Employee", "Members", "Public View"].map((role) => (
                  <ListItem key={role} disablePadding>
                    <ListItemButton
                      sx={{
                        bgcolor: "grey.200",
                        "&:hover": { bgcolor: "primary.main", color: "white" },
                        borderRadius: 2,
                        textAlign: "center",
                      }}
                      onClick={() => handleSteps(role.toLowerCase())}
                    >
                      <ListItemText primary={role} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <SignIn2
                loading={isLoading}
                handleLogin={handleLogin}
                setLoginForm={setLoginForm}
                loginForm={loginForm}
              />
            )}
            <Typography variant="body2" align="center" mt={3}>
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                style={{ fontWeight: "bold", cursor: "pointer" }}
              >
                Sign Up
              </Link>
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default SignIn1;
