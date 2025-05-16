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
} from "@mui/material";
import { useState } from "react";
import { useIgnoreVoteMutation } from "../../../../apis/Voting/voting";
import { errorMessages } from "../../../../apis/messageHandler";
import toast from "react-hot-toast";

const ConfirmIgnoreDialog = ({ open, onClose, voteId }) => {
  const [reason, setReason] = useState("");
  const [ignoreVote, { isLoading }] = useIgnoreVoteMutation();

  const handleConfirmIgnore = async () => {
    try {
      await ignoreVote({ id: voteId, reason }).unwrap();
      toast.success("Vote ignored successfully");
      onClose();
    } catch (err) {
      errorMessages(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={"xs"}>
      <DialogTitle>Confirm Ignore Vote</DialogTitle>
      <DialogContent>
        <Box>
          <InputLabel>Are you sure you want to ignore this vote?</InputLabel>
          <Stack direction="column" spacing={2}>
            <TextField
              placeholder="Optional"
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
          onClick={handleConfirmIgnore}
          color="secondary"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Confirm Ignore"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmIgnoreDialog;
