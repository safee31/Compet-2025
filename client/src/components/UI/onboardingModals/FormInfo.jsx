import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  TextField,
  Button,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Grid2,
  Stack,
  IconButton,
} from "@mui/material";
import { getDocumentId } from "../../../utils/toTitleCase";
import { errorMessages } from "../../../apis/messageHandler";
import { useUpdateEmployeeMutation } from "../../../apis/Employee/employee";
import { validateFiles } from "../../../utils/files";
import { Close, Upload } from "@mui/icons-material";
import { EllipsisText } from "../../../theme/styledComponents";

const FormsInfoModal = ({
  accountData,
  formInfo,
  onClose,
  open,
  handleUpdatedData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm();

  const [updateEmployee, { isLoading: isUpdating }] =
    useUpdateEmployeeMutation();

  const onSubmit = async (data) => {
    try {
      const accountId = getDocumentId(accountData);
      const douments = {};
      if (data?.driversLicense instanceof File) {
        douments.driversLicense = data?.driversLicense;
        delete data.driversLicense;
      }

      if (data?.w4 instanceof File) {
        douments.w4 = data?.w4;
        delete data.w4;
      }

      if (accountId) {
        const { data: updated = null } = await updateEmployee({
          form: data,
          ...douments,
          accountId,
        }).unwrap();
        handleUpdatedData(updated?.updatedForm);
      }
      onClose();
    } catch (err) {
      errorMessages(err);
    }
  };

  useEffect(() => {
    if (formInfo) {
      const formFields = {
        bankName: formInfo?.bankName || "",
        accountNumber: formInfo?.accountNumber || "",
        reAccountNumber: formInfo?.accountNumber || "",
        routingNumber: formInfo?.routingNumber || "",
        reRoutingNumber: formInfo?.routingNumber || "",
        socialSecurityNumber: formInfo?.socialSecurityNumber || "",
        driversLicense: formInfo?.driversLicense || "",
        w4: formInfo?.w4 || "",
        policyAcknowledgment: formInfo?.policyAcknowledgment || false,
      };

      Object.keys(formFields).forEach((key) => {
        setValue(key, formFields[key]);
      });
    }
  }, [formInfo, setValue]);

  const handleFileUpload = (event, field) => {
    const files = event.target.files;
    const { valid = false, message } = validateFiles(files);
    if (valid) {
      setValue(field, files[0]);
    } else {
      alert(message);
      event.target.value = null;
      event.target.files = [];
    }
  };

  const removeFile = (field) => {
    setValue(field, "");
  };

  const w4Form = watch("w4");
  const driversLicense = watch("driversLicense");
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Bank & Forms Info</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid2 container spacing={2}>
            {/* Authorization Form Link */}
            <Grid2 size={{ xs: 12 }}>
              <InputLabel>Authorization Form</InputLabel>
              {[driversLicense, w4Form].map((field, idx) => (
                <React.Fragment key={idx + 1}>
                  {field && (
                    <Stack
                      key={idx + 1}
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <EllipsisText color="primary">
                        {typeof field === "string"
                          ? field?.split("/").pop()
                          : field?.name}
                      </EllipsisText>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() =>
                          removeFile(idx === 0 ? "driversLicense" : "w4")
                        }
                      >
                        <Close color="error" fontSize="small" />
                      </IconButton>
                    </Stack>
                  )}
                </React.Fragment>
              ))}
            </Grid2>

            {/* Bank Name */}
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel>Bank Name</InputLabel>
              <TextField
                size="small"
                fullWidth
                {...register("bankName", { required: "Bank name is required" })}
                error={!!errors.bankName}
                helperText={errors.bankName?.message}
              />
            </Grid2>

            {/* Account Number */}
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel>Account Number</InputLabel>
              <TextField
                size="small"
                fullWidth
                {...register("accountNumber", {
                  required: "Account number is required",
                })}
                error={!!errors.accountNumber}
                helperText={errors.accountNumber?.message}
              />
            </Grid2>

            {/* Re-enter Account Number */}
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel>Re-enter Account Number</InputLabel>
              <TextField
                size="small"
                fullWidth
                {...register("reAccountNumber", {
                  required: "Re-entering account number is required",
                })}
                error={!!errors.reAccountNumber}
                helperText={errors.reAccountNumber?.message}
              />
            </Grid2>

            {/* Routing Number */}
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel>Routing Number</InputLabel>
              <TextField
                size="small"
                fullWidth
                {...register("routingNumber", {
                  required: "Routing number is required",
                })}
                error={!!errors.routingNumber}
                helperText={errors.routingNumber?.message}
              />
            </Grid2>

            {/* Re-enter Routing Number */}
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel>Re-enter Routing Number</InputLabel>
              <TextField
                size="small"
                fullWidth
                {...register("reRoutingNumber", {
                  required: "Re-entering routing number is required",
                })}
                error={!!errors.reRoutingNumber}
                helperText={errors.reRoutingNumber?.message}
              />
            </Grid2>

            {/* Social Security Number */}
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel>Social Security Number</InputLabel>
              <TextField
                size="small"
                fullWidth
                type="password"
                {...register("socialSecurityNumber", {
                  required: "Social security number is required",
                })}
                error={!!errors.socialSecurityNumber}
                helperText={errors.socialSecurityNumber?.message}
              />
            </Grid2>

            {/* Drivers License */}
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel>Drivers License</InputLabel>
              <label htmlFor="driversLicense-upload">
                <input
                  id="driversLicense-upload"
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={(e) => handleFileUpload(e, "driversLicense")}
                />
                <Button component="span" startIcon={<Upload />} variant="text">
                  Upload file
                </Button>
              </label>
            </Grid2>

            {/* W-4 */}
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel>W-4</InputLabel>
              <label htmlFor="w4-upload">
                <input
                  id="w4-upload"
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={(e) => handleFileUpload(e, "w4")}
                />
                <Button component="span" startIcon={<Upload />} variant="text">
                  Upload file
                </Button>
              </label>
            </Grid2>

            {/* Policy Check */}
            <Grid2 size={{ xs: 12 }}>
              <Controller
                name="policyAcknowledgment"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="I have received and reviewed all company policy documents"
                  />
                )}
              />
              {errors.policyAcknowledgment && (
                <FormHelperText error variant="body2">
                  {errors.policyAcknowledgment.message}
                </FormHelperText>
              )}
            </Grid2>
          </Grid2>
        </form>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          fullWidth
          disabled={isUpdating}
          variant="contained"
          onClick={handleSubmit(onSubmit)}
        >
          Save Changes
        </Button>
        <Button fullWidth variant="outlined" onClick={onClose} color="text">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormsInfoModal;
