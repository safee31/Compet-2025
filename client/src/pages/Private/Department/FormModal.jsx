import { useEffect } from "react";
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
  Chip,
  FormHelperText,
  Grid2,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { getDocumentId } from "../../../utils/toTitleCase";
import { errorMessages } from "../../../apis/messageHandler";
import toast from "react-hot-toast";
import { useGetAllCompaniesQuery } from "../../../apis/company/company";

import { useSelector } from "react-redux";
// import { useGetAllManagersQuery } from "../../../apis/Manager/manager";
import { useGetAllEmployeesQuery } from "../../../apis/Employee/employee";
import {
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
} from "../../../apis/Department/department";

const DepartmentModal = ({ initialData, showForm, onClose }) => {
  const userDetails = useSelector((s) => s?.account?.details);
  const isAdmin = userDetails?.role?.type === 1;
  const userCompany = userDetails?.company || null;

  // RTK Queries
  const { data: companiesData, isFetching: isCompaniesFetching } =
    useGetAllCompaniesQuery({ isAll: true }, { skip: !isAdmin });

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      company: isAdmin ? "" : userCompany,
      // manager: "",
      employees: [],
      description: "",
    },
  });

  const selectedCompany = watch("company");
  // const selectedManager = watch("manager");
  const selectedEmployees = watch("employees");

  // const { data: managersData = {}, isFetching: isManagersFetching } =
  //   useGetAllManagersQuery(
  //     { isAll: true, company: selectedCompany, approval: true },
  //     {
  //       skip: !selectedCompany,
  //     }
  //   );

  const { data: employeesData = {}, isFetching: isEmployeesFetching } =
    useGetAllEmployeesQuery(
      { isAll: true, company: selectedCompany, approval: true },
      {
        skip: !selectedCompany,
      }
    );

  const handleCompanyChange = (value) => {
    setValue("company", value);
    // setValue("manager", "");
    setValue("employees", []);
  };

  // const handleManagerChange = (value) => {
  //   setValue("manager", value);
  //   if (!value) setValue("employees", []);
  // };

  useEffect(() => {
    if (initialData) {
      setValue("name", initialData.name);
      setValue("company", getDocumentId(initialData.company));
      // setValue("manager", initialData.manager?.user);
      setValue("employees", initialData.employees?.map((o) => o?.user) || []);
      setValue("description", initialData.description);
    } else {
      reset();
    }
  }, [initialData, setValue, reset]);

  const [updateDepartment, { isLoading: isUpdating }] =
    useUpdateDepartmentMutation();
  const [createDepartment, { isLoading: isCreating }] =
    useCreateDepartmentMutation();

  const onSubmit = async (data) => {
    try {
      if (initialData) {
        await updateDepartment({
          id: getDocumentId(initialData),
          name: data?.name,
          company: data?.company,
          description: data?.description,
          employees: data?.employees,
        }).unwrap();
        toast.success("Department updated successfully!");
      } else {
        await createDepartment({
          name: data?.name,
          company: data?.company,
          description: data?.description,
          employees: data?.employees,
        }).unwrap();
        toast.success("Department created successfully!");
      }
      onClose();
    } catch (error) {
      errorMessages(error);
    }
  };

  return (
    <Dialog open={showForm} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "Edit Department" : "Create Department"}
        <DialogContentText fontSize={14}>
          {initialData
            ? "Update department details"
            : "Add a new department to your company"}

          {initialData &&
            getDocumentId(initialData.company) !== selectedCompany && (
              <>
                <Typography fontSize={14} color="info">
                  ⚠ Company is being changed!
                </Typography>
                <Typography fontSize={12} color="info">
                  The current manager assignment will be reset.
                </Typography>
              </>
            )}

          {initialData &&
            initialData?.employees?.length &&
            !selectedEmployees.length && (
              <>
                <DialogContentText fontSize={14} mt={0.5} color="info">
                  ⚠ No employees selected!
                </DialogContentText>
                <DialogContentText fontSize={12} color="info">
                  Employees will be unassigned from this department.
                </DialogContentText>
              </>
            )}
        </DialogContentText>
      </DialogTitle>

      <DialogContent>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12 }}>
            <InputLabel>Name</InputLabel>
            <TextField
              size="small"
              fullWidth
              required
              placeholder="Sales, Marketing, etc."
              {...register("name", {
                required: "Department name is required",
                maxLength: {
                  value: 100,
                  message: "Name must be at most 100 characters",
                },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid2>

          {isAdmin && (
            <Grid2 size={{ xs: 12 }}>
              <InputLabel>Company</InputLabel>
              <Controller
                name="company"
                control={control}
                rules={{ required: "Company is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="small"
                    fullWidth
                    disabled={isCompaniesFetching}
                    value={selectedCompany || ""}
                    error={!!errors.company}
                    onChange={(e) => handleCompanyChange(e.target.value)}
                  >
                    {isCompaniesFetching ? (
                      <MenuItem value={""} disabled>
                        Loading companies...
                      </MenuItem>
                    ) : (
                      companiesData?.companies?.map((o, idx) => (
                        <MenuItem key={idx} value={getDocumentId(o)}>
                          {o?.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                )}
              />
              {errors?.company && (
                <FormHelperText error>{errors.company.message}</FormHelperText>
              )}
            </Grid2>
          )}

          {/* <Grid2 size={{ xs: 12, sm: 6 }}>
            <InputLabel>Manager</InputLabel>
            <Controller
              name="manager"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  size="small"
                  fullWidth
                  value={selectedManager || ""}
                  disabled={!selectedCompany || isManagersFetching}
                  error={!!errors.manager}
                  onChange={(e) => handleManagerChange(e.target.value)}
                >
                  {isManagersFetching ? (
                    <MenuItem value="" disabled>
                      Loading managers...
                    </MenuItem>
                  ) : (
                    managersData?.managers?.map((account, idx) => {
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
          </Grid2> */}

          <Grid2 size={{ xs: 12 }}>
            <InputLabel>Employees</InputLabel>
            <Controller
              name="employees"
              control={control}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    size="small"
                    fullWidth
                    multiple
                    disabled={isEmployeesFetching}
                    value={selectedEmployees || []}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    {isEmployeesFetching ? (
                      <MenuItem value="" disabled>
                        Loading employees...
                      </MenuItem>
                    ) : (
                      employeesData?.employees?.map((account, idx) => {
                        return (
                          <MenuItem
                            key={idx + 1}
                            value={getDocumentId(account?.user)}
                          >
                            {account?.department?.name && (
                              <Chip
                                size="small"
                                // color="primaryLight"
                                label={account?.department?.name}
                                sx={{ mr: 0.5 }}
                              />
                            )}

                            {`${account?.personalInfo?.firstName || "N/A"} 
                          ${account?.personalInfo?.lastName || "N/A"}`}
                          </MenuItem>
                        );
                      })
                    )}
                  </Select>
                  {/* <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selectedEmployees?.map((userId) => {
                      const employee = employeesData?.employee?.find(
                        (e) => getDocumentId(e?.user) === userId
                      );
                      return employee ? (
                        <Chip
                          key={userId}
                          label={`${employee?.personalInfo?.firstName} ${employee?.personalInfo?.lastName}`}
                          onDelete={() =>
                            field.onChange(
                              field.value.filter((id) => id !== userId)
                            )
                          }
                        />
                      ) : null;
                    })}
                  </Box> */}
                  {selectedEmployees?.length > 0 && (
                    <FormHelperText>
                      Selected: {selectedEmployees.length}
                    </FormHelperText>
                  )}
                </>
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <InputLabel>Description</InputLabel>
            <TextField
              size="small"
              fullWidth
              multiline
              minRows={3}
              maxRows={6}
              placeholder="Department purpose and responsibilities"
              {...register("description", {
                maxLength: {
                  value: 500,
                  message: "Description must be at most 500 characters",
                },
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </Grid2>
        </Grid2>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", px: 3, pb: 3 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isCreating || isUpdating}
          sx={{ mr: 2 }}
        >
          {initialData ? "Update Department" : "Create Department"}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={onClose}
          disabled={isCreating || isUpdating}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DepartmentModal;
