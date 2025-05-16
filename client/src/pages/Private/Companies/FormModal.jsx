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
  Avatar,
} from "@mui/material";
import { useForm } from "react-hook-form";
import {
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} from "../../../apis/company/company";
import { getDocumentId } from "../../../utils/toTitleCase";
import { errorMessages } from "../../../apis/messageHandler";
import toast from "react-hot-toast";
import { generateS3FilePath, validateFiles } from "../../../utils/files";

const CompanyModal = ({ initialData, showForm, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      address: "",
      logo: "",
    },
  });

  const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();

  useEffect(() => {
    if (initialData) {
      setValue("name", initialData?.name);
      setValue("address", initialData?.address);
      setValue("logo", initialData?.logo);
    } else {
      reset();
    }
  }, [initialData]);

  const onSubmit = async (data) => {
    const id = getDocumentId(initialData);
    const imgFile = data?.logo?.file;
    if (imgFile instanceof File) {
      data.imageData = imgFile;
    }
    data.logo = initialData?.logo;
    try {
      if (id) {
        await updateCompany({ ...data, id }).unwrap();
      } else {
        await createCompany(data).unwrap();
      }
      reset();
      onClose();
      toast.success("Company saved successfully!");
    } catch (error) {
      errorMessages(error);
    }
  };
  const handleFileUpload = (event, field) => {
    const files = event.target.files;
    const file = event.target.files[0];
    const { valid = false, message } = validateFiles(
      files,
      ["image/webp", "image/jpeg", "image/jpg", "image/png"],
      3
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
  const logo = watch("logo");

  return (
    <Dialog open={showForm} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {initialData ? "Edit Company" : "Create Company"}
      </DialogTitle>
      <DialogContent>
        <Grid2 container spacing={1.5}>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <InputLabel>Logo</InputLabel>
            <label htmlFor="logo-upload">
              <input
                disabled={isCreating || isUpdating}
                id="logo-upload"
                type="file"
                accept=".png, jpg, .webp, .jpeg"
                hidden
                onChange={(e) => handleFileUpload(e, "logo")}
              />
              <Avatar
                sx={{
                  cursor: "pointer",
                  mb: 2,
                  width: 50,
                  height: 50,
                }}
                variant="rounded"
                src={logo?.base64 || generateS3FilePath(logo)}
                alt={initialData?.name || "Logo"}
              />
            </label>
          </Grid2>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <InputLabel>Name</InputLabel>
          <TextField
            size="small"
            fullWidth
            required
            placeholder="Name"
            {...register("name", { required: "Name is required" })}
            sx={{ mb: 2 }}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <InputLabel>Address</InputLabel>
          <TextField
            size="small"
            fullWidth
            placeholder="Address"
            required
            {...register("address", { required: "Address is required" })}
            error={!!errors.address}
            helperText={errors.address?.message}
          />
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

export default CompanyModal;
