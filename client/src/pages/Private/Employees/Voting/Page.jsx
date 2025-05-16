import { Avatar, Box, Grid2, Stack, Typography } from "@mui/material";
import { useState } from "react";
import PageHeader from "../../../../components/UI/PrivatePageHeader";
import herbies_image from "../../../../../public/images/herbies.png";
import VotingModal from "./VotingModal";
import VotingSession from "./VotingSession";
// import LiveResult from "./LiveResult";
// import PreviousResult from "./PreviousResult";
import { SpinnerMd } from "../../../../components/Spinner";
import { useGetVotingSessionQuery } from "../../../../apis/Voting/voting";

const EmployeeVotingPage = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // const { data: liveWinners, isLoading: isLiveLoading } =
  //   useGetLiveWinnersQuery();
  const { data: votingSession, isLoading: isSessionLoading } =
    useGetVotingSessionQuery();
  // const { data: previousWinners, isLoading: isPreviousLoading } =
  //   useGetPreviousWinnersQuery({ year: new Date().getFullYear() });

  const isLoading = isSessionLoading;

  return (
    <Box>
      {open && <VotingModal open={open} handleClose={handleClose} />}
      <PageHeader
        title={
          <Stack direction={"row"} alignItems={"center"} gap={1}>
            <Avatar src={herbies_image} sx={{ width: 30, height: 30 }} />
            <Typography>H-E-R-B-I-E-S</Typography>
          </Stack>
        }
        menuBar={true}
      />

      {isLoading ? (
        <SpinnerMd />
      ) : (
        <>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 7, md: 8 }}>
              {/* Live session component */}
              {/* <LiveResult data={liveWinners} /> */}
              {/* Current Year previous data component */}
              {/* <PreviousResult data={previousWinners} /> */}
              <VotingSession handleOpen={handleOpen} data={votingSession} />
            </Grid2>

            {/* <Grid2 size={{ xs: 12, sm: 5, md: 4 }}>
            </Grid2> */}
          </Grid2>
        </>
      )}
    </Box>
  );
};

export default EmployeeVotingPage;
