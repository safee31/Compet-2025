import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Stack,
  InputLabel,
  Grid2,
  FormControlLabel,
  Checkbox,
  Link,
  FormHelperText,
  IconButton,
} from "@mui/material";
import { Close, Info, Upload } from "@mui/icons-material";

import { errorMessages } from "../../apis/messageHandler";
import { useDispatch, useSelector } from "react-redux";
import { getDocumentId } from "../../utils/toTitleCase";
import {
  useCreateEmpFormMutation,
  useUpdateEmpFormMutation,
} from "../../apis/Employee/onboarding";
import LogoutButton from "../../components/LogoutButton";
import { createFormData, validateFiles } from "../../utils/files";
import { EllipsisText } from "../../theme/styledComponents";
import { useUploadFilesMutation } from "../../apis/Files/pdf";
import { authenticateEmployee } from "../../redux/Slices/Account";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EmployeeForms = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const navigate = useNavigate();
  const employeeForms = useSelector(
    (s) => s?.account?.details?.onboarding?.forms || null
  );

  const [addEmployeeForms, { isLoading: isAdding }] =
    useCreateEmpFormMutation();
  const [updateEmployeeForms, { isLoading: isUpdating }] =
    useUpdateEmpFormMutation();

  const dispatch = useDispatch();

  const handleFormSubmit = async (data) => {
    try {
      const docID = getDocumentId(data);
      if (data?.driversLicense instanceof File) {
        data.driversLicense = data?.driversLicense;
      }
      if (data?.w4 instanceof File) {
        data.w4 = data?.w4;
      }

      if (docID) {
        await updateEmployeeForms({ ...data }).unwrap();
      } else {
        await addEmployeeForms({ ...data }).unwrap();
      }
      dispatch(authenticateEmployee());
      navigate("/onboarding/answers");
    } catch (err) {
      errorMessages(err);
    }
  };

  const handleFileUpload = (event, field) => {
    const files = event.target.files;
    const { valid = false, message } = validateFiles(files);
    if (valid) {
      setValue(field, files[0]);
    } else {
      toast.custom(message, { icon: <Info fontSize="small" /> });
      event.target.value = null;
      event.target.files = [];
    }
  };

  useEffect(() => {
    if (employeeForms) {
      const formFields = {
        bankName: employeeForms?.bankName || "",
        accountNumber: employeeForms?.accountNumber || "",
        reAccountNumber: employeeForms?.accountNumber || "",
        routingNumber: employeeForms?.routingNumber || "",
        reRoutingNumber: employeeForms?.routingNumber || "",
        socialSecurityNumber: employeeForms?.socialSecurityNumber || "",
        driversLicense: employeeForms?.driversLicense || "",
        w4: employeeForms?.w4 || "",
        policyAcknowledgment: employeeForms?.policyAcknowledgment || false,
      };

      Object.keys(formFields).forEach((key) => {
        setValue(key, formFields[key]);
      });
    }
  }, [employeeForms, setValue]);

  const removeFile = (field) => {
    setValue(field, "");
  };

  const w4Form = watch("w4");
  const driversLicense = watch("driversLicense");

  return (
    <Container maxWidth="sm" sx={{ p: 0 }}>
      <Typography
        variant="h5"
        color="white"
        fontWeight="bold"
        align="center"
        py={2}
      >
        Welcome!
      </Typography>
      <Box
        width="100%"
        bgcolor="white.main"
        p={3}
        borderRadius={2}
        boxShadow={3}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          mb={2}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Employee Forms
          </Typography>
          <Typography align="right" variant="body2">
            <Typography component={"span"} color="primary">
              03
            </Typography>{" "}
            / 03
          </Typography>
        </Stack>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          style={{ maxHeight: "55vh", overflow: "auto" }}
        >
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Direct Deposit
          </Typography>
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
                        onClick={() => removeFile(field)}
                      >
                        <Close color="error" fontSize="small" />
                      </IconButton>
                    </Stack>
                  )}
                </React.Fragment>
              ))}
            </Grid2>

            {/* Bank Name */}
            <Grid2 size={{ xs: 12 }}>
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
            <Grid2 size={{ xs: 12 }} sm={6}>
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
            <Grid2 size={{ xs: 12 }} sm={6}>
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
            <Grid2 size={{ xs: 12 }} sm={6}>
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
            <Grid2 size={{ xs: 12 }} sm={6}>
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
            <Grid2 size={{ xs: 12 }}>
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
            <Grid2 size={{ xs: 12 }}>
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
            <Grid2 size={{ xs: 12 }}>
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
              <FormControlLabel
                control={
                  <Checkbox
                    {...register("policyAcknowledgment", {
                      required: "Acknowledgment of company policy is required",
                    })}
                  />
                }
                label="I have received and reviewed all company policy documents"
              />
              {errors.policyAcknowledgment && (
                <FormHelperText error variant="body2">
                  {errors.policyAcknowledgment.message}
                </FormHelperText>
              )}
            </Grid2>
          </Grid2>

          <Button
            disabled={isAdding || isUpdating}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Next Step: Get Started
          </Button>
        </form>
        <LogoutButton sx={{ my: 1 }} fullWidth />
      </Box>
    </Container>
  );
};

export default EmployeeForms;
