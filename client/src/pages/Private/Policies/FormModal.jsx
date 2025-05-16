import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputLabel,
  Grid2,
  MenuItem,
  DialogContentText,
  Select,
  Box,
  Chip,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Stack,
  IconButton,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { getDocumentId } from "../../../utils/toTitleCase";
import { errorMessages } from "../../../apis/messageHandler";
import toast from "react-hot-toast";
import { useGetAllCompaniesQuery } from "../../../apis/company/company";
import { useSelector } from "react-redux";
import {
  useCreatePolicyMutation,
  useUpdatePolicyMutation,
} from "../../../apis/Policy/policy";
import { generateS3FilePath, validateFiles } from "../../../utils/files";
import { Close, Info, Upload } from "@mui/icons-material";
import { EllipsisText } from "../../../theme/styledComponents";

const PolicyModal = ({ initialData, showForm, onClose }) => {
  const userDetails = useSelector((s) => s?.account?.details);
  const isManager = userDetails?.role?.type === 2;
  const managerCompany = userDetails?.user?.company || null;
  const [assignToAll, setAssignToAll] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    control,
    watch,
    setError,
  } = useForm({
    defaultValues: {
      title: "",
      link: "",
      policyFile: "",
      companies: [],
    },
  });

  const { data, isFetching: isCompaniesFetching } = useGetAllCompaniesQuery(
    { isAll: true },
    { skip: isManager }
  );
  const [createPolicy, { isLoading: isCreating }] = useCreatePolicyMutation();
  const [updatePolicy, { isLoading: isUpdating }] = useUpdatePolicyMutation();

  useEffect(() => {
    if (initialData) {
      setValue("title", initialData?.title);
      setValue("link", initialData?.link);
      const companyIds = initialData?.companies?.map(getDocumentId);
      setValue("companies", companyIds);
      setValue("policyFile", initialData?.policyFile || "");
      if (data && companyIds?.length === data.companies?.length) {
        setAssignToAll(true);
      }
    } else {
      reset();
      setAssignToAll(false);
    }
  }, [initialData, data]);

  const handleAssignToAllChange = (event) => {
    const isChecked = event.target.checked;
    setAssignToAll(isChecked);
    if (isChecked) {
      if (!data.companies?.length) {
        toast.error("Companies data not available.");
        return;
      }
      setValue("companies", data.companies.map(getDocumentId));
    } else {
      setValue("companies", initialData?.companies?.map(getDocumentId));
    }
  };

  const handleFileUpload = (event, field) => {
    const files = event.target.files;
    const { valid = false, message } = validateFiles(
      files,
      [
        // Images
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",

        // Documents
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      25
    );
    if (valid) {
      setValue(field, files[0]);
    } else {
      setError("policyFile", { message });
      event.target.value = null;
    }
  };
  const policyFile = watch("policyFile");
  const removeFile = (field) => {
    setValue(field, "");
  };

  const onSubmit = async (data) => {
    const id = getDocumentId(initialData);
    try {
      const payload = {
        title: data.title,
        link: data.link,
        companies: data?.companies,
        file: data?.policyFile instanceof File ? data?.policyFile : "",
        policyFile:
          data?.policyFile instanceof File
            ? initialData?.policyFile
            : data?.policyFile,
      };

      if (id) {
        await updatePolicy({ ...payload, id }).unwrap();
      } else {
        await createPolicy(payload).unwrap();
      }
      reset();
      onClose();
      toast.success("Policy saved successfully!");
    } catch (error) {
      errorMessages(error);
    }
  };

  return (
    <Dialog open={showForm} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        Policy
        <DialogContentText fontSize={14}>
          Provide a concise title, link the policy, and select the companies to
          associate with this policy.
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
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <InputLabel>Policy Link</InputLabel>
            <TextField
              size="small"
              fullWidth
              placeholder="Link"
              {...register("link", {
                validate: (value) => {
                  if (!policyFile && !value)
                    return "Policy link is required if no file is uploaded";
                  return true;
                },
              })}
              error={!!errors.link}
              helperText={errors.link?.message}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <InputLabel>Upload Policy File</InputLabel>
            {policyFile && (
              <Stack direction="row" spacing={1} alignItems="center">
                <EllipsisText color="primary">
                  {typeof policyFile === "string" ? (
                    <a
                      href={generateS3FilePath(policyFile)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {policyFile?.split("/").pop()}
                    </a>
                  ) : (
                    policyFile?.name
                  )}
                </EllipsisText>
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => removeFile("policyFile")}
                >
                  <Close color="error" fontSize="small" />
                </IconButton>
              </Stack>
            )}
            <label htmlFor="policyFile-upload">
              <input
                id="policyFile-upload"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
                hidden
                onChange={(e) => handleFileUpload(e, "policyFile")}
              />
              <Button component="span" startIcon={<Upload />} variant="text">
                Upload file
              </Button>
            </label>
            {errors.policyFile && (
              <FormHelperText error>
                {errors.policyFile?.message}
              </FormHelperText>
            )}
          </Grid2>

          {!isManager && (
            <>
              <Grid2 size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={assignToAll}
                      onChange={handleAssignToAllChange}
                    />
                  }
                  label="Assign to all companies"
                />
              </Grid2>
              {!assignToAll && (
                <Grid2 size={{ xs: 12 }}>
                  <InputLabel>Companies</InputLabel>
                  <Controller
                    name="companies"
                    control={control}
                    rules={{
                      validate: (value) => {
                        if (!assignToAll && (!value || value.length === 0)) {
                          return "At least one company is required or check 'Assign to all companies'";
                        }
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <Select
                          {...field}
                          fullWidth
                          size="small"
                          multiple
                          value={field.value || []}
                          onChange={(event) =>
                            field.onChange(event.target.value)
                          }
                          disabled={isCompaniesFetching || assignToAll}
                          error={!!errors.companies}
                        >
                          {isCompaniesFetching ? (
                            <MenuItem value="" disabled>
                              Loading companies...
                            </MenuItem>
                          ) : (
                            data?.companies?.map((company, idx) => (
                              <MenuItem
                                key={idx}
                                value={getDocumentId(company)}
                              >
                                {company?.name}
                              </MenuItem>
                            ))
                          )}
                        </Select>

                        {/* Display Selected Companies as Chips */}
                        {field.value?.length > 0 && (
                          <Box
                            sx={{
                              mt: 1,
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 1,
                            }}
                          >
                            {field.value.map((id, idx) => {
                              const company = data?.companies?.find(
                                (c) => getDocumentId(c) === id
                              );
                              return company ? (
                                <Chip
                                  key={idx}
                                  label={company?.name}
                                  onDelete={() =>
                                    field.onChange(
                                      field.value.filter(
                                        (selected) => selected !== id
                                      )
                                    )
                                  }
                                />
                              ) : null;
                            })}
                          </Box>
                        )}

                        {errors.companies?.message && (
                          <FormHelperText error>
                            {errors.companies?.message}
                          </FormHelperText>
                        )}
                      </>
                    )}
                  />
                </Grid2>
              )}
            </>
          )}
        </Grid2>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", px: 3, pb: 3 }}>
        <Button
          fullWidth
          disabled={isCreating || isUpdating}
          variant="contained"
          onClick={handleSubmit(onSubmit)}
        >
          Save Policy
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

export default PolicyModal;
