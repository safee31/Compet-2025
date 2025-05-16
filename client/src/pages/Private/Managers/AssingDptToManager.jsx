import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputLabel,
  MenuItem,
  DialogContentText,
  Select,
  FormHelperText,
  Grid2,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { getDocumentId } from "../../../utils/toTitleCase";
import { errorMessages } from "../../../apis/messageHandler";
import toast from "react-hot-toast";
import {
  useAssignDepartmentToManagerMutation,
  useGetAllDepartmentsQuery,
} from "../../../apis/Department/department";
import DataInfo from "../../../components/DataInfo";
import { SpinnerSm } from "../../../components/Spinner";

const AssignDepartmentManagerModal = ({ showForm, onClose, initialData }) => {
  const manager = getDocumentId(initialData?.user);
  const company = getDocumentId(initialData?.company);

  // RTK Query for departments
  const { data, isFetching: isDepartmentsLoading } = useGetAllDepartmentsQuery(
    { company, isAll: true },
    { skip: !company }
  );

  const [assignDepartment, { isLoading: isAssigning }] =
    useAssignDepartmentToManagerMutation();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      departmentId: getDocumentId(initialData?.department) || "",
    },
  });

  const onSubmit = async (data) => {
    if (!manager) {
      toast.error("Manager ID is required.");
      return;
    }
    try {
      await assignDepartment({
        departmentId: data?.departmentId || "",
        managerId: manager,
      }).unwrap();
      toast.success("Department assigned successfully");
      onClose();
    } catch (error) {
      errorMessages(error);
    }
  };

  return (
    <Dialog open={showForm} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Assign Department
        <DialogContentText fontSize={14}>
          Select a department for{" "}
          {`(${initialData?.personalInfo?.firstName || "N/A"} ${
            initialData?.personalInfo?.lastName || "N/A"
          })`}
        </DialogContentText>
      </DialogTitle>

      <DialogContent>
        {isDepartmentsLoading ? (
          <SpinnerSm />
        ) : !data?.totalDocs ? (
          <DataInfo message="No departments found for this manager or company" />
        ) : (
          <Grid2 container spacing={2} sx={{ mt: 1 }}>
            <Grid2 size={{ xs: 12 }}>
              <InputLabel>Department</InputLabel>
              <Controller
                name="departmentId"
                control={control}
                // rules={{ required: "Department is required" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Select
                      {...field}
                      size="small"
                      fullWidth
                      disabled={isDepartmentsLoading}
                      // error={!!error}
                    >
                      <MenuItem value="">None</MenuItem>
                      {isDepartmentsLoading ? (
                        <MenuItem value="">Loading department...</MenuItem>
                      ) : (
                        data?.departments?.map((dept, idx) => (
                          <MenuItem key={idx + 1} value={getDocumentId(dept)}>
                            {dept.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    {/* {error && (
                      <FormHelperText error>{error.message}</FormHelperText>
                    )} */}
                  </>
                )}
              />
            </Grid2>
          </Grid2>
        )}
      </DialogContent>
      {data?.totalDocs > 0 && (
        <DialogActions sx={{ justifyContent: "center", px: 3, pb: 3 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={isAssigning || isDepartmentsLoading}
            sx={{ mr: 2 }}
          >
            Assign Department
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="text"
            onClick={onClose}
            disabled={isAssigning || isDepartmentsLoading}
          >
            Cancel
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default AssignDepartmentManagerModal;
