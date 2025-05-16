import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid2,
  Typography,
} from "@mui/material";
import { emailRegex, getDocumentId } from "../../../utils/toTitleCase";
import { errorMessages } from "../../../apis/messageHandler";
import { useUpdateEmployeeMutation } from "../../../apis/Employee/employee";

const WorkInfoModal = ({
  accountData,
  workInfo,
  onClose,
  open,
  handleUpdatedData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [updateEmployee, { isLoading: isUpdating }] =
    useUpdateEmployeeMutation();

  const onSubmit = async (data) => {
    try {
      const accountId = getDocumentId(accountData);
      if (accountId) {
        const { data: updated = null } = await updateEmployee({
          workInfo: data,
          accountId,
        }).unwrap();
        handleUpdatedData(updated?.updatedWorkInfo);
      }
      onClose();
    } catch (err) {
      errorMessages(err);
    }
  };

  useEffect(() => {
    if (workInfo) {
      const formFields = {
        workEmail: workInfo?.workEmail || "",
        workPhoneNumber: workInfo?.workPhoneNumber || "",
        // company: workInfo?.company || "",
        emergencyContact: {
          firstName: workInfo?.emergencyContact?.firstName || "",
          lastName: workInfo?.emergencyContact?.lastName || "",
          relationship: workInfo?.emergencyContact?.relationship || "",
          email: workInfo?.emergencyContact?.email || "",
          phoneNumber: workInfo?.emergencyContact?.phoneNumber || "",
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
  }, [workInfo, setValue]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Work Info</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid2 container spacing={2}>
            {/* Work Email */}
            <Grid2 size={{ xs: 12, sm: 6 }}>
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
            <Grid2 size={{ xs: 12, sm: 6 }}>
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
            {/* <Grid2 size={{ xs: 12 ,sm:6}}>
              <InputLabel>Company</InputLabel>
              <TextField
                size="small"
                fullWidth
                {...register("company")}
                error={!!errors.company}
                helperText={errors.company?.message}
              />
            </Grid2> */}

            {/* Emergency Contact Section */}
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="h6" fontWeight="bold">
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
            <Grid2 size={{ xs: 12, sm: 6 }}>
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
            <Grid2 size={{ xs: 12, sm: 6 }}>
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
            <Grid2 size={{ xs: 12, sm: 6 }}>
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

export default WorkInfoModal;
