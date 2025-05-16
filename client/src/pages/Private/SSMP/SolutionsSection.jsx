import { useState } from "react";
import { Stack, Button, TextField, IconButton } from "@mui/material";
import { Add, Check, Close, Delete, Edit } from "@mui/icons-material";
import { EllipsisText } from "../../../theme/styledComponents";
import { getDocumentId } from "../../../utils/toTitleCase";
import toast from "react-hot-toast";
import {
  useCreateSolutionMutation,
  useDeleteSolutionMutation,
  useUpdateSolutionMutation,
} from "../../../apis/violationCode/questionAndSolution";

const SolutionsSection = ({ solutions, setValue, violationCodeId }) => {
  const [editingSolution, setEditingSolution] = useState(null);
  const [addingSolution, setAddingSolution] = useState(null);

  const [updateSolution, { isLoading: isUpdatingSolution }] =
    useUpdateSolutionMutation();
  const [addSolution, { isLoading: isAddingSolution }] =
    useCreateSolutionMutation();
  const [deleteSolution, { isLoading: isDeletingSolution }] =
    useDeleteSolutionMutation();

  const handleUpdateSolution = async (data) => {
    if (!violationCodeId) {
      // Local update for new violation
      const updated = solutions.map((s) =>
        getDocumentId(s) === getDocumentId(data) ? data : s
      );
      setValue("solutions", updated);
      setEditingSolution(null);
      return;
    }
    const solutionId = getDocumentId(data);
    if (!violationCodeId || !solutionId) {
      toast.error("Violation and solution ID is required.");
      return;
    }
    try {
      const { data: updatedSolutions } = await updateSolution({
        violationCodeId,
        solutionId,
        body: { text: data?.text },
      }).unwrap();
      setValue("solutions", [...updatedSolutions]);
      setEditingSolution(null);
      toast.success("Violation solution saved successfully!");
    } catch (error) {
      errorMessages(error);
    }
  };

  const handleAddSolution = async (data) => {
    if (!violationCodeId) {
      setValue("solutions", [
        ...solutions,
        { ...data, _id: Date.now().toString() },
      ]);
      setAddingSolution(null);
      return;
    }

    try {
      const { data: updatedSolutions } = await addSolution({
        violationCodeId,
        body: { text: data?.text },
      }).unwrap();
      setValue("solutions", [...updatedSolutions]);
      setAddingSolution(null);
      toast.success("Violation solution created successfully!");
    } catch (error) {
      errorMessages(error);
    }
  };

  const handleDeleteSolution = async (data) => {
    if (!violationCodeId) {
      // Local delete for new violation
      setValue(
        "solutions",
        solutions.filter((s) => getDocumentId(s) !== getDocumentId(data))
      );
      return;
    }
    const solutionId = getDocumentId(data);
    if (!violationCodeId || !solutionId) {
      toast.error("Violation and solution ID is required.");
      return;
    }
    try {
      const { data: updatedSolutions } = await deleteSolution({
        violationCodeId,
        solutionId,
        body: { text: data?.text },
      }).unwrap();
      setValue("solutions", [...updatedSolutions]);
      setEditingSolution(null);
      toast.success("Violation solution deleted successfully!");
    } catch (error) {
      errorMessages(error);
    }
  };

  return (
    <>
      {solutions?.map((solution, idx) => (
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={1}
          width={"100%"}
          component={"div"}
          mb={1}
          key={idx + 1}
        >
          <>
            {editingSolution &&
            getDocumentId(editingSolution) === getDocumentId(solution) ? (
              <TextField
                disabled={
                  getDocumentId(editingSolution) === getDocumentId(solution) &&
                  isUpdatingSolution
                }
                multiline
                minRows={4}
                maxRows={8}
                size="small"
                fullWidth
                value={editingSolution?.text || ""}
                onChange={(e) =>
                  setEditingSolution((p) => ({
                    ...p,
                    text: e.target.value,
                  }))
                }
                placeholder="Solution text"
              />
            ) : (
              <EllipsisText color="primary" fontSize={14}>
                {solution.text}
              </EllipsisText>
            )}
          </>
          <Stack direction={"row"} alignItems={"center"} component={"div"}>
            {editingSolution &&
            getDocumentId(editingSolution) === getDocumentId(solution) ? (
              <>
                <IconButton
                  disabled={
                    getDocumentId(editingSolution) ===
                      getDocumentId(solution) && isUpdatingSolution
                  }
                  size="small"
                  onClick={() => {
                    setEditingSolution(null);
                  }}
                >
                  <Close fontSize="small" color="error" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => {
                    handleUpdateSolution(editingSolution);
                  }}
                  disabled={
                    getDocumentId(editingSolution) ===
                      getDocumentId(solution) && isUpdatingSolution
                  }
                >
                  <Check fontSize="small" color="primary" />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  size="small"
                  onClick={() => {
                    handleDeleteSolution(solution);
                  }}
                  disabled={
                    (getDocumentId(editingSolution) ===
                      getDocumentId(solution) &&
                      isUpdatingSolution) ||
                    isDeletingSolution
                  }
                >
                  <Delete fontSize="small" color="error" />
                </IconButton>
                <IconButton
                  disabled={isDeletingSolution}
                  size="small"
                  onClick={() => {
                    setEditingSolution(solution);
                  }}
                >
                  <Edit fontSize="small" color="primary" />
                </IconButton>
              </>
            )}
          </Stack>
        </Stack>
      ))}
      {addingSolution && (
        <Stack direction={"row"} alignItems={"center"} mb={1}>
          <TextField
            disabled={isAddingSolution}
            multiline
            minRows={4}
            maxRows={8}
            size="small"
            fullWidth
            value={addingSolution?.text || ""}
            onChange={(e) =>
              setAddingSolution({
                ...addingSolution,
                text: e.target.value,
              })
            }
            placeholder="Enter new solution text"
          />
          <IconButton
            size="small"
            onClick={() => {
              setAddingSolution(null);
            }}
          >
            <Close fontSize="small" color="error" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              handleAddSolution(addingSolution);
            }}
            disabled={!addingSolution?.text?.trim() || isAddingSolution}
          >
            <Check fontSize="small" color="primary" />
          </IconButton>
        </Stack>
      )}
      <Button
        size="small"
        variant="outlined"
        startIcon={<Add />}
        onClick={() => {
          setAddingSolution({ text: "", _id: Date.now().toString() });
        }}
      >
        Add Solution
      </Button>
    </>
  );
};

export default SolutionsSection;
