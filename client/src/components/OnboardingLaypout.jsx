import { Box } from "@mui/material";

const OnboardingLayout = ({ children }) => {
  return (
    <Box
      height={"100vh"}
      bgcolor={"black"}
      sx={{
        backgroundImage: "url('/images/public-bg.webp')",
        objectFit: "cover",
        backgroundRepeat: "round",
      }}
    >
      {children}
    </Box>
  );
};

export default OnboardingLayout;
