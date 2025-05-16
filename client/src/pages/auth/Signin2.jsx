import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Stack,
  Checkbox,
  FormControlLabel,
  InputLabel,
} from "@mui/material";
import { useForm } from "react-hook-form";
import StyledLink from "../../components/StylesLink";
import { useDispatch } from "react-redux";
import { setAccountData } from "../../redux/Slices/Account";
import toast from "react-hot-toast";
import { useLoginEmployeeMutation } from "../../apis/Employee/auth";
import { errorMessages } from "../../apis/messageHandler";

const SignIn2 = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // const account = useSelector((s) => s?.account);
  // const loading = account?.loading;
  const [loginEmployee, { isLoading }] = useLoginEmployeeMutation();
  const dispatch = useDispatch();

  const handleLogin = async (loginForm) => {
    if (!loginForm?.email?.trim() || !loginForm?.password?.trim()) {
      toast.error("All fields are required!");
      return;
    }
    try {
      const res = await loginEmployee(loginForm).unwrap();
      dispatch(setAccountData(res?.data));
      toast.success("Welcome back!");
    } catch (error) {
      errorMessages(error);
    }
  };

  const onSubmit = (data) => {
    handleLogin(data);
  };
  
  return (
    <Stack height={"90%"}>
      <Container maxWidth="xs" sx={{ p: 0, m: "auto" }}>
        <Box
          width="100%"
          bgcolor="white.main"
          p={3}
          borderRadius={2}
          boxShadow={3}
          overflow={"auto"}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            mb={2}
          >
            <Typography variant="h6" fontWeight={"bold"}>
              Log In
            </Typography>
            <Typography>
              <StyledLink to="/signup">Sign Up</StyledLink>
            </Typography>
          </Stack>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={2}>
              <Box>
                <InputLabel>Email</InputLabel>
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
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
                  // label="Password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ""}
                />
              </Box>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <FormControlLabel
                  control={<Checkbox {...register("staySignedIn")} />}
                  label="Stay signed in"
                />
                <StyledLink to="/forgotPassword">Forgot Password?</StyledLink>
              </Stack>
            </Stack>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? "Please wait..." : "Log In"}
            </Button>
          </form>
        </Box>
      </Container>
      
    </Stack>
  );
};

export default SignIn2;
