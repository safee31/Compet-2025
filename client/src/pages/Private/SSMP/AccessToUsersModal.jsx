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
  Select,
  Box,
  Chip,
  FormHelperText,
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { getDocumentId } from "../../../utils/toTitleCase";
import { errorMessages } from "../../../apis/messageHandler";
import toast from "react-hot-toast";
import { useGetAllCompaniesQuery } from "../../../apis/company/company";

import { useGetAllVerifiedUsersQuery } from "../../../apis/Admin/admin";
import { useToggleBulkSmpViolationAccessMutation } from "../../../apis/Account/featureAccess";

const AccessToUsersModal = ({ initialData, showForm, onClose }) => {
  // const userDetails = useSelector((s) => s?.account?.details);
  // const isManager = userDetails?.role?.type === 2;
  // const managerCompany = userDetails?.user?.company || null;

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    control,
    watch,
  } = useForm({
    defaultValues: {
      verifiedUsers: [],
      company: "",
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
      company: selectedCompany,
    },
    { skip: !selectedCompany }
  );

  const { data, isFetching: isCompaniesFetching } = useGetAllCompaniesQuery({
    isAll: true,
  });

  const [updateUsersAccess, { isLoading: isUpdatingUserAccess }] =
    useToggleBulkSmpViolationAccessMutation();

  useEffect(() => {
    if (companyUsersData) {
      setValue(
        "verifiedUsers",
        companyUsersData
          ?.filter((o) => o?.featureAccess?.smp_violations?.canAccess)
          .map((u) => getDocumentId(u?.user))
      );
    } else {
      reset();
    }
  }, [companyUsersData]);

  const onSubmit = async (data) => {
    if (!selectedCompany) {
      toast.error("Company ID is required.");
      return;
    }
    try {
      const { data } = await updateUsersAccess({
        company: selectedCompany,
        users: verifiedUsers,
      }).unwrap();
      reset();
      // onClose();
      toast.success(data?.message || "Users access saved successfully!");
    } catch (error) {
      errorMessages(error);
    }
  };
  const verifiedUsers = watch("verifiedUsers");

  return (
    <Dialog open={showForm} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>SMP Violation Access Control</DialogTitle>
      <DialogContent>
        <Grid2 container spacing={2}>
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
          {selectedCompany && (
            <Grid2 size={{ xs: 12 }}>
              <InputLabel>Verified Users</InputLabel>
              <Controller
                name="verified-users"
                control={control}
                render={({ field }) => (
                  <Select
                    fullWidth
                    size="small"
                    {...field}
                    multiple
                    value={verifiedUsers || []}
                    onChange={(event) => {
                      const selectedId = event.target.value;
                      setValue("verifiedUsers", selectedId);
                    }}
                    disabled={isCompanyusersFetching || !selectedCompany}
                    error={!!errors.verifiedUsers}
                    // helperText={errors.verifiedUsers?.message}
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
              {!isCompanyusersFetching && verifiedUsers?.length > 0 && (
                <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {verifiedUsers?.map((id, idx) => {
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
                            "verifiedUsers",
                            verifiedUsers.filter((a) => a !== id)
                          )
                        }
                      />
                    ) : null;
                  })}
                </Box>
              )}
              {errors.verifiedUsers?.message && (
                <FormHelperText>{errors.verifiedUsers?.message}</FormHelperText>
              )}
            </Grid2>
          )}
        </Grid2>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", px: 3, pb: 3 }}>
        <Button
          fullWidth
          disabled={isUpdatingUserAccess || isUpdatingUserAccess}
          variant="contained"
          onClick={handleSubmit(onSubmit)}
        >
          Save Access
        </Button>
        <Button
          fullWidth
          disabled={isUpdatingUserAccess || isUpdatingUserAccess}
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

export default AccessToUsersModal;
