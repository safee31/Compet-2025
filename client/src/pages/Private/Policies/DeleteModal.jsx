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
import { useDeletePolicyMutation } from "../../../apis/Policy/policy";
import { getDocumentId } from "../../../utils/toTitleCase";
import { errorMessages } from "../../../apis/messageHandler";

const DeleteConfirmModal = ({ open, onClose, policy }) => {
  const [deletePolicy, { isLoading }] = useDeletePolicyMutation();

  const handleConfirmDelete = async () => {
    if (!policy) return;
    const policyId = getDocumentId(policy); // Get the document ID

    try {
      await deletePolicy(policyId).unwrap();
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
          Are you sure you wish to delete this policy? This action cannot be
          undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ flexDirection: "column", gap: 2, px: 3, pb: 3 }}>
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={handleConfirmDelete}
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete policy"}
        </Button>

        <Button variant="contained" color="text" fullWidth onClick={onClose}>
          I changed my mind
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmModal;
