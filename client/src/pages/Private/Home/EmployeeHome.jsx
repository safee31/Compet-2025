import React from 'react'
import Grid2 from '@mui/material/Grid2'
import { Alert, Box, Stack, Typography } from '@mui/material'
import PageHeader from '../../../components/UI/PrivatePageHeader'

// Import all the components
import HappinessChart from '../../../components/UI/HappinessChart'
import Newsletter from '../../../components/UI/Newsletter'
import AverageHappiness from '../../../components/UI/AverageHappiness'
import NextHoliday from '../../../components/UI/NextHoliday'
import TodaysSurvey from '../../../components/UI/TodaysSurvey'
import AwardWinner from '../../../components/UI/AwardWinner'
import AnnouncementBanner from '../../../components/AnnouncementBanner'
import { useGetHappinesDataOfCompanyQuery, useGetSurveyStatsForEmployeeQuery } from '../../../apis/Analytics/analytics'
import IncompletedBooksSection from '../Employees/Books/IncompleteBooks'

const EmployeeHome = () => {
  const {data: happinessData, isLoading: isHappinessDataLoading} = useGetHappinesDataOfCompanyQuery()
  const {data: surveyStats, isLoading: isSurveyStatsLoading} = useGetSurveyStatsForEmployeeQuery()


  return (
    <Box>
     <AnnouncementBanner/>
      <PageHeader title={'Home'} menuBar={true} />
      <Stack gap={2}>
        <Grid2 container spacing={2}>
          {/* Responsive Cards (2 per row on small, 4 per row on medium+) */}
          <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <AverageHappiness surveyStats={surveyStats} isLoading={isSurveyStatsLoading}/>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <AwardWinner />
          </Grid2>
          {/* <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <NextHoliday />
          </Grid2> */}
          <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <TodaysSurvey />
          </Grid2>
        </Grid2>
        <Grid2 container spacing={2}>
          {/* Happiness Chart (Takes More Space) */}
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <HappinessChart data={happinessData} isLoading={isHappinessDataLoading}/>
          </Grid2>

          {/* Newsletter (Right Side) */}
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Newsletter />
          </Grid2>
        </Grid2>
        <IncompletedBooksSection header={false}/>
      </Stack>
    </Box>
  )
}

export default EmployeeHome
