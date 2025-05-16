import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import PersonalTab from "./AccountTabs/PersonalInfo";
import WorkTab from "./AccountTabs/WorkInfo";
import FormsTab from "./AccountTabs/FormInfo";
import OnboardingAnsweredQuestionsPage from "./AccountTabs/Q&A";
import { AccountInfoCard } from "../../../components/UI/AccountInfoCard";

const AccountDetails = ({ accountData, setAccountData = () => {} }) => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box>
      {/* <PageHeader title={"Employee Profile"} menuBar={true} /> */}
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 7, md: 8 }}>
          <Stack gap={2} direction={"row"} flexWrap={"wrap"} mb={2}>
            <Button
              color={tabIndex === 0 ? "primaryLight" : "white"}
              variant="contained"
              onClick={() => setTabIndex(0)}
            >
              Personal
            </Button>

            <Button
              color={tabIndex === 1 ? "primaryLight" : "white"}
              variant="contained"
              onClick={() => setTabIndex(1)}
            >
              Work
            </Button>
            <Button
              color={tabIndex === 2 ? "primaryLight" : "white"}
              variant="contained"
              onClick={() => setTabIndex(2)}
            >
              Forms
            </Button>
            <Button
              color={tabIndex === 3 ? "primaryLight" : "white"}
              variant="contained"
              onClick={() => setTabIndex(3)}
            >
              Q&A
            </Button>
          </Stack>
          <Box>
            {tabIndex === 0 && (
              <PersonalTab
                setAccountData={setAccountData}
                accountData={accountData}
              />
            )}
            {tabIndex === 1 && (
              <WorkTab
                setAccountData={setAccountData}
                accountData={accountData}
              />
            )}
            {tabIndex === 2 && (
              <FormsTab
                setAccountData={setAccountData}
                accountData={accountData}
              />
            )}
            {tabIndex === 3 && (
              <OnboardingAnsweredQuestionsPage accountData={accountData} />
            )}
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 5, md: 4 }}>
          <Stack gap={2}>
            {/* Company Profile Card */}
            <Card>
              <CardContent>
                <Stack
                  direction={"row"}
                  gap={1}
                  alignItems={"center"}
                  flexWrap={"wrap"}
                  mb={2}
                >
                  <Avatar src={""} sx={{ width: 35, height: 35 }} />
                  <Typography variant="body1" fontWeight="bold">
                    H-E-R-BI-E-S
                  </Typography>
                </Stack>
                <Stack mb={2}>
                  <Typography variant="body2">Department Wins:</Typography>
                  <Typography variant="body2"> 0</Typography>
                </Stack>
                <Stack>
                  <Typography variant="body2">Overall Wins</Typography>
                  <Typography variant="body2"> 0</Typography>
                </Stack>
              </CardContent>
            </Card>

            {/* Vacation Days Section */}
            <Card>
              <CardContent>
                <Typography variant="body1" fontWeight="bold" mb={2}>
                  Vacation Days
                </Typography>
                <Stack mb={2}>
                  <Typography variant="body2">Days Spent:</Typography>
                  <Typography variant="body2">23</Typography>
                </Stack>
                <Stack mb={2}>
                  <Typography variant="body2">Days Remaining:</Typography>
                  <Typography variant="body2">18</Typography>
                </Stack>
                <Button fullWidth variant="contained" color="primary">
                  Request Time Off
                </Button>
              </CardContent>
            </Card>

            {/* Employee Info Section */}
            <AccountInfoCard
              accountData={accountData}
              onClose={(newVal) => {
                setAccountData((p) => ({ ...p, hiredAt: newVal }));
              }}
            />
          </Stack>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default AccountDetails;
