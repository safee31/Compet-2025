import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputLabel,
  MenuItem,
  DialogContentText,
  Select,
  FormHelperText,
  Grid2,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Delete } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useGetAllCompaniesQuery } from "../../../apis/company/company";
import {
  useCreateSurveyMutation,
  useUpdateSurveyMutation,
} from "../../../apis/Survey/survey";
import { errorMessages } from "../../../apis/messageHandler";
import { getDocumentId } from "../../../utils/toTitleCase";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { UTCDatePicker } from "../../../components/UTCdatePicker";
dayjs.extend(isSameOrAfter);

const SurveyModal = ({ initialData, showForm, onClose }) => {
  const userDetails = useSelector((s) => s?.account?.details);
  const isManager = userDetails?.role?.type === 2;
  const managerCompany = userDetails?.user?.company || "";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      schedulePattern: "weekly",
      repeatDay: "Monday",
      company: managerCompany || "",
      questions: [{ text: "" }],
      surveyFor: isManager ? 3 : 2,
      nextTriggerDate: null,
    },
  });

  const nextTriggerDate = watch("nextTriggerDate");
  const schedulePattern = watch("schedulePattern");
  const isOneTime = schedulePattern === "one-time";
  // Manage dynamic questions
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const { data, isFetching: isCompaniesFetching } = useGetAllCompaniesQuery(
    { isAll: true },
    { skip: isManager }
  );

  const [createSurvey, { isLoading: isCreating }] = useCreateSurveyMutation();
  const [updateSurvey, { isLoading: isUpdating }] = useUpdateSurveyMutation();

  useEffect(() => {
    if (initialData) {
      setValue("title", initialData?.title);
      setValue("description", initialData?.description);
      setValue("schedulePattern", initialData?.schedulePattern);
      setValue("repeatDay", initialData?.repeatDay || "Monday");
      setValue("surveyFor", initialData?.targetRole);
      setValue(
        "company",
        managerCompany || getDocumentId(initialData?.company)
      );
      setValue(
        "questions",
        initialData?.questions?.length > 0
          ? initialData?.questions
          : [{ text: "" }]
      );
      setValue("nextTriggerDate", initialData?.nextTriggerDate || null);
    } else {
      reset();
    }
  }, [initialData]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        targetRole: data.surveyFor,
        repeatDay: isOneTime ? null : data.repeatDay,
        nextTriggerDate: isOneTime ? data.nextTriggerDate : null,
      };
      const id = getDocumentId(initialData);
      if (id) {
        await updateSurvey({ ...payload, id }).unwrap();
      } else {
        await createSurvey(payload).unwrap();
      }
      reset();
      onClose();
      toast.success("Survey saved successfully!");
    } catch (error) {
      errorMessages(error);
    }
  };

  return (
    <Dialog open={showForm} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Survey Details
        <DialogContentText fontSize={14}>
          Fill in the details to create or update a survey.
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
              placeholder="Survey Title"
              {...register("title", { required: "Title is required" })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <InputLabel>Description</InputLabel>
            <TextField
              size="small"
              fullWidth
              multiline
              rows={3}
              placeholder="Brief description about the survey"
              {...register("description")}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <InputLabel>Schedule Pattern</InputLabel>
            <Controller
              name="schedulePattern"
              control={control}
              rules={{ required: "Schedule pattern is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  size="small"
                  fullWidth
                  error={!!errors.schedulePattern}
                >
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="bi-weekly">Bi-Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="one-time">One-time</MenuItem>
                </Select>
              )}
            />
            <FormHelperText error>
              {errors.schedulePattern?.message}
            </FormHelperText>
          </Grid2>

          {isOneTime ? (
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel>Survey Date</InputLabel>
              <Controller
                name="nextTriggerDate"
                control={control}
                rules={{
                  required: "Survey date is required",
                  validate: (value) => {
                    // Parse the stored UTC date (YYYY-MM-DD format)
                    const selectedDate = dayjs(value, "YYYY-MM-DD");
                    const today = dayjs().startOf("day");

                    // Check if the selected date is today or in the future
                    if (!selectedDate.isValid()) return "Invalid date format";

                    if (selectedDate.isBefore(today)) {
                      return "Date must be today or in the future";
                    }

                    // Check if the selected date is within 1 hour of the end of the day
                    if (selectedDate.isSame(today, "day")) {
                      const endOfDay = today.endOf("day");
                      if (selectedDate.isAfter(endOfDay.subtract(1, "hour"))) {
                        return "The selected date must be at least 1 hour away from the end of the day.";
                      }
                    }

                    return true;
                  },
                }}
                render={({ field }) => (
                  <UTCDatePicker
                    value={nextTriggerDate}
                    onChange={field.onChange}
                    textFieldProps={{
                      error: !!errors.nextTriggerDate,
                      helperText: errors.nextTriggerDate?.message,
                    }}
                  />
                )}
              />
            </Grid2>
          ) : (
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel>Repeat Day</InputLabel>
              <Controller
                name="repeatDay"
                control={control}
                rules={{ required: "Repeat day is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="small"
                    fullWidth
                    error={!!errors.repeatDay}
                  >
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText error>
                {errors.repeatDay?.message}
              </FormHelperText>
            </Grid2>
          )}

          {!isManager && (
            <>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <InputLabel>Company</InputLabel>
                <Controller
                  name="company"
                  control={control}
                  rules={!isManager ? { required: "Company is required" } : {}}
                  render={({ field }) => (
                    <Select
                      {...field}
                      size="small"
                      fullWidth
                      disabled={isCompaniesFetching}
                      error={!!errors.company}
                    >
                      {isCompaniesFetching ? (
                        <MenuItem value="" disabled>
                          Loading companies...
                        </MenuItem>
                      ) : (
                        data?.companies?.map((company, idx) => (
                          <MenuItem
                            key={idx + 1}
                            value={getDocumentId(company)}
                          >
                            {company?.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  )}
                />
                <FormHelperText error>
                  {errors.company?.message}
                </FormHelperText>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <InputLabel>Survey For</InputLabel>
                <Controller
                  name="surveyFor"
                  control={control}
                  rules={
                    !isManager ? { required: "Survey For is required" } : {}
                  }
                  render={({ field }) => (
                    <Select
                      {...field}
                      size="small"
                      fullWidth
                      error={!!errors.surveyFor}
                    >
                      <MenuItem value={3}>Employee</MenuItem>
                      <MenuItem value={2}>Manager</MenuItem>
                    </Select>
                  )}
                />
                <FormHelperText error>
                  {errors.surveyFor?.message}
                </FormHelperText>
              </Grid2>
            </>
          )}
          {/* Questions Section */}
          {fields.map((_, index) => (
            <Grid2 size={{ xs: 12 }} key={index + 1}>
              <InputLabel>{`Question ${index + 1}`}</InputLabel>
              <TextField
                fullWidth
                size="small"
                placeholder={`Enter text here`}
                {...register(`questions.${index}.text`, {
                  required: "Question text is required",
                })}
                error={!!errors.questions?.[index]?.text}
                helperText={errors.questions?.[index]?.text?.message}
                slotProps={{
                  input: {
                    endAdornment: fields.length > 1 && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => remove(index)}
                          edge="end"
                          size="medium"
                        >
                          <Delete />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid2>
          ))}
          <Grid2 size={{ xs: 12 }}>
            <Button onClick={() => append({ text: "" })} size="small">
              Add New Question
            </Button>
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
          Save Survey
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

export default SurveyModal;
