import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { useCreateOrUpdateAnnouncemntMutation } from "../../../apis/Announcements/announcements";
import toast from "react-hot-toast";
import { errorMessages } from "../../../apis/messageHandler";

const AnnouncementModal = ({ handleClose, open, announcement }) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [createOrUpdateAnnouncement, { isLoading }] =
    useCreateOrUpdateAnnouncemntMutation();

  useEffect(() => {
    if (announcement) {
      setValue("title", announcement.title || "");
      setValue("description", announcement.description || "");
    }
  }, [announcement, setValue]);

  const onSubmit = async (data) => {
    try {
      await createOrUpdateAnnouncement(data).unwrap();
      toast.success("Announcement updated successfully! 🎉");
      handleClose();
    } catch (error) {
      errorMessages(error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <>
        <DialogTitle component="div">
          <Typography variant="h5" fontWeight={"bold"}>
            Edit Announcement
          </Typography>
          <DialogContentText fontSize={14}>
            These will display as a banner at the top of the user's screen. Once
            they remove the announcement, it will no longer appear for them.
          </DialogContentText>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <InputLabel>Title</InputLabel>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  fullWidth
                  variant="outlined"
                  error={!!errors.title}
                />
              )}
            />
            {errors.title && (
              <FormHelperText error>
                {errors?.title?.message}
              </FormHelperText>
            )}
          </Box>

          {/* Description Input */}
          <InputLabel>Description</InputLabel>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <TextField
                size="small"
                {...field}
                fullWidth
                multiline
                minRows={4}
                maxRows={6}
                variant="outlined"
                error={!!errors.description}
              />
            )}
          />
          {errors.description && (
            <FormHelperText error>
              {errors.description.message}
            </FormHelperText>
          )}
        </DialogContent>

        {/* Buttons */}
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            disabled={isLoading}
            variant="contained"
            fullWidth
            onClick={handleSubmit(onSubmit)}
          >
            {isLoading ? "Submitting..." : "Send Announcement"}
          </Button>
          <Button
            variant="outlined"
            color="text"
            fullWidth
            onClick={handleClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </>
    </Dialog>
  );
};

export default AnnouncementModal;
