import React from "react";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  Notifications,
  QuestionAnswer,
  SdCardAlert,
} from "@mui/icons-material";

const PageHeader = ({ title, rightContent, menuBar = false }) => {
  return (
    <Stack
      pb={2.5}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      gap={1.5}
      pl={{ xs: 6, md: 0 }}
    >
      <Box>
        {typeof title === "string" ? (
          <Typography variant="h6" fontWeight={"bold"}>
            {title}
          </Typography>
        ) : (
          title
        )}
      </Box>

      <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center">
        {rightContent && rightContent}
        {menuBar && (
          <>
            <IconButton size="small" sx={{ bgcolor: "#ffff" }}>
              <SdCardAlert color="inherit" fontSize="24" />
            </IconButton>
            <IconButton size="small" sx={{ bgcolor: "#ffff" }}>
              <QuestionAnswer color="inherit" fontSize="24" />
            </IconButton>
            <IconButton size="small" sx={{ bgcolor: "#ffff" }}>
              <Badge variant="dot" color="error">
                <Notifications color="inherit" fontSize="24" />
              </Badge>
            </IconButton>
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default PageHeader;
