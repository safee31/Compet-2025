import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid2,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { generateS3FilePath } from "../../../../utils/files";
import { SOCKET_IO_CONNECTION } from "../../../../constants";
import DataInfo from "../../../../components/DataInfo";
import { getMin0Number } from "../../../../utils/toTitleCase";
import MarkAsOverallWinnerDialog from "./MarkAsWinner";
import { useSelector } from "react-redux";
import { PingDot } from "../../../../theme/styledComponents";

const socket = io(SOCKET_IO_CONNECTION, { transports: ["websocket"] });

const LiveResult = ({ data: liveWinners }) => {
  const userDetails = useSelector((s) => s?.account?.details);
  const isAdmin = userDetails?.role?.type === 1;
  const [liveData, setLiveData] = useState(null);
  const [selectedWinner, setSelectedWinner] = useState(null);

  useEffect(() => {
    // ✅ Set initial leaderboard data from API
    if (liveWinners) {
      setLiveData(liveWinners.leaderboard);
    }

    // ✅ Listen to real-time updates
    socket.on("voteUpdated", (data) => {
      setLiveData(data.leaderboard); // Replace state with real-time data
    });

    // ✅ Cleanup on unmount
    return () => {
      socket.off("voteUpdated");
    };
  }, [liveWinners]); // Depend on API response

  if (!liveData || !liveData?.overallWinner)
    return (
      <DataInfo message="No session is active right now. A new one will start next month." />
    );

  return (
    <Paper sx={{ borderRadius: "6px", p: 2 }}>
      {selectedWinner && (
        <MarkAsOverallWinnerDialog
          open={Boolean(selectedWinner)}
          onClose={() => setSelectedWinner(null)}
          userId={selectedWinner}
        />
      )}
      <Stack
        direction={"row"}
        flexWrap={"wrap"}
        gap={2}
        alignItems={"center"}
        justifyContent={"space-between"}
        component={"div"}
      >
        <Typography fontSize={18} fontWeight={"bold"}>
          {liveData?.votingSessionDate
            ? new Date(`${liveData.votingSessionDate}-01`).toLocaleString(
                "default",
                {
                  month: "long",
                  year: "numeric",
                }
              )
            : "Live Voting"}
        </Typography>
        <PingDot color="#0E57FF" />
      </Stack>

      {/* Overall Winner Section */}
      <Stack
        direction="row"
        mt={2}
        alignItems="center"
        pb={3}
        component={"div"}
      >
        <Box>
          {/* <img
            src={liveData?.overallWinner?.profileImage || '/default-avatar.png'}
            style={{ height: '50px', width: '50px', borderRadius: '50%' }}
            alt='Winner'
          /> */}
          <Avatar
            src={
              generateS3FilePath(liveData?.overallWinner?.profileImage) ||
              "/default-avatar.png"
            }
            alt={liveData?.overallWinner?.firstName}
          />
        </Box>

        <Stack ml={2} component={"div"}>
          <Typography fontWeight="bold">Overall Leader</Typography>
          <Typography fontSize={14} color="grey">
            {liveData?.overallWinner?.firstName}{" "}
            {liveData?.overallWinner?.lastName}
          </Typography>
          <Typography fontSize={12} color="gray">
            {liveData?.overallWinner?.companyName}
          </Typography>
          <Typography fontSize={12} color="gray">
            Department: {liveData?.overallWinner?.department}
          </Typography>
          <Typography fontSize={12} color="blue">
            Votes: {getMin0Number(liveData?.overallWinner?.votes)}
          </Typography>
        </Stack>
      </Stack>

      {/* Company-wise Winners */}
      <Box mt={2}>
        {liveData?.companyWinners?.map((winner, idx) => (
          <Box
            key={idx + 1}
            mt={2}
            borderBottom={"1px solid lightgrey"}
            pb={1.5}
          >
            <Grid2 container alignItems="center">
              <Grid2 size={{ xs: 12 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={2}
                  component={"div"}
                >
                  <Avatar
                    src={
                      generateS3FilePath(winner.profileImage) ||
                      "/default-avatar.png"
                    }
                    alt={winner?.firstName}
                  />
                  <Stack>
                    <Typography fontSize={14} color="grey">
                      {winner.firstName} {winner.lastName}
                    </Typography>
                    <Typography fontSize={12} color="grey">
                      {winner.companyName}
                    </Typography>
                    <Typography fontSize={12} color="blue">
                      Votes: {getMin0Number(winner.votes)}
                    </Typography>
                    {isAdmin && (
                      <Button
                        sx={{ mt: 1 }}
                        size="small"
                        variant="contained"
                        onClick={() => {
                          setSelectedWinner(winner?.winnerUserId);
                          setModalOpen(true);
                        }}
                      >
                        Mark as Winner
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Grid2>
            </Grid2>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default LiveResult;
