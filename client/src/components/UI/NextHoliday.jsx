import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const NextHoliday = ({ isEditable = false }) => {
  return (
    <Card>
      <CardContent sx={{ p: 1.5 }}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={0.5}
          flexWrap={"wrap"}
        >
          <Typography variant="h6">Next Holiday</Typography>
          {isEditable ? (
            <IconButton size="small" color="inherit">
              <EditIcon fontSize="small" />
            </IconButton>
          ) : (
            <></>
          )}
        </Stack>
        <Stack my={2.5}>
          <Typography fontSize={14} color="textSecondary">
            4th of July
          </Typography>
          <Typography variant="h5">14 Days</Typography>
        </Stack>
        <Typography variant="body2">Upcoming</Typography>
        <Typography fontSize={13}>Halloween (Oct 31) </Typography>
      </CardContent>
    </Card>
  );
};

export default NextHoliday;
