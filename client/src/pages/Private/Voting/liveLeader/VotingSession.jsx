import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import { useCalculateWinnerMutation } from "../../../../apis/Voting/voting";
import { errorMessages } from "../../../../apis/messageHandler";
import toast from "react-hot-toast";

const VotingSession = ({ handleOpen, data: votingSession }) => {
  //   const { data: votingSession } = useGetVotingSessionQuery();

  // ✅ Convert & Format Deadline in Local Timezone
  const formattedDeadline = votingSession?.deadline
    ? moment(votingSession.deadline).utc().format("MMMM D, YYYY [at] hh:mm A") // Example: June 24, 2025 at 11:59 PM
    : "No session is active";
  const userDetails = useSelector((s) => s?.account?.details);
  const isAdmin = userDetails?.role?.type === 1;
  const [calculateWinner, { isLoading }] = useCalculateWinnerMutation();
  const handleCalculate = async () => {
    try {
      await calculateWinner().unwrap();
      toast.success("Winner calculated and saved!");
    } catch (error) {
      errorMessages(error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="body1" mb={2}>
          Nomination Period
        </Typography>

        <Typography variant="body2" fontWeight={"bold"}>
          Closing Date
        </Typography>
        <Typography fontWeight={"bold"} color="grey" fontSize={11}>
          {formattedDeadline}
        </Typography>

        {!isAdmin && (
          <>
            <Typography variant="body2" fontWeight={"bold"} mt={2}>
              Nominations Remaining
            </Typography>
            <Typography fontWeight={"bold"} color="grey" fontSize={11}>
              {votingSession?.remainingVotes ?? 0}
            </Typography>
          </>
        )}

        {isAdmin ? (
          votingSession &&
          votingSession?.deadline && (
            <Button
              sx={{ mt: 3 }}
              variant="contained"
              fullWidth
              onClick={handleCalculate}
              disabled={isLoading}
            >
              {isLoading ? "Calculating..." : "Publish Result"}
            </Button>
          )
        ) : (
          <Button
            sx={{ mt: 3 }}
            variant="contained"
            fullWidth
            onClick={handleOpen}
          >
            Submit Nominations
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default VotingSession;
