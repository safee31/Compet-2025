import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  IconButton,
  useMediaQuery,
  Stack,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  IntegrationInstructions,
  Logout,
  Menu,
  Task,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutEmployee } from "../redux/Slices/Account";
import RealTimeClock from "./digitalTime";
import { customStyles } from "../theme/components";

// Your icons here...
import {
  Home as HomeIcon,
  Groups as GroupsIcon,
  Alarm as AlarmIcon,
  Settings as SettingsIcon,
  BusinessCenter as BusinessCenterIcon,
  AccountCircle,
  DocumentScanner,
  SupervisedUserCircle,
  ImportContacts,
  Newspaper,
  VerifiedOutlined,
  Groups,
  AssignmentInd,
  Business,
  Policy,
  LiveHelp,
  MeetingRoom,
} from "@mui/icons-material";
import { VITE_SMP_ACCESS } from "../constants";

const drawerWidth = 250;

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isMdScreen = useMediaQuery("(min-width:900px)");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [openCollapse, setOpenCollapse] = useState({}); // manage all collapses

  const account = useSelector((state) => state.account);
  const userRole = Number(account?.details?.role?.type || 0);
  const isManager = userRole === 2;
  const isDpartmentAssigned = isManager && account?.details?.department;
  const hasAccessToSMPViolations = account?.details?.featureAccess
    ?.smp_violations?.canAccess
    ? true
    : false;

  const toggleDrawer = () => setMobileOpen(!mobileOpen);
  const isActive = (path) => location.pathname.includes(path);
  const toggleCollapse = (name) =>
    setOpenCollapse((prev) => ({ ...prev, [name]: !prev[name] }));

  // Role-based items
  const sidebarItems = {
    admin: [
      { path: "home", name: "Home", icon: <HomeIcon /> },
      { path: "settings", name: "Settings", icon: <SettingsIcon /> },
    ],
    employee: [
      { path: "home", name: "Home", icon: <HomeIcon /> },
      { path: "profile", name: "My Profile", icon: <AccountCircle /> },
    ],
    manager: [{ path: "home", name: "Home", icon: <HomeIcon /> }],
  };

  let rolePrefix = "/";
  let roleLinks = [];

  if (userRole === 1) {
    rolePrefix = "/admin";
    roleLinks = sidebarItems.admin;
  } else if (userRole === 2) {
    rolePrefix = "/manager";
    roleLinks = sidebarItems.manager;
  } else if (userRole === 3) {
    rolePrefix = "/employee";
    roleLinks = sidebarItems.employee;
  }

  const renderLink = (item, isSub = false) => {
    const active = isActive(item?.path);
    const disabled = item?.disabled;

    return (
      <Tooltip
        key={item?.path}
        title={disabled ? "Coming Soon" : ""}
        arrow
        disableInteractive
      >
        <Box>
          <ListItemButton
            component={Link}
            to={`${rolePrefix}/${item?.path}`}
            selected={active}
            sx={{
              color: active ? "#fff" : "#b0b0b0",
              backgroundColor: active ? "#252525" : "transparent",
              padding: isSub ? "7px 20px" : "7px 13px",
              borderRadius: "5px",
              "&.Mui-selected": {
                backgroundColor: "#252525",
                boxShadow: "0px 0px 10px rgba(255,255,255,0.1)",
              },
              "&:hover": {
                backgroundColor: "#333",
                color: "#fff",
              },
            }}
            disabled={disabled}
          >
            <ListItemIcon
              sx={{ color: active ? "#007BFF" : "#b0b0b0", minWidth: 30 }}
            >
              {item?.icon}
            </ListItemIcon>
            <ListItemText primary={item?.name} />
          </ListItemButton>
        </Box>
      </Tooltip>
    );
  };

  const sidebarContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* <Box
        minHeight={"90px"}
        sx={{
          backgroundImage: "url('/images/sidebar-top-bg.webp')",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box component="img" width={100} src="/images/company-logo.png" />
      </Box> */}
      <Box m={1} bgcolor={"#1a1a1a"} p={1} borderRadius={1.5}>
        <Stack justifyContent="center" gap={0.5}>
          <Typography fontSize={14} align="center">
            Logged in at
          </Typography>
          <RealTimeClock />
        </Stack>
      </Box>

      {/* Menu Items */}
      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          ":hover": {
            overflow: "auto",
            ...customStyles.themeScrollbar,
            ...customStyles.themeScrollbarThin,
          },
        }}
      >
        <List>
          {roleLinks?.map((item, index) => {
            if (item?.subItems?.length) {
              const hasActiveChild = item.subItems.some((subItem) =>
                isActive(subItem?.path)
              );
              const isOpen = openCollapse[item.name] || false;
              const disabled = item?.disabled;
              return (
                <Box key={item.name + index}>
                  <Tooltip
                    key={item?.path}
                    title={disabled ? "Coming Soon" : ""}
                    arrow
                    disableInteractive
                  >
                    <Box>
                      <ListItemButton
                        disabled={disabled}
                        onClick={() => {
                          if (!disabled) {
                            toggleCollapse(item.name);
                          }
                        }}
                        sx={{
                          color: hasActiveChild ? "#fff" : "#b0b0b0",
                          backgroundColor: hasActiveChild
                            ? "#252525"
                            : "transparent",
                          borderRadius: "5px",
                          padding: "7px 13px",
                          "&:hover": {
                            backgroundColor: "#333",
                            color: "#fff",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "#252525",
                            boxShadow: "0px 0px 10px rgba(255,255,255,0.1)",
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: hasActiveChild ? "#007BFF" : "#b0b0b0",
                            minWidth: 30,
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.name} />
                        {isOpen ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                    </Box>
                  </Tooltip>
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subItems.map((sub) => renderLink(sub, true))}
                    </List>
                  </Collapse>
                </Box>
              );
            } else {
              return renderLink(item);
            }
          })}
        </List>
      </Box>

      {/* Logout */}
      <Box>
        <ListItemButton
          onClick={() => dispatch(logoutEmployee())}
          sx={{
            color: "#b0b0b0",
            backgroundColor: "#1a1a1a",
            borderRadius: "5px",
            margin: "8px",
            padding: "7px 13px",
            "&:hover": {
              backgroundColor: "#333",
              color: "#fff",
            },
          }}
        >
          <ListItemIcon sx={{ color: "#b0b0b0", minWidth: 30 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Sign out" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {!isMdScreen && (
        <IconButton
          onClick={toggleDrawer}
          sx={{
            position: "fixed",
            top: 8,
            left: 8,
            zIndex: 2000,
            background: "#fff",
            boxShadow: 2,
          }}
        >
          <Menu />
        </IconButton>
      )}

      <Drawer
        variant={isMdScreen ? "permanent" : "temporary"}
        open={isMdScreen || mobileOpen}
        onClose={toggleDrawer}
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backgroundColor: "#000",
            color: "#fff",
            borderRadius: "0px",
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
