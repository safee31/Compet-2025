import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import Sidebar from "./SideBar";
import { MainSection } from "../theme/styledComponents";

const PrivateLayout = ({ children }) => {
  const isMdScreen = useMediaQuery("(min-width:900px)");

  return (
    <Box height="100%" position="relative">
      <Sidebar />
      <MainSection component="main" sx={{ ml: isMdScreen ? "253px" : "0px", mt: 1 }}>
        {children}
      </MainSection>
    </Box>
  );
};

export default PrivateLayout;
