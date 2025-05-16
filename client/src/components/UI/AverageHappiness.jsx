import React from "react";
import { Card, CardContent, Skeleton, Typography } from "@mui/material";
// 0 - 1.99 → 😡 angry
// 2 - 3.49 → 😞 sad
// 3.5 - 4.49 → 😐 neutral
// 4.5 - 4.99 → 🙂 happy
// 5.0 → 😃 very happy
const computeHappinessType = (type) => {
  if (type === "angry") return "😡";
  else if (type === "sad") return "😞";
  else if (type === "neutral") return "😐";
  else if (type === "happy") return "🙂";
  else if (type === "very happy") return "😃";
};
const AverageHappiness = ({ surveyStats, isLoading }) => {
  if (isLoading)
    return (
      <Skeleton
        variant="rounded"
        width={"100%"}
        height={"100%"}
        animation="wave"
      />
    );
  return (
    <Card>
      <CardContent sx={{ p: 1.5 }}>
        <Typography variant="h6">Average Happiness</Typography>
        <Typography variant="h3" my={2.3}>
          {computeHappinessType(surveyStats?.happinessData?.type)}
        </Typography>
        <Typography variant="body2">Survey&apos;s taken</Typography>
        <Typography fontSize={13}>{surveyStats.noOfSurveysTaken}</Typography>
      </CardContent>
    </Card>
  );
};

export default AverageHappiness;
