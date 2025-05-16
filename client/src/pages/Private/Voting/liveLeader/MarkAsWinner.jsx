import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Stack,
  InputLabel,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { errorMessages } from "../../../../apis/messageHandler";
import toast from "react-hot-toast";
import { useMarkAsOverallWinnerMutation } from "../../../../apis/Voting/voting";

const MarkAsOverallWinnerDialog = ({ open, onClose, userId }) => {
  const [reason, setReason] = useState("");
  const [markAsWinner, { isLoading }] = useMarkAsOverallWinnerMutation();

  const handleMarkAsWinner = async () => {
    try {
      await markAsWinner({ userId, reason }).unwrap();
      toast.success("Successfully marked as overall winner");
      onClose();
    } catch (err) {
      errorMessages(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={"xs"}>
      <DialogTitle>Mark as Overall Winner</DialogTitle>
      <DialogContent>
        <Box>
          <Typography>
            Are you sure you want to mark this user as the overall winner?
          </Typography>
          <Stack direction="column" spacing={2}>
            <TextField
              placeholder="Optional - Provide a reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              fullWidth
              size="small"
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" onClick={onClose} color="text">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleMarkAsWinner}
          color="secondary"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Confirm Mark as Winner"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MarkAsOverallWinnerDialog;
