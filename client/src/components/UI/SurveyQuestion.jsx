import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { EmojiEmotions } from "@mui/icons-material";
import { getMin0Number } from "../../utils/toTitleCase";

const SurveyQuestion = ({ question, index }) => {
  return (
    <Box
      display={"flex"}
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"start"}
      gap={1}
      flexWrap={"wrap"}
      p={1}
      borderRadius={2}
      sx={{ bgcolor: "background.paper", boxShadow: 1 }}
    >
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">
          <Typography component={"span"} color="success">
            Q{index + 1}:
          </Typography>{" "}
          {question?.text}
        </Typography>
        <Typography variant="body2" color="gray">
          Answer:
        </Typography>
        <Typography fontSize={"12px"} color="gray">
          {question?.answer || "None"}
        </Typography>
      </Box>

      <Stack
        direction={"row"}
        alignItems={"center"}
        variant="h6"
        fontWeight="bold"
        gap={1}
      >
        {getMin0Number(question?.rating)}/5{" "}
        {["😡", "😟", "😐", "😊", "😁"][question.rating - 1]}
      </Stack>
    </Box>
  );
};

export default SurveyQuestion;
