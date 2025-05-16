import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import toast from "react-hot-toast";
import { useMarkAccountAsDeletedMutation } from "../apis/Account/account";
import { errorMessages } from "../apis/messageHandler";
import { useSelector } from "react-redux";

const DeleteAccountModal = ({ open, onClose, userId }) => {
  const userDetails = useSelector((s) => s?.account?.details);
  const isAdmin = userDetails?.role?.type === 1;

  const [markAccountAsDeleted, { isLoading: isDeleting }] =
    useMarkAccountAsDeletedMutation();

  const handleConfirmDelete = async () => {
    if (!isAdmin || isDeleting) {
      toast.error("Permission denied.");
      return;
    }
    if (!userId) {
      toast.error("User ID is required");
      return;
    }

    try {
      await markAccountAsDeleted(userId).unwrap();
      toast.success("Account marked as deleted successfully");
      onClose();
    } catch (error) {
      errorMessages(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Account</DialogTitle>

      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to delete this account? This action will:
        </Typography>
        <ul>
          <li>Mark the account as deleted</li>
          <li>Remove the user from all meetings</li>
        </ul>
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
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Confirm Delete"}
        </Button>

        <Button
          variant="outlined"
          fullWidth
          color="text"
          onClick={onClose}
          disabled={isDeleting}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAccountModal;
