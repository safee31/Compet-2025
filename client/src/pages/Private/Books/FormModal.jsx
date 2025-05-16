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
  Box,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import {
  useCreateBookMutation,
  useUpdateBookMutation,
} from "../../../apis/Book/book";
import { getDocumentId } from "../../../utils/toTitleCase";
import { errorMessages } from "../../../apis/messageHandler";
import toast from "react-hot-toast";
import { useUploadFilesMutation } from "../../../apis/Files/pdf";
import {
  createFormData,
  generateS3FilePath,
  validateFiles,
} from "../../../utils/files";
import { convertAndCompressImages } from "../../../utils/image";
import { PhotoCamera, Wallpaper } from "@mui/icons-material";
import { API_BASE_URL } from "../../../constants";

const BookModal = ({ initialData, showForm, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      author: "",
      description: "",
      imageUrl: "",
    },
  });

  const [createBook, { isLoading: isCreating }] = useCreateBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();

  useEffect(() => {
    if (initialData) {
      setValue("title", initialData?.title);
      setValue("author", initialData?.author);
      setValue("description", initialData?.description);
      setValue("bookImage", initialData?.imageUrl);
    } else {
      reset();
    }
  }, [initialData, reset, setValue]);

  const onSubmit = async (data) => {
    const id = getDocumentId(initialData);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("description", data.description);
    if (data.bookImage?.file instanceof File) {
      formData.append("imageData", data.bookImage.file);
    }
    try {
      if (id) {
        await updateBook({ formData, id }).unwrap();
      } else {
        await createBook(formData).unwrap();
      }
      reset();
      onClose();
      toast.success("Book saved successfully!");
    } catch (error) {
      errorMessages(error);
    }
  };

  const handleFileUpload = (event, field) => {
    const files = event.target.files;
    const file = files[0];
    const { valid = false, message } = validateFiles(
      files,
      ["image/webp", "image/jpeg", "image/jpg", "image/png"],
      3,
      { width: 100, height: 150 }
    );
    if (valid) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setValue(field, { base64, file });
      };
      reader.readAsDataURL(file);
    } else {
      toast.error(message);
      event.target.value = null;
      event.target.files = [];
    }
  };

  const bookImage = watch("bookImage");

  return (
    <Dialog open={showForm} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{initialData ? "Edit Book" : "Create Book"}</DialogTitle>
      <DialogContent>
        <Grid2 container spacing={1.5}>
          <Grid2 size={{ xs: 12 }}>
            {bookImage?.base64 || bookImage ? (
              <label htmlFor="image-upload">
                <Stack
                  sx={{
                    width: 160,
                    height: 180,
                    cursor: "pointer",
                    my: 2,
                  }}
                  mx={"auto"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <input
                    disabled={isCreating || isUpdating}
                    id="image-upload"
                    type="file"
                    accept=".png, .jpg, .webp, .jpeg"
                    hidden
                    onChange={(e) => handleFileUpload(e, "bookImage")}
                  />
                  <Box
                    sx={{
                      width: 160,
                      height: 180,
                      objectFit: "cover",
                      borderRadius: 1.5,
                      cursor: "pointer",
                      boxShadow: 2,
                    }}
                    mx={"auto"}
                    component="img"
                    src={bookImage?.base64 || generateS3FilePath(bookImage)}
                  />
                </Stack>
              </label>
            ) : (
              <label htmlFor="upload-book-image">
                <Stack
                  sx={{
                    width: 160,
                    height: 180,
                    cursor: "pointer",
                    outline: "1px solid grey",
                    my: 2,
                    borderRadius: "6px",
                    p: 2,
                  }}
                  mx={"auto"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <input
                    disabled={isCreating || isUpdating}
                    id="upload-book-image"
                    type="file"
                    accept=".png, .jpg, .webp, .jpeg"
                    hidden
                    onChange={(e) => handleFileUpload(e, "bookImage")}
                  />
                  <IconButton
                    sx={{ bgcolor: "primaryLight.main" }}
                    color="primary"
                  >
                    <Wallpaper fontSize="medium" />
                  </IconButton>
                  <Typography variant="body2">Add Image</Typography>
                </Stack>
              </label>
            )}
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <InputLabel>Title</InputLabel>
            <TextField
              size="small"
              fullWidth
              required
              placeholder="Title"
              {...register("title", { required: "Title is required" })}
              sx={{ mb: 2 }}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <InputLabel>Author</InputLabel>
            <TextField
              size="small"
              fullWidth
              required
              placeholder="Author"
              {...register("author", { required: "Author is required" })}
              sx={{ mb: 2 }}
              error={!!errors.author}
              helperText={errors.author?.message}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <InputLabel>Description</InputLabel>
            <TextField
              size="small"
              fullWidth
              multiline
              rows={3}
              placeholder="Description"
              {...register("description", {
                required: "Description is required",
              })}
              sx={{ mb: 2 }}
            />
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
          color="text"
          onClick={onClose}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookModal;
