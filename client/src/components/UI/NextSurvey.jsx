import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Skeleton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useGetNextSurveysDaysQuery } from "../../apis/Analytics/analytics";

const NextSurvey = () => {

  const {data, isLoading} = useGetNextSurveysDaysQuery()
  if (isLoading) return <Skeleton variant="rectangular" width={335} height={220} animation="wave" />;
  return (
    <>
      <Card>
        <CardContent sx={{ p: 1.5 }}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            gap={0.5}
            flexWrap={"wrap"}
          >
            <Typography variant="h6">Next Survey</Typography>
            <IconButton size="small" color="inherit">
              <EditIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Stack my={2}>
            <Typography fontSize={14} color="textSecondary">
              Employee
            </Typography>
            <Typography variant="h5">{data?.employeeSurveyInDays} Days</Typography>
          </Stack>
          <Typography variant="body2">Manager</Typography>
          <Typography fontSize={18} fontWeight={"bold"}>
            {data?.managerSurveyInDays} Days
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default NextSurvey;
