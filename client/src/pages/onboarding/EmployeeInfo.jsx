import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Stack,
  MenuItem,
  InputLabel,
  Grid2,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { errorMessages } from "../../apis/messageHandler";
import { useDispatch, useSelector } from "react-redux";
import { emailRegex, getDocumentId } from "../../utils/toTitleCase";
import {
  useCreateWorkInfoMutation,
  useUpdateWorkInfoMutation,
} from "../../apis/Employee/onboarding";
import LogoutButton from "../../components/LogoutButton";
import { authenticateEmployee } from "../../redux/Slices/Account";

const EmployeeInfo = ({ onNext }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();

  const employeeInfo = useSelector(
    (s) => s?.account?.details?.onboarding?.workInfo || null
  );

  const [addWorkInfo, { isLoading: isAdding }] = useCreateWorkInfoMutation();
  const [updateWorkInfo, { isLoading: isUpdating }] =
    useUpdateWorkInfoMutation();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const docID = getDocumentId(data);
      if (docID) {
        await updateWorkInfo({ ...data }).unwrap();
      } else {
        await addWorkInfo({ ...data }).unwrap();
      }
      dispatch(authenticateEmployee());
      navigate("/onboarding/forms");
    } catch (err) {
      errorMessages(err);
    }
  };

  useEffect(() => {
    if (employeeInfo) {
      const formFields = {
        workEmail: employeeInfo?.workEmail || "",
        workPhoneNumber: employeeInfo?.workPhoneNumber || "",
        company: employeeInfo?.company || "",
        emergencyContact: {
          firstName: employeeInfo?.emergencyContact?.firstName || "",
          lastName: employeeInfo?.emergencyContact?.lastName || "",
          relationship: employeeInfo?.emergencyContact?.relationship || "",
          email: employeeInfo?.emergencyContact?.email || "",
          phoneNumber: employeeInfo?.emergencyContact?.phoneNumber || "",
        },
      };

      Object.keys(formFields).forEach((key) => {
        if (key === "emergencyContact") {
          // Handle nested fields for emergencyContact
          Object.keys(formFields[key]).forEach((subKey) => {
            setValue(`emergencyContact.${subKey}`, formFields[key][subKey]);
          });
        } else {
          setValue(key, formFields[key]);
        }
      });
    }
  }, [employeeInfo, setValue]);

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
            Employee Information
          </Typography>
          <Typography align="right" variant="body2">
            <Typography component={"span"} color="primary">
              02
            </Typography>{" "}
            / 03
          </Typography>
        </Stack>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ maxHeight: "55vh", overflow: "auto" }}
        >
          <Grid2 container spacing={2}>
            {/* Work Email */}
            <Grid2 size={{ xs: 12 }}>
              <InputLabel>Work Email</InputLabel>
              <TextField
                size="small"
                fullWidth
                {...register("workEmail", {
                  required: "Work email is required",
                  validate: (value) =>
                    emailRegex(value) || "Invalid email address",
                })}
                error={!!errors.workEmail}
                helperText={errors.workEmail?.message}
              />
            </Grid2>

            {/* Work Phone Number */}
            <Grid2 size={{ xs: 12 }}>
              <InputLabel>Work Phone Number</InputLabel>
              <TextField
                size="small"
                fullWidth
                {...register("workPhoneNumber")}
                error={!!errors.workPhoneNumber}
                helperText={errors.workPhoneNumber?.message}
              />
            </Grid2>

            {/* Company Field */}
            <Grid2 size={{ xs: 12 }}>
              <InputLabel>Company</InputLabel>
              <TextField
                size="small"
                fullWidth
                {...register("company")}
                error={!!errors.company}
                helperText={errors.company?.message}
              />
            </Grid2>

            {/* Emergency Contact Section */}
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Emergency Contact
              </Typography>
            </Grid2>

            {/* Emergency Contact First Name */}
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel>First Name</InputLabel>
              <TextField
                size="small"
                fullWidth
                {...register("emergencyContact.firstName", {
                  required: "First name is required",
                })}
                error={!!errors.emergencyContact?.firstName}
                helperText={errors.emergencyContact?.firstName?.message}
              />
            </Grid2>

            {/* Emergency Contact Last Name */}
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel>Last Name</InputLabel>
              <TextField
                size="small"
                fullWidth
                {...register("emergencyContact.lastName", {
                  required: "Last name is required",
                })}
                error={!!errors.emergencyContact?.lastName}
                helperText={errors.emergencyContact?.lastName?.message}
              />
            </Grid2>

            {/* Emergency Contact Relationship */}
            <Grid2 size={{ xs: 12 }}>
              <InputLabel>Relationship</InputLabel>
              <TextField
                size="small"
                fullWidth
                {...register("emergencyContact.relationship", {
                  required: "Relationship is required",
                })}
                error={!!errors.emergencyContact?.relationship}
                helperText={errors.emergencyContact?.relationship?.message}
              />
            </Grid2>

            {/* Emergency Contact Email */}
            <Grid2 size={{ xs: 12 }}>
              <InputLabel>Email Address</InputLabel>
              <TextField
                size="small"
                fullWidth
                {...register("emergencyContact.email", {
                  validate: (value) =>
                    value ? emailRegex(value) : true || "Invalid email address",
                })}
                error={!!errors.emergencyContact?.email}
                helperText={errors.emergencyContact?.email?.message}
              />
            </Grid2>

            {/* Emergency Contact Phone Number */}
            <Grid2 size={{ xs: 12 }}>
              <InputLabel>Phone Number</InputLabel>
              <TextField
                size="small"
                fullWidth
                {...register("emergencyContact.phoneNumber", {
                  required: "Phone number is required",
                })}
                error={!!errors.emergencyContact?.phoneNumber}
                helperText={errors.emergencyContact?.phoneNumber?.message}
              />
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
            Next Step: Forms
          </Button>
        </form>
        <LogoutButton sx={{ my: 1 }} fullWidth />
      </Box>
    </Container>
  );
};

export default EmployeeInfo;
