import { Button, Card, CardContent, Typography } from "@mui/material";
import moment from "moment-timezone";

const VotingSession = ({ handleOpen, data: votingSession }) => {
  //   const { data: votingSession } = useGetVotingSessionQuery();

  // ✅ Convert & Format Deadline in Local Timezone
  const formattedDeadline = votingSession?.deadline
    ? moment(votingSession.deadline).utc().format("MMMM D, YYYY [at] hh:mm A")
    : "N/A";

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

        <Typography variant="body2" fontWeight={"bold"} mt={2}>
          Nominations Remaining
        </Typography>
        <Typography fontWeight={"bold"} color="grey" fontSize={11}>
          {votingSession?.remainingVotes ?? 0}
        </Typography>

        <Button
          sx={{ mt: 3 }}
          variant="contained"
          fullWidth
          onClick={handleOpen}
        >
          Submit Nominations
        </Button>
      </CardContent>
    </Card>
  );
};

export default VotingSession;
