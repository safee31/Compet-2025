import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSidebarToggle } from "../redux/Slices/SidebarToggle";
import ThemeSwitch from "./Switch";
import { ProfileMenu } from "./UI/ProfileMenu";
import { NotifiMenu } from "./UI/NotifiMenu";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  InputBase,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

const Header = () => {
  const dispatch = useDispatch();
  const sidebar = useSelector((state) => state.toggleSidebar);

  return (
    <AppBar position="fixed" color="default" elevation={1}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => dispatch(setSidebarToggle(!sidebar.menu))}
        >
          <MenuIcon />
        </IconButton>

        <Box display="flex" flexGrow={1} alignItems="center">
          <Box
            display={{ xs: "none", sm: "block" }}
            position="relative"
            marginLeft={2}
          >
            <SearchIcon style={{ position: "absolute", top: 8, left: 8 }} />
            <InputBase
              placeholder="Search here"
              inputProps={{ "aria-label": "search" }}
              style={{
                paddingLeft: 32,
                borderRadius: 16,
                backgroundColor: "#f1f1f1",
                width: "100%",
              }}
            />
          </Box>
        </Box>

        <Box display="flex" alignItems="center">
          <NotifiMenu />
          <ThemeSwitch />
          <ProfileMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
