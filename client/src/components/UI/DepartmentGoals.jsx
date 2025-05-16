import React from "react";
import Grid2 from "@mui/material/Grid2";
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  IconButton,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

const goalsData = [
  { name: "CSA Watch", achieved: 1874, total: 2565 },
  { name: "CSA Watch", achieved: 1874, total: 2565 },
  { name: "CSA Watch", achieved: 1874, total: 2565 },
  { name: "CSA Watch", achieved: 1874, total: 2565 },
];

const DepartmentGoals = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Department Goals
        </Typography>
        <Grid2 container spacing={2}>
          {goalsData.map((goal, index) => (
            <Grid2 xs={12} sm={6} key={index}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="body2">{goal.name}</Typography>
                <IconButton size="small">
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(goal.achieved / goal.total) * 100}
                sx={{ height: 8, borderRadius: 5, my: 1 }}
              />
              <Typography variant="body2" fontWeight="bold">
                {goal.achieved.toLocaleString()} / {goal.total.toLocaleString()}
              </Typography>
            </Grid2>
          ))}
        </Grid2>
      </CardContent>
    </Card>
  );
};

export default DepartmentGoals;
