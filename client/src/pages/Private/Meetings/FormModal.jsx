import { useEffect } from "react";
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
} from "@mui/material";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);
import { Controller, useForm } from "react-hook-form";
import { getDocumentId } from "../../../utils/toTitleCase";
import { errorMessages } from "../../../apis/messageHandler";
import toast from "react-hot-toast";
import { useGetAllCompaniesQuery } from "../../../apis/company/company";
import {
  useCreateMeetingMutation,
  useUpdateMeetingMutation,
} from "../../../apis/Meeting/meeting";
import { useSelector } from "react-redux";
import { useGetAllVerifiedUsersQuery } from "../../../apis/Admin/admin";
import { UTCDatePicker } from "../../../components/UTCdatePicker";

const MeetingModal = ({ initialData, showForm, onClose }) => {
  const userDetails = useSelector((s) => s?.account?.details);
  const isManager = userDetails?.role?.type === 2;
  const managerCompany = userDetails?.user?.company || null;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    control,
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      date: "",
      notes: "",
      meetingLink: "",
      attendees: [],
      company: managerCompany || "",
    },
  });
  const selectedCompany = watch("company");
  const {
    data: { users: companyUsersData = [] } = {},
    isFetching: isCompanyusersFetching,
  } = useGetAllVerifiedUsersQuery(
    {
      isAll: true,
      approval: true,
      company: isManager ? managerCompany : selectedCompany,
    },
    { skip: !isManager && !selectedCompany }
  );

  const { data, isFetching: isCompaniesFetching } = useGetAllCompaniesQuery(
    { isAll: true },
    { skip: isManager }
  );
  const [createMeeting, { isLoading: isCreating }] = useCreateMeetingMutation();
  const [updateMeeting, { isLoading: isUpdating }] = useUpdateMeetingMutation();
  useEffect(() => {
    if (initialData) {
      setValue("title", initialData?.title);
      setValue("date", initialData?.date || null);
      setValue("notes", initialData?.notes);
      setValue("meetingLink", initialData?.meetingLink);
      setValue("attendees", initialData?.attendees?.map(getDocumentId));
      setValue("company", getDocumentId(initialData?.company));
    } else {
      reset();
    }
  }, [initialData]);

  const onSubmit = async (data) => {
    const id = getDocumentId(initialData);
    try {
      if (id) {
        await updateMeeting({ ...data, id }).unwrap();
      } else {
        await createMeeting(data).unwrap();
      }
      reset();
      onClose();
      toast.success("Meeting saved successfully!");
    } catch (error) {
      errorMessages(error);
    }
  };
  const attendees = watch("attendees");

  return (
    <Dialog open={showForm} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        Document Meeting
        <DialogContentText fontSize={14}>
          Please add a brief title and description of your meeting and select
          the employees that you met with.
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
            <InputLabel>Date of Meeting</InputLabel>
            <Controller
              name="date"
              control={control}
              rules={{
                required: "Date of meeting is required",
                validate: (value) => {
                  const selected = dayjs(value);
                  return selected.isValid() &&
                    selected
                      .startOf("day")
                      .isSameOrAfter(dayjs().startOf("day"))
                    ? true
                    : "Meeting date must be today or in the future";
                },
              }}
              render={({ field }) => (
                <UTCDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  textFieldProps={{
                    error: !!errors.date,
                    helperText: errors.date?.message,
                  }}
                />
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <InputLabel>Notes</InputLabel>
            <TextField
              size="small"
              fullWidth
              required
              placeholder="Notes"
              {...register("notes", { required: "Notes is required" })}
              error={!!errors.notes}
              helperText={errors.notes?.message}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <InputLabel>Meeting Link</InputLabel>
            <TextField
              size="small"
              fullWidth
              required
              placeholder="Link"
              {...register("meetingLink", {
                required: "Meeting Link is required",
              })}
              error={!!errors.meetingLink}
              helperText={errors.meetingLink?.message}
            />
          </Grid2>
          {!isManager && (
            <Grid2 size={{ xs: 12 }}>
              <InputLabel>Company</InputLabel>
              <Controller
                name="company"
                control={control}
                // rules={{ required: "Company is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(event) => field.onChange(event.target.value)}
                    disabled={isCompaniesFetching}
                    size="small"
                    fullWidth
                    select
                  >
                    {isCompaniesFetching ? (
                      <MenuItem value={""} disabled>
                        Loading companies...
                      </MenuItem>
                    ) : (
                      data?.companies?.map((o, idx) => (
                        <MenuItem key={idx} value={getDocumentId(o)}>
                          {o?.name}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                )}
              />
            </Grid2>
          )}
          <Grid2 size={{ xs: 12 }}>
            <InputLabel>Attendees</InputLabel>
            <Controller
              name="attendees"
              control={control}
              render={({ field }) => (
                <Select
                  fullWidth
                  size="small"
                  {...field}
                  multiple
                  value={attendees || []}
                  onChange={(event) => {
                    const selectedId = event.target.value;
                    setValue("attendees", selectedId);
                  }}
                  disabled={isCompanyusersFetching || !selectedCompany}
                  error={!!errors.attendees}
                  // helperText={errors.attendees?.message}
                >
                  {isCompanyusersFetching ? (
                    <MenuItem value="" disabled>
                      Loading users...
                    </MenuItem>
                  ) : (
                    companyUsersData?.map((account, idx) => {
                      return (
                        <MenuItem
                          key={idx + 1}
                          value={getDocumentId(account?.user)}
                        >
                          <Chip
                            size="small"
                            // color="primaryLight"
                            label={account?.role?.name}
                            sx={{ mr: 0.5 }}
                          />

                          {`${account?.personalInfo?.firstName || "N/A"} 
                          ${account?.personalInfo?.lastName || "N/A"}`}
                        </MenuItem>
                      );
                    })
                  )}
                </Select>
              )}
            />

            {/* Display Chips Below */}
            {attendees?.length > 0 && (
              <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {attendees?.map((id, idx) => {
                  const user = companyUsersData?.find(
                    (acc) => getDocumentId(acc?.user) === id
                  );
                  return user ? (
                    <Chip
                      color="primaryLight"
                      key={idx}
                      label={`${user?.personalInfo?.firstName} 
                          ${user?.personalInfo?.lastName}`}
                      onDelete={() =>
                        setValue(
                          "attendees",
                          attendees.filter((a) => a !== id)
                        )
                      }
                    />
                  ) : null;
                })}
              </Box>
            )}
            {errors.attendees?.message && (
              <FormHelperText>{errors.attendees?.message}</FormHelperText>
            )}
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
          Save Meeting
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

export default MeetingModal;
