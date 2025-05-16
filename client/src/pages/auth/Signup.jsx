import { Controller, useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  MenuItem,
  Container,
  Stack,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import StyledLink from "../../components/StylesLink";
import { useRegisterEmployeeMutation } from "../../apis/Employee/auth";
import { errorMessages } from "../../apis/messageHandler";
import { useGetAllPublicCompaniesQuery } from "../../apis/company/company";
import { getDocumentId } from "../../utils/toTitleCase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import OTP from "./ForgotPassword/OTP";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterEmployeeMutation();
  const { data, isFetching: isCompaniesFetching } =
    useGetAllPublicCompaniesQuery();
  const onSubmit = async (data) => {
    try {
      await registerUser(data).unwrap();
      reset();
      toast.success("Employee registered successfully!");
      // navigate("/login");
      setEmail(data?.email);
    } catch (error) {
      errorMessages(error);
    }
  };

  return (
    <Stack height={"100%"}>
      <Container maxWidth="xs" sx={{ p: 0, m: "auto" }}>
        <Box
          width="100%"
          bgcolor="white.main"
          p={{ md: 3, xs: 2 }}
          borderRadius={2}
          boxShadow={3}
          maxHeight={"100vh"}
          overflow={"auto"}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            mby={2}
          >
            {email ? (
              <Typography variant="h5" fontWeight="bold">
                Enter OTP
              </Typography>
            ) : (
              <Typography variant="h6" fontWeight={"bold"}>
                Sign Up
              </Typography>
            )}
            <Typography>
              <StyledLink to="/login">Log In</StyledLink>
            </Typography>
          </Stack>

          {email ? (
            <OTP
              email={email}
              handleVerifiedOtp={(otp) => {
                if (otp) {
                  navigate("/login");
                }
              }}
              otpType={"verify"}
            />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap={1}>
                <Box>
                  <InputLabel>Email Address</InputLabel>
                  <TextField
                    size="small"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    // label="Email Address"
                    {...register("email", {
                      required: "Email is required",
                    })}
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ""}
                  />
                </Box>
                <Box>
                  <InputLabel>Password</InputLabel>
                  <TextField
                    size="small"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    // label="Password"
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ""}
                  />
                </Box>

                <Box>
                  <InputLabel>Re-enter Password</InputLabel>
                  <TextField
                    size="small"
                    variant="outlined"
                    fullWidth
                    type="password"
                    {...register("confirmPassword", {
                      required: "Re-entering password is required",
                    })}
                    error={!!errors.confirmPassword}
                    helperText={
                      errors.confirmPassword
                        ? errors.confirmPassword.message
                        : ""
                    }
                  />
                </Box>
                <Box>
                  <InputLabel>Company</InputLabel>
                  <Controller
                    name="company"
                    control={control}
                    rules={{ required: "Company is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        onChange={(event) => field.onChange(event.target.value)}
                        disabled={isCompaniesFetching}
                        size="small"
                        fullWidth
                        select
                        error={!!errors.company}
                        value={field.value || ""}
                      >
                        {isCompaniesFetching ? (
                          <MenuItem value={""} disabled>
                            Loading companies...
                          </MenuItem>
                        ) : (
                          data?.companies?.map((o, idx) => (
                            <MenuItem key={idx} value={getDocumentId(o)}>
                              {o?.name}
                            </MenuItem>
                          ))
                        )}
                      </TextField>
                    )}
                  />
                  <FormHelperText error>
                    {errors.company?.message}
                  </FormHelperText>
                </Box>
              </Stack>
              <Typography
                align="center"
                variant="body2"
                color="textSecondary"
                sx={{ mt: 2, mb: 2 }}
              >
                By creating an account you agree to the
                <StyledLink to="/#" underline="hover" fontWeight={"bold"}>
                  Terms of Service
                </StyledLink>{" "}
                and{" "}
                <StyledLink to="/#" underline="hover">
                  Privacy Policy
                </StyledLink>
              </Typography>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={20} /> : "Sign Up"}
              </Button>
            </form>
          )}
        </Box>
      </Container>
    </Stack>
  );
};

export default SignUp;
