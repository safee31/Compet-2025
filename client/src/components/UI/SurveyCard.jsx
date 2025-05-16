import React from "react";
import { Card, CardContent, Typography, Stack, Chip } from "@mui/material";
import {
  SentimentVeryDissatisfiedOutlined,
  SentimentDissatisfiedOutlined,
  SentimentNeutralOutlined,
  SentimentSatisfiedOutlined,
  SentimentVerySatisfiedOutlined,
  DeleteOutline,
  Edit,
} from "@mui/icons-material";
import { formatDateStatic } from "../../utils/dateTime";
import { getMin0Number, toTitleCase } from "../../utils/toTitleCase";
import { PingDot } from "../../theme/styledComponents";

const getSentimentIcon = (score) => {
  if (score >= 4.5) {
    return (
      <SentimentVerySatisfiedOutlined
        sx={{
          fontSize: 50,
          color: "#22c55e",
          boxShadow: 3,
          borderRadius: "100%",
          p: 0,
        }}
      />
    ); // Green - Happy
  } else if (score >= 3.5) {
    return (
      <SentimentSatisfiedOutlined
        sx={{
          fontSize: 50,
          color: "#3b82f6",
          boxShadow: 3,
          borderRadius: "100%",
          p: 0,
        }}
      />
    ); // Blue - Satisfied
  } else if (score >= 2.5) {
    return (
      <SentimentNeutralOutlined
        sx={{
          fontSize: 50,
          color: "#facc15",
          boxShadow: 3,
          borderRadius: "100%",
          p: 0,
        }}
      />
    ); // Yellow - Neutral
  } else if (score >= 1.5) {
    return (
      <SentimentDissatisfiedOutlined
        sx={{
          fontSize: 50,
          color: "#f97316",
          boxShadow: 3,
          borderRadius: "100%",
          p: 0,
        }}
      />
    ); // Orange - Unhappy
  } else {
    return (
      <SentimentVeryDissatisfiedOutlined
        sx={{
          fontSize: 50,
          color: "#ef4444",
          boxShadow: 3,
          borderRadius: "100%",
          p: 0,
        }}
      />
    ); // Red - Terrible
  }
};

const SurveyCard = ({ survey, onClick, handleShowForm, handleDelete }) => {
  return (
    <Card elevation={0}>
      <CardContent>
        <Stack
          direction={"row"}
          gap={1}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
          alignItems={"center"}
          mb={1}
        >
          <Chip
            label={toTitleCase(survey?.status)}
            size="small"
            color={
              survey?.status === "upcoming"
                ? "primary"
                : survey?.status === "expired"
                ? "warning"
                : "success"
            }
          />
          {survey?.status === "inProgress" && <PingDot />}
        </Stack>

        <Stack
          direction={"row"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={1}
        >
          {/* Date */}
          <Typography variant="subtitle2" fontWeight="bold" onClick={onClick}>
            {formatDateStatic(survey?.nextTriggerDate, "MM/DD/YYYY")}
          </Typography>

          <Stack
            direction={"row"}
            flexWrap={"wrap"}
            gap={0.5}
            alignItems={"center"}
          >
            <DeleteOutline
              onClick={handleDelete}
              fontSize="small"
              color="error"
            />
            <Edit
              size="small"
              color="primary"
              fontSize="small"
              onClick={handleShowForm}
            />
          </Stack>
        </Stack>

        {/* Dynamic Sentiment Icon */}
        <Stack justifyContent={"center"} alignItems={"center"} my={2}>
          {getSentimentIcon(survey?.totalAvgScore || 0)}
          <Typography>
            {survey?.targetRole === 2
              ? "Manager"
              : survey?.targetRole === 3
              ? "Employee"
              : "N/A"}
          </Typography>
        </Stack>

        <Stack
          direction={"row"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={1}
        >
          <Stack>
            <Typography align="center">
              {getMin0Number(survey.totalAvgScore)}
            </Typography>
            <Typography color="textSecondary" fontSize={"10px"}>
              Avg. Score
            </Typography>
          </Stack>
          <Stack>
            <Typography align="center">
              {getMin0Number(survey.totalSubmissionsCount)}
            </Typography>
            <Typography
              variant="caption"
              align="center"
              display="block"
              color="textSecondary"
              fontSize={"10px"}
            >
              Total
            </Typography>
          </Stack>
          <Stack>
            <Typography align="center">
              {getMin0Number(survey.totalTerribleCount)}
            </Typography>
            <Typography
              variant="caption"
              align="center"
              display="block"
              color="textSecondary"
              fontSize={"10px"}
            >
              Terrible/Bad
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SurveyCard;
