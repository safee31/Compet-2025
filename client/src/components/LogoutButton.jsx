import { Logout } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { logoutEmployee } from "../redux/Slices/Account";

const LogoutButton = ({ sx = {}, ...props }) => {
  const dispatch = useDispatch();
  return (
    <Button
      type="button"
      variant="outlined"
      color="error"
      startIcon={<Logout />}
      onClick={() => dispatch(logoutEmployee())}
      sx={sx}
      {...props} // Spread all remaining props
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
