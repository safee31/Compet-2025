import { useState } from "react";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import LiveLeader from "./liveLeader/Page";
import herbies_image from "../../../../public/images/herbies.png";
import VotingLogs from "./votingLogs/LogsPage";
import PageHeader from "../../../components/UI/PrivatePageHeader";

const VotingPage = () => {
  const [tabIndex, setTabIndex] = useState(1);

  return (
    <Box>
      <PageHeader
        title={
          <Stack direction={"row"} alignItems={"center"} gap={1}>
            <Avatar src={herbies_image} sx={{ width: 30, height: 30 }} />
            <Typography>H-E-R-B-I-E-S</Typography>
          </Stack>
        }
        menuBar={true}
      />
      <Stack gap={2} direction="row" flexWrap="wrap" mb={2}>
        <Button
          color={tabIndex === 1 ? "primaryLight" : "white"}
          variant="contained"
          onClick={() => setTabIndex(1)}
        >
          Live Leader
        </Button>
        <Button
          color={tabIndex === 2 ? "primaryLight" : "white"}
          variant="contained"
          onClick={() => setTabIndex(2)}
        >
          Voting Logs
        </Button>
      </Stack>

      {tabIndex === 1 && <LiveLeader />}
      {tabIndex === 2 && <VotingLogs />}
    </Box>
  );
};

export default VotingPage;
