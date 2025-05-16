import React, { useState } from "react";
import {
  Popover,
  MenuItem,
  MenuList,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

export const NotifiMenu = () => {
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
      <IconButton
        aria-label="notifications"
        onClick={handleOpen}
        size="small"
        sx={{ ml: 2 }}
      >
        <NotificationsIcon fontSize="small" />
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
            <Typography variant="body2">Dashboard</Typography>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Typography variant="body2">Settings</Typography>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Typography variant="body2">Earnings</Typography>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Typography variant="body2">Sign out</Typography>
          </MenuItem>
        </MenuList>
      </Popover>
    </Box>
  );
};
