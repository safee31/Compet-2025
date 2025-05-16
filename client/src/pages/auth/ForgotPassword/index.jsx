import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";
import OTP from "./OTP";
import ResetPassword from "./ResetPassword";
import StyledLink from "../../../components/StylesLink";
import { useForgotPasswordMutation } from "../../../apis/Employee/auth";
import { errorMessages } from "../../../apis/messageHandler";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [isMailSent, setIsMailSent] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState("");
  const [email, setEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onSubmit = async (data) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();
      setEmail(data.email);
      setIsMailSent(true);
      toast.success("OTP sent!");
    } catch (err) {
      errorMessages(err);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Box
          width="100%"
          bgcolor="white.main"
          p={3}
          borderRadius={2}
          boxShadow={3}
          overflow="auto"
        >
          <Stack alignItems="center" spacing={2} mb={3}>
            <Typography variant="h5" fontWeight="bold">
              {isMailSent
                ? isOTPVerified
                  ? "Reset Password"
                  : "Enter OTP"
                : "Forgot Password"}
            </Typography>
            {!isMailSent && (
              <Typography
                variant="body2"
                color="textSecondary"
                textAlign="center"
              >
                It is a long established fact that a reader will be distracted
                by the readable content of a page.
              </Typography>
            )}
          </Stack>

          {isMailSent ? (
            isOTPVerified ? (
              <ResetPassword email={email} otpCode={isOTPVerified} />
            ) : (
              <OTP
                email={email}
                handleVerifiedOtp={setIsOTPVerified}
                otpType={"reset"}
              />
            )
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <TextField
                  {...register("email", {
                    required: "Email is required",
                    pattern: /^\S+@\S+\.\S+$/,
                  })}
                  size="small"
                  variant="outlined"
                  fullWidth
                  label="Enter Your Email"
                  type="email"
                  required
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Submit"}
                </Button>
              </Stack>
              <Typography variant="body2" align="center" mt={3}>
                Remembered your password?{" "}
                <StyledLink to="/login">Log In</StyledLink>
              </Typography>
            </form>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
