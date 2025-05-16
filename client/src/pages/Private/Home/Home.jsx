import React from "react";
import Grid2 from "@mui/material/Grid2";
import { Box, Stack } from "@mui/material";
import PageHeader from "../../../components/UI/PrivatePageHeader";

// Import all the components
import HappinessChart from "../../../components/UI/HappinessChart";
import Newsletter from "../../../components/UI/Newsletter";
import AverageHappiness from "../../../components/UI/AverageHappiness";
import NextHoliday from "../../../components/UI/NextHoliday";
import NextSurvey from "../../../components/UI/NextSurvey";
import AwardWinner from "../../../components/UI/AwardWinner";
import AnalyticsCard from "../../../components/UI/AnalyticCard";
import {
  useGetHappinesDataQuery,
  useGetNewBooksCreatedQuery,
  useGetNewSurveysSubmissionForAdminQuery,
  useGetSurveyStatsForAdminQuery,
} from "../../../apis/Analytics/analytics";
import { DocumentScanner } from "@mui/icons-material";

const Home = () => {
  const { data: happinessData, isLoading: isHappinessDataLoading } =
    useGetHappinesDataQuery();
  const { data: surveyStats, isLoading: isSurveyStatsLoading } =
    useGetSurveyStatsForAdminQuery();
  const {
    data: newSurveySubmissionCount,
    isLoading: isNewSurveySubmissionCount,
  } = useGetNewSurveysSubmissionForAdminQuery();

  const { data: newBooksCreated, isLoading: isNewBookCreateLoading } =
    useGetNewBooksCreatedQuery();
  return (
    <Box>
      <PageHeader title={"Home"} menuBar={true} />
      <Stack gap={2}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 6, sm: 4, md: 4, lg: 3, xl: 2 }}>
            <AnalyticsCard
              data={newSurveySubmissionCount}
              isLoading={isNewSurveySubmissionCount}
              text={"New Surveys"}
              icon={<DocumentScanner fontSize="24" />}
            />
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 4, md: 4, lg: 3, xl: 2 }}>
            <AnalyticsCard
              data={newBooksCreated}
              isLoading={isNewBookCreateLoading}
              text={"New Book & resources"}
              icon={<DocumentScanner fontSize="24" />}
            />
          </Grid2>
        </Grid2>
        <Grid2 container spacing={2}>
          {/* Happiness Chart (Takes More Space) */}
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <HappinessChart
              data={happinessData}
              isLoading={isHappinessDataLoading}
            />
          </Grid2>

          {/* Newsletter (Right Side) */}
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Newsletter />
          </Grid2>
        </Grid2>
        <Grid2 container spacing={2}>
          {/* Responsive Cards (2 per row on small, 4 per row on medium+) */}
          <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <AverageHappiness
              surveyStats={surveyStats}
              isLoading={isSurveyStatsLoading}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <AwardWinner />
          </Grid2>
          {/* <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <NextHoliday isEditable={true} />
          </Grid2> */}
          <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <NextSurvey />
          </Grid2>
        </Grid2>
      </Stack>
    </Box>
  );
};

export default Home;
