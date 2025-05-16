import React from "react";
import { Box, Typography, IconButton, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SurveyQuestion from "../../../components/UI/SurveyQuestion";
import ListItem from "../../../components/UI/ListItem";
import DataInfo from "../../../components/DataInfo";
import { getMin0Number } from "../../../utils/toTitleCase";
import { formatDateStatic } from "../../../utils/dateTime";

const SurveyDetails = ({ response, survey, onBack }) => {
  return (
    <Stack gap={2}>
      <Box display="flex" alignItems="center">
        <IconButton onClick={onBack} color="disabled">
          <ArrowBackIcon />
        </IconButton>
        <Typography fontWeight="bold" color="textPrimary">
          Back to Results
        </Typography>
      </Box>
      <Box>
        <ListItem
          fields={[
            {
              label: "Name",
              render: `${response?.user?.personalInfo?.firstName} ${response?.user?.personalInfo?.lastName}`,
              ellipses: true,
            },
            {
              label: "Company",
              render: survey?.company?.name,
              ellipses: true,
            },
            {
              label: "Date",
              render: formatDateStatic(response?.submittedAt),
            },
            {
              label: "Avg Score",
              render: getMin0Number(response?.avgScore),
            },
          ]}
        />
      </Box>
      <Box>
        <Typography fontWeight="bold" variant="h6" mb={1}>
          Questions
        </Typography>
        {response?.responses?.length > 0 ? (
          <Stack gap={1.5}>
            {response?.responses?.map((response, index) => {
              return (
                <SurveyQuestion
                  key={index}
                  question={{
                    ...response?.question,
                    answer: response?.answer,
                    rating: response?.rating,
                  }}
                  index={index}
                />
              );
            })}
          </Stack>
        ) : (
          <DataInfo />
        )}
      </Box>
    </Stack>
  );
};

export default SurveyDetails;
