import { Link as RouterLink } from "react-router-dom";
import { styled } from "@mui/material/styles";

const StyledLink = styled(RouterLink)(({ theme }) => ({
  textDecoration: "none",
  color: "#0E57FF",
  fontWeight: 500,
  "&:hover": {
    textDecoration: "underline",
  },
}));

export default StyledLink;
