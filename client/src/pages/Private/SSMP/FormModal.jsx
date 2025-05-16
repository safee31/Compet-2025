import { useEffect, useState } from "react";
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
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  useCreateViolationCodeMutation,
  useGetAllViolationFactorsQuery,
  useUpdateViolationCodeMutation,
} from "../../../apis/violationCode/violationCode";
import { getDocumentId } from "../../../utils/toTitleCase";
import { errorMessages } from "../../../apis/messageHandler";

import SolutionsSection from "./SolutionsSection";
import QuestionsSection from "./QuestionsSections";

import { IconButton, Stack, Collapse, Box } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

const CollapsibleSection = ({ title, children, expanded, onToggle }) => {
  return (
    <Grid2 size={{ xs: 12 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          cursor: "pointer",
          "&:hover": { backgroundColor: "action.hover" },
          p: 1,
          borderRadius: 1,
        }}
        onClick={onToggle}
      >
        <InputLabel sx={{ cursor: "pointer" }}>{title}</InputLabel>
        <IconButton
          size="small"
          sx={{ p: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          <ExpandMore
            sx={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        </IconButton>
      </Stack>
      <Collapse in={expanded} unmountOnExit>
        <Box
          sx={{ mt: 1, pl: 1, borderLeft: "2px solid", borderColor: "divider" }}
        >
          {children}
        </Box>
      </Collapse>
    </Grid2>
  );
};

const ViolationCodeFormModal = ({ initialData, showForm, onClose }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      section: "49-CFR",
      code: "",
      description: "",
      solutions: [],
      questions: [],
      severity: "critical",
      source_type: "SMP",
      factor: "",
    },
  });
  const { data, isFetching } = useGetAllViolationFactorsQuery();

  const questions = watch("questions");
  const solutions = watch("solutions");
  const selectedFactor = watch("factor");

  useEffect(() => {
    if (initialData) {
      setValue("section", initialData?.section);
      setValue("code", initialData?.code);
      setValue("description", initialData?.description);
      setValue("source_type", initialData?.source_type);
      setValue("severity", initialData?.severity);
      setValue("factor", getDocumentId(initialData?.factor));
      setValue("solutions", initialData?.solutions || []);
      setValue("questions", initialData?.questions || []);
    } else {
      reset();
    }
  }, [initialData]);

  const [createViolationCode, { isLoading: isCreating }] =
    useCreateViolationCodeMutation();
  const [updateViolationCode, { isLoading: isUpdating }] =
    useUpdateViolationCodeMutation();

  const onSubmit = async (data) => {
    try {
      const violationId = getDocumentId(initialData);
      if (violationId) {
        const payload = {
          section: data?.section,
          code: data?.code,
          description: data?.description,
          source_type: data?.source_type,
          severity: data?.severity,
          factor: data?.factor,
        };
        await updateViolationCode({ id: violationId, ...payload }).unwrap();
      } else {
        await createViolationCode(data).unwrap();
      }
      reset();
      onClose();
      toast.success("Violation Code saved successfully!");
    } catch (error) {
      errorMessages(error);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  return (
    <Dialog open={showForm} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "Edit Violation Code" : "Create Violation Code"}
        <DialogContentText fontSize={14}>
          {initialData
            ? "Update the violation code details"
            : "Add a new violation code"}
        </DialogContentText>
      </DialogTitle>
      <DialogContent>
        <Grid2 container spacing={2} sx={{ mt: 1 }}>
          {/* Factor Selection */}
          <Grid2 size={{ xs: 12 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Factor</InputLabel>
              <Select
                label="Factor"
                {...register("factor", { required: "Factor is required" })}
                error={!!errors.factor}
                value={isFetching ? "" : selectedFactor || ""}
                disabled={isFetching}
              >
                {isFetching ? (
                  <MenuItem value="" disabled>
                    Loading factors...
                  </MenuItem>
                ) : (
                  data?.factors?.map((factor, idx) => (
                    <MenuItem key={idx + 1} value={getDocumentId(factor)}>
                      {factor?.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.factor && (
                <FormHelperText error>{errors.factor.message}</FormHelperText>
              )}
            </FormControl>
          </Grid2>
          <Grid2 size={{ xs: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Section</InputLabel>
              <Select
                label="Section"
                defaultValue="49-CFR"
                {...register("section", { required: "Section is required" })}
                error={!!errors.section}
              >
                <MenuItem value="49-CFR">49-CFR</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 size={{ xs: 9 }}>
            <TextField
              label="Code"
              size="small"
              fullWidth
              required
              placeholder="Violation code"
              {...register("code", { required: "Code is required" })}
              error={!!errors.code}
              helperText={errors.code?.message}
            />
          </Grid2>
          <Grid2 size={{ xs: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Source Type</InputLabel>
              <Select
                label="Source Type"
                defaultValue="SMP"
                {...register("source_type", {
                  required: "Source type is required",
                })}
                error={!!errors.section}
              >
                <MenuItem value="SMP">SMP</MenuItem>
                <MenuItem value="regulation">Regulation</MenuItem>
                <MenuItem value="policy">Policy</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 size={{ xs: 9 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Severity</InputLabel>
              <Select
                label="Severity"
                defaultValue="critical"
                {...register("severity", { required: "Severity is required" })}
                error={!!errors.section}
              >
                <MenuItem value="critical">Critical</MenuItem>
                <MenuItem value="acute">Acute</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <InputLabel>Description</InputLabel>
            <TextField
              size="small"
              fullWidth
              multiline
              minRows={4}
              maxRows={8}
              placeholder="Description of the violation"
              {...register("description")}
            />
          </Grid2>
          <CollapsibleSection
            title="Questions"
            expanded={expandedSection === "questions"}
            onToggle={() => toggleSection("questions")}
          >
            <QuestionsSection
              questions={questions}
              setValue={setValue}
              violationCodeId={getDocumentId(initialData)}
            />
          </CollapsibleSection>

          {/* Solutions Section */}
          <CollapsibleSection
            title="Solutions"
            expanded={expandedSection === "solutions"}
            onToggle={() => toggleSection("solutions")}
          >
            <SolutionsSection
              solutions={solutions}
              setValue={setValue}
              violationCodeId={getDocumentId(initialData)}
            />
          </CollapsibleSection>
        </Grid2>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", px: 3, pb: 3 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={isCreating || isUpdating}
          onClick={handleSubmit(onSubmit)}
        >
          {initialData ? "Update" : "Create"}
        </Button>
        <Button fullWidth variant="outlined" color="text" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViolationCodeFormModal;
