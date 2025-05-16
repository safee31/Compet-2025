import React, { useState } from "react";
import { Card, CardContent, Typography, Button, Skeleton } from "@mui/material";
import { useGetEmpSurveyOfTodayQuery } from "../../apis/Survey/survey";
import SurveyBeginModalWrapper from "./SurveyBeginModal";
import SurveyViewModal from "./ViewSubmitedSurvey";

const TodaysSurvey = () => {
  const [openBegin, openBeginSet] = useState(false);
  const [openViewSurvey, openViewSurveySet] = useState(false);
  const { data, isFetching } = useGetEmpSurveyOfTodayQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );
  const survey = data?.data;

  if (isFetching)
    return (
      <Skeleton
        variant="rounded"
        width={"100%"}
        height={"100%"}
        animation="wave"
      />
    );

  // If no survey is found, return nothing
  if (!survey)
    return (
      <Card>
        <CardContent sx={{ p: 1.5, bgcolor: "grey.500" }}>
          <Typography color="white" variant="h6">
            No Survey Available
          </Typography>
          <Typography variant="body2" color="white" my={2.5}>
            There is no survey for today. Please check back tomorrow!
          </Typography>
        </CardContent>
      </Card>
    );

  // If survey is found and action is 'Begin', show the survey card
  if (survey?.action === "Begin") {
    return (
      <Card>
        <CardContent sx={{ p: 1.5, bgcolor: "primary.main" }}>
          <Typography color="white" variant="h6">
            New Survey!
          </Typography>
          <Typography variant="body2" color="white" mt={1.5} mb={5.5}>
            There is a new survey available to take. Click below to begin.
          </Typography>
          <SurveyBeginModalWrapper
            survey={survey}
            open={openBegin}
            onClose={() => openBeginSet(false)}
          >
            <Button
              variant="contained"
              onClick={() => openBeginSet(true)}
              color="white"
              fullWidth
            >
              Begin Survey
            </Button>
          </SurveyBeginModalWrapper>
        </CardContent>
      </Card>
    );
  }

  // If the survey has already been submitted
  return (
    <Card>
      <CardContent sx={{ p: 1.5 }}>
        <Typography variant="h6">Survey Complete</Typography>
        <Typography variant="body2" mt={1.5} mb={5.5}>
          You have already submitted the survey for today.
        </Typography>
        <SurveyViewModal
          survey={survey}
          onClose={() => openViewSurveySet(false)}
          open={openViewSurvey}
        >
          <Button
            variant="outlined"
            onClick={() => openViewSurveySet(true)}
            color="text"
            fullWidth
          >
            View My Survey
          </Button>
        </SurveyViewModal>
      </CardContent>
    </Card>
  );
};

export default TodaysSurvey;
