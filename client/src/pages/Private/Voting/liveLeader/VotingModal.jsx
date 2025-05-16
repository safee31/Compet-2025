import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import {
  useCastVoteMutation,
  useGetNomineeQuery,
} from "../../../../apis/Voting/voting";
import toast from "react-hot-toast";

const VotingModal = ({ handleClose, open }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      nominee: "",
      reason: "",
    },
  });

  const { data: nominees, isLoading } = useGetNomineeQuery();
  const [castVote, { isLoading: isCasting }] = useCastVoteMutation();
  const selectedNominee = watch("nominee");
  const onSubmit = async (formData) => {
    try {
      await castVote(formData).unwrap();
      toast.success("Vote cast successfully!");
      reset(); // Reset form after successful submission
      handleClose();
    } catch (error) {
      toast.error(error.data?.message || "Failed to cast vote.");
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth="xs" onClose={handleClose}>
      <DialogTitle component={"div"}>
        <Typography variant="h5" fontWeight={"bold"}>
          H-E-R-B-I-E-S Nominations
        </Typography>
      </DialogTitle>
      <DialogContent>
        {/* Nominee Selection */}
        <Box mb={2}>
          <InputLabel>User</InputLabel>
          <Controller
            name="nominee"
            control={control}
            rules={{ required: "Nominee is required" }}
            disabled={isLoading}
            render={({ field }) => (
              <Select
                {...field}
                size="small"
                fullWidth
                error={!!errors.nominee}
                value={selectedNominee || ""}
                onChange={(event) => {
                  const selectedId = event.target.value;
                  setValue("nominee", selectedId);
                }}
              >
                {isLoading ? (
                  <MenuItem value="">
                    <em>Loading...</em>
                  </MenuItem>
                ) : (
                  nominees?.map((nominee, idx) => (
                    <MenuItem key={idx + 1} value={nominee?.userId}>
                      <Chip
                        size="small"
                        // color="primaryLight"
                        label={nominee?.role}
                        sx={{ mr: 0.5 }}
                      />

                      {`${nominee.firstName} ${nominee.lastName}`}
                    </MenuItem>
                  ))
                )}
              </Select>
            )}
          />
          {errors.nominee && (
            <FormHelperText error>
              {errors.nominee.message}
            </FormHelperText>
          )}
        </Box>

        {/* Reason Input */}
        <InputLabel>Explain your choice</InputLabel>
        <Controller
          name="reason"
          control={control}
          rules={{
            required: "Reason is required",
            minLength: { value: 5, message: "Minimum 5 characters required" },
          }}
          render={({ field }) => (
            <TextField
              size="small"
              {...field}
              fullWidth
              variant="outlined"
              error={!!errors.reason}
              helperText={errors?.reason?.message}
            />
          )}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          disabled={isCasting}
          variant="contained"
          fullWidth
          onClick={handleSubmit(onSubmit)}
        >
          {isCasting ? "Submitting..." : "Submit"}
        </Button>
        <Button variant="outlined" color="text" fullWidth onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VotingModal;
