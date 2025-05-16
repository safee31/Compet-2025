import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Skeleton,
} from "@mui/material";
import ContainedTabsFilter from "../ContainedTabs"; // Reusable toggle buttons
import { getMin0Number } from "../../utils/toTitleCase";
const computeHappinessType = (type) => {
  if (type === "angry") return "😡";
  else if (type === "sad") return "😞";
  else if (type === "neutral") return "😐";
  else if (type === "happy") return "🙂";
  else if (type === "very happy") return "😃";
};
const HappinessChart = ({ title = "Happiness", data, isLoading }) => {
  const [period, setPeriod] = useState("week");
  const getEmojiForValue = (value) => {
    if (value <= 20) return "😡"; // Angry
    if (value <= 40) return "😟"; // Sad
    if (value <= 60) return "😐"; // Neutral
    if (value <= 80) return "🙂"; // Happy
    return "😃"; // Very Happy
  };
  const happinessData = {
    day: [
      { type: "angry", value: 20 },
      { type: "sad", value: 30 },
      { type: "neutral", value: 15 },
      { type: "happy", value: 25 },
      { type: "very happy", value: 100 },
    ],
    week: [
      { type: "angry", value: 20 },
      { type: "sad", value: 30 },
      { type: "neutral", value: 15 },
      { type: "happy", value: 25 },
      { type: "very happy", value: 100 },
    ],
    month: [
      { type: "angry", value: 20 },
      { type: "sad", value: 30 },
      { type: "neutral", value: 15 },
      { type: "happy", value: 25 },
      { type: "very happy", value: 100 },
    ],
  };

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
      <CardContent sx={{ pb: 0 }}>
        <Stack
          mb={3}
          direction="row"
          alignItems="center"
          gap={1}
          flexWrap="wrap"
          justifyContent="space-between"
        >
          <Typography variant="h6">{title}</Typography>
          <ContainedTabsFilter value={period} onChange={setPeriod} />
        </Stack>

        {/* Bar Chart */}
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2,flexWrap:'wrap' }}>
          {data[period]?.map((item, index) => (
            <Stack key={index} sx={{ alignItems: "center" }}>
              {/* Progress Bar */}
              <Box
                sx={{
                  minHeight: 150,
                  width: 38,
                  position: "relative",
                  backgroundColor: "#E1E2E3CC",
                  borderRadius: 1.5,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: `${item?.value}%`,
                    position: "absolute",
                    bottom: item.value > 10 ? 2 : 0,
                    backgroundColor: "primary.main",
                    transition: "height 0.5s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  <Typography
                    component={"span"}
                    color={getMin0Number(item?.value) <= 5 ? "error" : "white"}
                    fontSize={"12px"}
                    pb={getMin0Number(item?.value) <= 5 ? 2.5 : 0}
                  >
                    {item.value}%
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h4" mt={1}>
                {computeHappinessType(item?.type)}
              </Typography>
            </Stack>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default HappinessChart;
