import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const Page404 = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="50vh"
      flexDirection="column"
    >
      <>
        <Typography variant="h1" fontWeight="bold" color="error">
          404
        </Typography>
        <Typography variant="h5" fontWeight="medium" color="black" py={2}>
          Oops! Page not found
        </Typography>

        {/* Redirect Button */}
        <Button component={Link} to="/" variant="contained">
          HOME
        </Button>
      </>
    </Box>
  );
};

export default Page404;
