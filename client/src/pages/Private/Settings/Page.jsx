import { Box, Button, Grid2, Typography } from "@mui/material";
import PageHeader from "../../../components/UI/PrivatePageHeader";
import { useState } from "react";
import { useGetActiveAnnouncementsQuery } from "../../../apis/Announcements/announcements";
import AnnouncementModal from "./AnnouncementModal";
import ActiveAnnouncement from "./ActiveAnnouncement";

const Settings = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { data: announcement, isLoading } = useGetActiveAnnouncementsQuery();
  return (
    <Box>
      {/* Announcement Modal */}
      <AnnouncementModal
        open={open}
        handleClose={handleClose}
        announcement={announcement}
      />

      <PageHeader title={"Settings"} menuBar={true} />
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 4, xl: 3 }}>
          <ActiveAnnouncement
            handleOpen={handleOpen}
            announcement={announcement}
            isLoading={isLoading}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Settings;
