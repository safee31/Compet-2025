import {
  Button,
  Card,
  CardActions,
  CardContent,
  Skeleton,
  Typography,
} from "@mui/material";

const ActiveAnnouncement = ({ handleOpen, announcement, isLoading }) => {
  if (isLoading)
    return (
      <Skeleton variant="rounded" width="250px" height={"220px"}></Skeleton>
    );

  return (
    <Card>
      <CardContent>
        <Typography fontWeight={"bold"} fontSize="20px" mb={1}>
          Announcements
        </Typography>

        <Typography variant="body1">Title</Typography>
        <Typography variant="body2" mb={1} color="textSecondary">
          {announcement?.title || "No announcement yet"}
        </Typography>

        <Typography variant="body1">Description</Typography>
        <Typography variant="body2" color="textSecondary">
          {announcement?.description || "No announcement available"}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="primaryLight"
          fullWidth
          onClick={handleOpen}
        >
          Edit
        </Button>
      </CardActions>
    </Card>
  );
};

export default ActiveAnnouncement;
