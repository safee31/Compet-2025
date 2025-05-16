import React from "react";
import { Card, Typography, Box, Grid2, Stack, Skeleton } from "@mui/material";
import {
  QuestionAnswer,
  SdCardAlert,
  DocumentScanner,
  Error as ErrorIcon,
} from "@mui/icons-material";

const cardData = [
  {
    icon: <QuestionAnswer fontSize="24" />,
    title: "New Suggestions",
    value: 13,
  },
  {
    icon: <SdCardAlert fontSize="24" />,
    title: "Immediate Issues",
    value: 13,
  },
  { icon: <DocumentScanner fontSize="24" />, title: "New Surveys", value: 13 },
  {
    icon: <ErrorIcon fontSize="24" />,
    title: "Needs Attention",
    value: 13,
  },
];

const AnalyticsCard = ({ data, isLoading, text, icon }) => {
  if (isLoading)
    return (
      <Skeleton
        variant="rounded"
        width={"200px"}
        height={"80px"}
        animation="wave"
      />
    );
  return (
    <Card
      sx={{
        p: 1,
        // display: "flex",
        // alignItems: "start",
        // justifyContent: "start",
        // gap: 1,
      }}
      elevation={1}
    >
      <Stack gap={1}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={0.5}
          flexWrap={"wrap"}
          fontSize={"small"}
        >
          {icon} {text}
        </Stack>
        <Typography variant="h6" fontWeight="bold">
          {data?.count}
        </Typography>
      </Stack>
    </Card>
  );
};

export default AnalyticsCard;
