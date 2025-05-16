import { Box, Grid2 } from "@mui/material";
import { useState } from "react";
import VotingModal from "./VotingModal";
import VotingSession from "./VotingSession";
import LiveResult from "./LiveResult";
import PreviousResult from "./PreviousResult";
import {
  useGetLiveWinnersQuery,
  useGetPreviousWinnersQuery,
  useGetVotingSessionQuery,
} from "../../../../apis/Voting/voting";
import { SpinnerMd } from "../../../../components/Spinner";

const VotingPage = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { data: liveWinners, isLoading: isLiveLoading } =
    useGetLiveWinnersQuery();
  const { data: votingSession, isLoading: isSessionLoading } =
    useGetVotingSessionQuery();
  const { data: previousWinners, isLoading: isPreviousLoading } =
    useGetPreviousWinnersQuery({ year: new Date().getFullYear() });

  const isLoading = isLiveLoading || isSessionLoading || isPreviousLoading;

  return (
    <Box>
      {open && <VotingModal open={open} handleClose={handleClose} />}

      {isLoading ? (
        <SpinnerMd />
      ) : (
        <>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 7, md: 8 }}>
              {/* Live session component */}
              <LiveResult data={liveWinners} />
              {/* Current Year previous data component */}
              <PreviousResult data={previousWinners} />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 5, md: 4 }}>
              <VotingSession handleOpen={handleOpen} data={votingSession} />
            </Grid2>
          </Grid2>
        </>
      )}
    </Box>
  );
};

export default VotingPage;
