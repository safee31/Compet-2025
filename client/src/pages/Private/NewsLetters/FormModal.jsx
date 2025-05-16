import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputLabel,
  Grid2,
  DialogContentText,
  IconButton,
  Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";
import {
  useCreateNewsletterMutation,
  useUpdateNewsletterMutation,
} from "../../../apis/NewsLetter/newsLetter";
import toast from "react-hot-toast";
import { validateFiles } from "../../../utils/files";
import { Close, Upload } from "@mui/icons-material";
import { getDocumentId } from "../../../utils/toTitleCase";
import { errorMessages } from "../../../apis/messageHandler";
import { EllipsisText } from "../../../theme/styledComponents";

const NewsLetterModal = ({ initialData, showForm, onClose }) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      videoFile: null,
    },
  });

  const [createNewsletter, { isLoading: isCreating }] =
    useCreateNewsletterMutation();
  const [updateNewsletter, { isLoading: isUpdating }] =
    useUpdateNewsletterMutation();

  useEffect(() => {
    if (initialData) {
      setValue("title", initialData?.title);
      setValue("videoFile", initialData?.videoUrl);
    } else {
      reset();
    }
  }, [initialData, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      const id = getDocumentId(initialData);
      if (id) {
        await updateNewsletter({ id, data }).unwrap();
      } else {
        await createNewsletter(data).unwrap();
      }
      reset();
      onClose();
      toast.success("Newsletter saved successfully!");
    } catch (error) {
      errorMessages(error);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const { valid, message } = validateFiles(
      [file],
      ["video/mp4", "video/mov", "video/avi"],
      50
    );
    if (valid) {
      setValue("videoFile", file);
    } else {
      toast.error(message);
      event.target.value = null;
    }
  };
  const removeFile = () => {
    setValue("videoFile", "");
  };
  const videoUrl = watch("videoFile");
  return (
    <Dialog open={showForm} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {initialData ? initialData?.title : "New Newsletter"}
        <DialogContentText fontSize={14}>
          Please upload a video file. Once uploaded this will become the newest
          newsletter and display on every users homepage.
        </DialogContentText>
      </DialogTitle>
      <DialogContent>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12 }}>
            <InputLabel>Title</InputLabel>
            <TextField
              size="small"
              fullWidth
              required
              placeholder="Title"
              {...register("title", { required: "Title is required" })}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <InputLabel>Newsletter Video </InputLabel>
            <Stack direction="row" spacing={1} alignItems="center">
              <EllipsisText color="primary">
                {typeof videoUrl === "string"
                  ? videoUrl?.split("/").pop()
                  : videoUrl?.name}
              </EllipsisText>
              {videoUrl && (
                <IconButton color="primary" size="small" onClick={removeFile}>
                  <Close color="error" fontSize="small" />
                </IconButton>
              )}
            </Stack>
            <label htmlFor="newsletter-upload">
              <input
                id="newsletter-upload"
                type="file"
                accept="video/*"
                hidden
                onChange={handleFileUpload}
              />
              <Button component="span" startIcon={<Upload />} variant="text">
                Upload file
              </Button>
            </label>
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", px: 3, pb: 3 }}>
        <Button
          fullWidth
          disabled={isCreating || isUpdating}
          variant="contained"
          onClick={handleSubmit(onSubmit)}
        >
          Save
        </Button>
        <Button
          fullWidth
          disabled={isCreating || isUpdating}
          variant="outlined"
          onClick={onClose}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewsLetterModal;
