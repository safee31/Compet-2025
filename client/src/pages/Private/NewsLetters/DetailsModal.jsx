import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CardMedia,
} from "@mui/material";
import { generateS3FilePath } from "../../../utils/files";
import DataInfo from "../../../components/DataInfo";

const NewsletterDetailsModal = ({ initialData, open, onClose }) => {
  if (!initialData) return null;
  const { videoUrl = "" } = initialData;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{initialData?.title || "N/A"}</DialogTitle>
      <DialogContent>
        {videoUrl ? (
          <CardMedia
            component="video"
            controls
            src={generateS3FilePath(videoUrl)}
            sx={{ height: 216, width: "100%", borderRadius: 1.5 }}
          />
        ) : (
          <DataInfo message="Video Not Available" />
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button variant="contained" onClick={onClose} fullWidth>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewsletterDetailsModal;
