import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  TextField,
  Button,
  MenuItem,
  InputLabel,
  Grid2,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { getDocumentId } from "../../../utils/toTitleCase";
import { errorMessages } from "../../../apis/messageHandler";
import { useUpdateEmployeeMutation } from "../../../apis/Employee/employee";
import { UTCDatePicker } from "../../UTCdatePicker";

const PersonalInfo = ({
  accountData,
  personalInfo,
  onClose = () => {},
  open = false,
  handleUpdatedData = () => {},
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

  // const dispatch = useDispatch();
  const onSubmit = async (data) => {
    try {
      const accountId = getDocumentId(accountData);
      // const dob = new Date(data?.dateOfBirth);
      // data.dateOfBirth = dob;
      // dob.setHours(0, 0, 0, 0);
      // console.log(dob)
      if (accountId) {
        const { data: updated = null } = await updateEmployee({
          personalInfo: data,
          accountId,
        }).unwrap();
        handleUpdatedData(updated?.updatedPersonalInfo);
      }
      onClose(data);
    } catch (err) {
      errorMessages(err);
    }
  };
  useEffect(() => {
    if (personalInfo) {
      // Map form fields to their corresponding values from the personalInfo object
      const formFields = {
        firstName: personalInfo?.firstName || "",
        lastName: personalInfo?.lastName || "",
        username: personalInfo?.username || "",
        personalEmail: personalInfo?.personalEmail || "",
        phoneNumber: personalInfo?.phoneNumber || "",
        dateOfBirth: personalInfo?.dateOfBirth || null,
        homeAddress: personalInfo?.homeAddress || "",
        city: personalInfo?.city || "",
        state: personalInfo?.state || "",
        zipcode: personalInfo?.zipcode || "",
        maritalStatus: personalInfo?.maritalStatus || "",
      };

      // Set values dynamically for each field
      Object.keys(formFields).forEach((key) => {
        setValue(key, formFields[key]);
      });
    }
  }, [personalInfo, setValue]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Personal Info</DialogTitle>
      <DialogContent
        width="100%"
        // bgcolor="white.main"
        // p={3}
        // borderRadius={2}
        // boxShadow={3}
        // maxHeight={"100vh"}
        // overflow={"auto"}
      >
        {/* <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        mb={2}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Personal Information
        </Typography>
        <Typography align="right" variant="body1">
          <Typography component={"span"} color="primary">
            01
          </Typography>{" "}
          / 03
        </Typography>
      </Stack> */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel>First Name</InputLabel>
              <TextField
                size="small"
                fullWidth
                {...register("firstName", {
                  required: "First name is required",
                })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel>Last Name</InputLabel>
              <TextField
                size="small"
                fullWidth
                {...register("lastName", {
                  required: "Last name is required",
                })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel>Username</InputLabel>
              <TextField
                size="small"
                fullWidth
                {...register("username", { required: "Username is required" })}
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel>Personal Email Address</InputLabel>
              <TextField
                size="small"
                fullWidth
                {...register("personalEmail", {
                  required: "Email is required",
                })}
                error={!!errors.personalEmail}
                helperText={errors.personalEmail?.message}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel>Phone Number</InputLabel>
              <TextField
                size="small"
                fullWidth
                {...register("phoneNumber", {
                  required: "Phone number is required",
                })}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel>Date of Birth</InputLabel>
              <Controller
                name="dateOfBirth"
                control={control}
                rules={{ required: "Date of birth is required" }}
                render={({ field }) => (
                  <UTCDatePicker
                    value={field.value}
                    onChange={field.onChange}
                    textFieldProps={{
                      required: true,
                      error: !!errors.dateOfBirth,
                      helperText: errors.dateOfBirth?.message,
                    }}
                  />
                )}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <InputLabel>Home Address</InputLabel>
              <TextField
                size="small"
                fullWidth
                {...register("homeAddress", {
                  required: "Home address is required",
                })}
                error={!!errors.homeAddress}
                helperText={errors.homeAddress?.message}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <InputLabel>City</InputLabel>
              <TextField
                size="small"
                fullWidth
                {...register("city", { required: "City is required" })}
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <InputLabel>State</InputLabel>
              <TextField
                size="small"
                fullWidth
                {...register("state", { required: "State is required" })}
                error={!!errors.state}
                helperText={errors.state?.message}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <InputLabel>Zipcode</InputLabel>
              <TextField
                size="small"
                fullWidth
                {...register("zipcode", { required: "Zipcode is required" })}
                error={!!errors.zipcode}
                helperText={errors.zipcode?.message}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel>Marital Status</InputLabel>
              <Controller
                name="maritalStatus"
                control={control}
                defaultValue="single"
                rules={{ required: "Marital status is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    fullWidth
                    select
                    error={!!errors.maritalStatus}
                    helperText={errors.maritalStatus?.message}
                  >
                    <MenuItem value="single">Single</MenuItem>
                    <MenuItem value="married">Married</MenuItem>
                  </TextField>
                )}
              />
            </Grid2>
          </Grid2>
          {/* <Button
          disabled={isAdding || isUpdating}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
        >
          Next Step: Work Information
        </Button> */}
        </form>
        {/* <LogoutButton sx={{ my: 1 }} fullWidth /> */}
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

export default PersonalInfo;
