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

const MeetingDetailsModal = ({ meetingData, open, onClose }) => {
  if (!meetingData) return null;

  console.log("Meeting data", meetingData);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Meeting Details</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Title
        </Typography>
        <Typography variant="body2" gutterBottom>
          {meetingData.title}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Date
        </Typography>
        <Typography variant="body2" gutterBottom>
          {formatDateStatic(meetingData.date)}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Meeting Link
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
            href={meetingData.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "blue",
              fontWeight: "bold",
            }}
          >
            {meetingData.meetingLink}
          </a>
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Notes
        </Typography>
        <Typography variant="body2" gutterBottom>
          {meetingData.notes}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Met With
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {meetingData.attendees?.map((user, index) => (
            <Chip
              key={index}
              label={`${user?.personalInfo?.firstName} 
                          ${user?.personalInfo?.lastName}`}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button variant="contained" onClick={onClose} fullWidth>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MeetingDetailsModal;
