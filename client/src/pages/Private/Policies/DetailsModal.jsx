import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import { formatDateStatic } from "../../../utils/dateTime";

const PolicyDetailsModal = ({ policyData, open, onClose }) => {
  if (!policyData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Policy Details</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Title
        </Typography>
        <Typography variant="body2" gutterBottom>
          {policyData?.title}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Date
        </Typography>
        <Typography variant="body2" gutterBottom>
          {formatDateStatic(policyData?.createdAt)}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Policy Link
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
          sx={{
            bgcolor: "#e1e2e3",
            paddingBlock: "10px",
            paddingInline: "5px",
            borderRadius: "5px",
          }}
        >
          <a
            href={policyData?.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "blue",
              fontWeight: "bold",
            }}
          >
            {policyData?.link}
          </a>
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button variant="contained" onClick={onClose} fullWidth>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PolicyDetailsModal;
