import { Alert, AlertTitle, Collapse, Stack, Typography } from "@mui/material";
import {
  useDismissAnnouncementMutation,
  useGetActiveAnnouncementsForEmployeeMangerQuery,
} from "../apis/Announcements/announcements";

const AnnouncementBanner = () => {
  const { data: announcement, isLoading } =
    useGetActiveAnnouncementsForEmployeeMangerQuery();
  const [dismissAnnouncement, { isLoading: isDismissing }] =
    useDismissAnnouncementMutation();

  if (announcement)
    return (
      // <Collapse in={!!announcement?.title}>
      <Alert
        icon={false}
        variant="filled"
        onClose={() => {
          dismissAnnouncement();
        }}
        // color="primary"
        sx={{ marginBottom: "1.2rem" }}
        severity="info"
      >
        <AlertTitle>{announcement?.title}</AlertTitle>
        {announcement?.description}
      </Alert>
      // </Collapse>
    );
};

export default AnnouncementBanner;
