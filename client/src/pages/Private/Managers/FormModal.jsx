import React, { useEffect } from "react";
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
  Select,
  FormHelperText,
  Box,
  Avatar,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { getDocumentId } from "../../../utils/toTitleCase";
import { errorMessages } from "../../../apis/messageHandler";
import toast from "react-hot-toast";
import {
  useCreateManagerMutation,
  useUpdateManagerMutation,
} from "../../../apis/Manager/manager";
import { useGetAllCompaniesQuery } from "../../../apis/company/company";

const ManagerModal = ({ initialData, showForm, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    getValues,
    control,
    watch,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      company: "",
    },
  });

  const { data, isFetching: isCompaniesFetching } = useGetAllCompaniesQuery({
    isAll: true,
  });
  const [createManager, { isLoading: isCreating }] = useCreateManagerMutation();
  const [updateManager, { isLoading: isUpdating }] = useUpdateManagerMutation();

  useEffect(() => {
    if (initialData) {
      setValue("email", initialData?.user?.email);
      setValue("password", initialData?.personalInfo?.password);
      setValue("company", initialData?.user?.company);
    } else {
      reset();
    }
  }, [initialData]);

  const onSubmit = async (data) => {
    const id = getDocumentId(initialData?.user);

    try {
      if (id) {
        await updateManager({ ...data, id }).unwrap();
      } else {
        await createManager(data).unwrap();
      }
      reset();
      onClose();
      toast.success("Manager saved successfully!");
    } catch (error) {
      errorMessages(error);
    }
  };

  return (
    <Dialog open={showForm} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "Edit Manager" : "Create Manager"}
      </DialogTitle>
      <DialogContent>
        <Grid2 container spacing={1.5} rowSpacing={2}>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <InputLabel>Email</InputLabel>
            <TextField
              size="small"
              fullWidth
              required
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6 }}>
            <InputLabel>Password</InputLabel>
            {getDocumentId(initialData) ? (
              <TextField
                type="password"
                size="small"
                fullWidth
                placeholder="Password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            ) : (
              <TextField
                type="password"
                size="small"
                fullWidth
                required={getDocumentId(initialData) ? false : true}
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <InputLabel>Company</InputLabel>
            <Controller
              name="company"
              control={control}
              rules={{ required: "Company is required" }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <TextField
                    {...field}
                    onChange={(event) => field.onChange(event.target.value)}
                    disabled={isCompaniesFetching}
                    size="small"
                    fullWidth
                    select
                    error={!!error}
                  >
                    {isCompaniesFetching ? (
                      <MenuItem value={getValues("company")} disabled>
                        Please wait...
                      </MenuItem>
                    ) : (
                      data?.companies?.map((o, idx) => (
                        <MenuItem key={idx} value={getDocumentId(o)}>
                          {o?.name}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                  {error && (
                    <FormHelperText error>
                      {error.message}
                    </FormHelperText>
                  )}
                </>
              )}
            />
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
          Save
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

export default ManagerModal;
