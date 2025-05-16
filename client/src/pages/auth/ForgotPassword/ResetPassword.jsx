import React from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../../../apis/Employee/auth";
import { errorMessages } from "../../../apis/messageHandler";
import toast from "react-hot-toast";

const ResetPassword = ({ email, otpCode }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await resetPassword({
        email,
        otp: otpCode,
        newPassword: data.password,
      }).unwrap();
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      errorMessages(err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} mt={4}>
      <Stack spacing={2}>
        <TextField
          {...register("password", {
            required: "Password is required",
            minLength: 6,
          })}
          size="small"
          variant="outlined"
          fullWidth
          label="New Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          {...register("confirmPassword", {
            required: "Confirm Password is required",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
          size="small"
          variant="outlined"
          fullWidth
          label="Confirm Password"
          type="password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </Stack>
      <Typography variant="body2" align="center" mt={4}>
        Go back to{" "}
        <Link to="/login" style={{ color: "#0E57FF", textDecoration: "none" }}>
          <b style={{ cursor: "pointer" }}>Sign In</b>
        </Link>
      </Typography>
    </Box>
  );
};

export default ResetPassword;
