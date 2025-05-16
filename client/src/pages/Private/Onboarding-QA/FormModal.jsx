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
  DialogContentText,
} from "@mui/material";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  useCreateOnboardQuestionMutation,
  useUpdateOnboardQuestionMutation,
} from "../../../apis/Onboarding-Q&A/questions";
import { getDocumentId } from "../../../utils/toTitleCase";
import { errorMessages } from "../../../apis/messageHandler";

const OnboardingQuestionFormModal = ({ initialData, showForm, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { text: "" },
  });

  useEffect(() => {
    if (initialData) {
      setValue("text", initialData?.text);
    } else {
      reset();
    }
  }, [initialData]);

  const [createOnboardQuestion, { isLoading: isCreating }] =
    useCreateOnboardQuestionMutation();
  const [updateOnboardQuestion, { isLoading: isUpdating }] =
    useUpdateOnboardQuestionMutation();

  const onSubmit = async (data) => {
    try {
      const questionID = getDocumentId(initialData);
      if (questionID) {
        await updateOnboardQuestion({ ...data, id: questionID }).unwrap();
      } else {
        await createOnboardQuestion(data).unwrap();
      }
      reset();
      onClose();
      toast.success("Onboarding Question saved successfully!");
    } catch (error) {
      errorMessages(error);
    }
  };

  return (
    <Dialog open={showForm} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {initialData
          ? "Edit Onboarding Question"
          : "Create Onboarding Question"}
        <DialogContentText fontSize={14}>
          Please add the onboarding question text.
        </DialogContentText>
      </DialogTitle>
      <DialogContent>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12 }}>
            <InputLabel>Question Text</InputLabel>
            <TextField
              size="small"
              fullWidth
              required
              placeholder="Question Text"
              {...register("text", { required: "Question text is required" })}
              error={!!errors.text}
              helperText={errors.text?.message}
            />
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", px: 3, pb: 3 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={isCreating || isUpdating}
          onClick={handleSubmit(onSubmit)}
        >
          Save Question
        </Button>
        <Button fullWidth variant="outlined" color="text" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OnboardingQuestionFormModal;
