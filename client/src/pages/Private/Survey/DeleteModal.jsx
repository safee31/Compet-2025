import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDeleteSurveyMutation } from "../../../apis/Survey/survey";
import { getDocumentId } from "../../../utils/toTitleCase";
import { errorMessages } from "../../../apis/messageHandler";

const DeleteConfirmModal = ({ open, onClose, survey }) => {
  const [deleteSurvey, { isLoading }] = useDeleteSurveyMutation();

  const handleConfirmDelete = async () => {
    if (!survey) return;
    const surveyId = getDocumentId(survey); // Get the document ID

    try {
      await deleteSurvey(surveyId).unwrap();
      onClose(); // Close modal after success
    } catch (error) {
      errorMessages(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Are you sure?</DialogTitle>

      <DialogContent>
        <Typography variant="body1">
          Are you sure you wish to delete this user’s survey?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          flexDirection: "column",
          alignItems: "end",
          gap: 1.5,
        }}
      >
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={handleConfirmDelete}
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete Survey"}
        </Button>

        <Button variant="outlined" color="text" fullWidth onClick={onClose}>
          I changed my mind
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmModal;
