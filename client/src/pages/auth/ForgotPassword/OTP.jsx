import React, { useRef } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { errorMessages } from "../../../apis/messageHandler";
import {
  useSendUserOTPMutation,
  useVerifyEmployeeEmailMutation,
  useVerifyUserOTPMutation,
} from "../../../apis/Employee/auth";
import toast from "react-hot-toast";

const OTP = ({ email, handleVerifiedOtp = () => {}, otpType }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const [verifyOTP, { isLoading }] = useVerifyUserOTPMutation();
  const [sendOTP, { isLoading: isSending }] = useSendUserOTPMutation();

  const otpRefs = useRef([]); // Refs for input fields

  const onSubmit = async (data) => {
    try {
      const otpCode = Object.values(data).join(""); // Combine inputs into a string
      await verifyOTP({ email, otp: otpCode, otpType }).unwrap();
      toast.success("Verification successfull!");
      handleVerifiedOtp(otpCode);
    } catch (err) {
      errorMessages(err);
    }
  };
  const handleResendOTP = async () => {
    try {
      await sendOTP({ email, otpType }).unwrap();
    } catch (err) {
      errorMessages(err);
    }
  };

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    if (/^[a-zA-Z0-9]?$/.test(value)) {
      // Allow only single alphanumeric character
      setValue(`otp${index}`, value);

      if (value && index < otpRefs.current.length - 1) {
        otpRefs.current[index + 1].focus(); // Auto-focus next input
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !watch(`otp${index}`) && index > 0) {
      otpRefs.current[index - 1].focus(); // Move focus back on Backspace
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row" justifyContent="center" spacing={2} mb={2}>
        {Array.from({ length: 4 }).map(
          (
            _,
            index // Supports 5-character OTP
          ) => (
            <TextField
              key={index}
              inputRef={(el) => (otpRefs.current[index] = el)} // Assign ref dynamically
              {...register(`otp${index}`, {
                required: "OTP is required",
                pattern: {
                  value: /^[a-zA-Z0-9]$/,
                  message: "Only alphanumeric characters allowed",
                },
              })}
              size="small"
              variant="outlined"
              inputProps={{
                maxLength: 1,
                style: { textAlign: "center" },
              }}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              error={!!errors[`otp${index}`]}
            />
          )
        )}
      </Stack>
      {!isSending ? (
        <Typography variant="body2" align="right">
          Don't receive OTP?{" "}
          <Typography
            component="span"
            fontWeight="bold"
            color="primary"
            sx={{ cursor: "pointer" }}
            onClick={handleResendOTP}
            disabled={isSending || isLoading}
          >
            Resend
          </Typography>
        </Typography>
      ) : (
        <Typography variant="body2" align="right">
          <Typography
            variant="body2"
            align="right"
            component="span"
            fontWeight="bold"
            color="primary"
          >
            Resending...
          </Typography>
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 4 }}
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Submit"}
      </Button>
    </Box>
  );
};

export default OTP;
