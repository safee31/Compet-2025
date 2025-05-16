import React from "react";
import Dialog from "@mui/material/Dialog";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { generateS3FilePath } from "../../../../utils/files";
import { formatDateTimeFromISO } from "../../../../utils/dateTime";

export default function ViewBookModal({ open, handleClose, book }) {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle component={"div"}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#2c3e50", mb: 1 }}
        >
          {book.title}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ textAlign: "center" }}>
          <Box
            component="img"
            src={generateS3FilePath(book.imageUrl)}
            alt="Harry Potter Cover"
            sx={{
              width: 200,
              height: 220,
              borderRadius: 2,
              boxShadow: 3,
              objectFit: "cover",
              marginBottom: 2,
            }}
          />

          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#2c3e50", mb: 1 }}
          >
            {book.title}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ fontStyle: "italic", color: "#7f8c8d", mb: 1 }}
          >
            — {book.author}
          </Typography>

          {book.completedAt && (
            <Typography
              variant="body2"
              sx={{ color: "#34495e", fontWeight: "500", mb: 2 }}
            >
              Completed on:{" "}
              {formatDateTimeFromISO(book.completedAt, {
                year: "numeric",
                month: "short",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
                day: "numeric",
              })}
            </Typography>
          )}
        </Box>
        <DialogContentText>{book.description}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          variant="contained"
          // fullWidth
          color="primary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
