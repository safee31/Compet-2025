import React from "react";
import {
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  Stack,
} from "@mui/material";

const SurveyViewModal = ({ open, onClose, survey, children }) => {
  const responses = survey?.existingSubmission?.responses || [];

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle component={'div'}>
          <Typography variant="h6">My Submitted Survey</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {responses.map((response, index) => (
              <Stack key={index + 1}>
                <Typography variant="subtitle1">
                  {index + 1}. {response?.question?.text || "N/A"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Rating: {["😡", "😟", "😐", "😊", "😁"][response.rating - 1]}
                </Typography>

                <Typography variant="body2" color="textSecondary">
                  Comment: {response?.answer || "N/A"}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" fullWidth onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {children}
    </>
  );
};

export default SurveyViewModal;
