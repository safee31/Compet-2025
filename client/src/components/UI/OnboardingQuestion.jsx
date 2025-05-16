import React from "react";
import { Box, Typography } from "@mui/material";

const OnbaordingQuestion = ({ question, index }) => {
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
          {question?.questionSnapshot}
        </Typography>
        {/* <Typography variant="body2" color="gray">
          Answer:
        </Typography> */}
        <Typography fontSize={"12px"} color="gray">
          {question?.answer || "None"}
        </Typography>
      </Box>
    </Box>
  );
};

export default OnbaordingQuestion;
