import React, { useState } from "react";
import {
  Popover,
  MenuItem,
  MenuList,
  IconButton,
  Avatar,
  Box,
  Typography,
} from "@mui/material";

export const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <IconButton onClick={handleOpen} size="small" sx={{ ml: 2 }}>
        <Avatar
          src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Profile"
          sx={{ width: 40, height: 40 }}
        />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            p: 2,
            borderRadius: 1,
            backgroundColor: "background.paper",
            boxShadow: 3,
          },
        }}
      >
        <MenuList>
          <MenuItem onClick={handleClose}>
            <Typography variant="body2">
              <Link to="/">Dashboard</Link>
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Typography variant="body2">
              <Link to="/">Settings</Link>
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Typography variant="body2">
              <Link to="/">Earnings</Link>
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Typography variant="body2">
              <Link to="/">Sign out</Link>
            </Typography>
          </MenuItem>
        </MenuList>
      </Popover>
    </Box>
  );
};
