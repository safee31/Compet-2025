import { useState } from "react";
import { Stack, Button, TextField, IconButton } from "@mui/material";
import { Add, Check, Close, Delete, Edit } from "@mui/icons-material";
import { EllipsisText } from "../../../theme/styledComponents";
import { getDocumentId } from "../../../utils/toTitleCase";
import toast from "react-hot-toast";
import {
  useCreateQuestionMutation,
  useDeleteQuestionMutation,
  useUpdateQuestionMutation,
} from "../../../apis/violationCode/questionAndSolution";

const QuestionsSection = ({ questions, setValue, violationCodeId }) => {
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [addingQuestion, setAddingQuestion] = useState(null);

  const [updateQuestion, { isLoading: isUpdatingQuestion }] =
    useUpdateQuestionMutation();
  const [addQuestion, { isLoading: isAddingQuestion }] =
    useCreateQuestionMutation();
  const [deleteQuestion, { isLoading: isDeletingQuestion }] =
    useDeleteQuestionMutation();

  const handleUpdateQuestion = async (data) => {
    if (!violationCodeId) {
      // Update local form state
      const updated = questions.map((q) =>
        getDocumentId(q) === getDocumentId(data) ? data : q
      );
      setValue("questions", updated);
      setEditingQuestion(null);
      return;
    }
    const questionId = getDocumentId(data);
    if (!violationCodeId || !questionId) {
      toast.error("Violation and question ID is required.");
      return;
    }
    try {
      const { data: updatedQuestions } = await updateQuestion({
        violationCodeId,
        questionId,
        body: { text: data?.text },
      }).unwrap();
      setValue("questions", [...updatedQuestions]);
      setEditingQuestion(null);
      toast.success("Question saved successfully!");
    } catch (error) {
      errorMessages(error);
    }
  };

  const handleAddQuestion = async (data) => {
    if (!violationCodeId) {
      setValue("questions", [
        ...questions,
        { ...data, _id: Date.now().toString() },
      ]);
      setAddingQuestion(null);
      return;
    }

    try {
      const { data: updatedQuestions } = await addQuestion({
        violationCodeId,
        body: { text: data?.text },
      }).unwrap();
      setValue("questions", [...updatedQuestions]);
      setAddingQuestion(null);
      toast.success("Question created successfully!");
    } catch (error) {
      errorMessages(error);
    }
  };

  const handleDeleteQuestion = async (data) => {
    if (!violationCodeId) {
      setValue(
        "questions",
        questions.filter((q) => getDocumentId(q) !== getDocumentId(data))
      );

      return;
    }

    const questionId = getDocumentId(data);
    if (!violationCodeId || !questionId) {
      toast.error("Violation and question ID is required.");
      return;
    }
    try {
      const { data: updatedQuestions } = await deleteQuestion({
        violationCodeId,
        questionId,
        body: { text: data?.text },
      }).unwrap();
      setValue("questions", [...updatedQuestions]);
      setEditingQuestion(null);
      toast.success("Question deleted successfully!");
    } catch (error) {
      errorMessages(error);
    }
  };

  return (
    <>
      {questions?.map((question, idx) => (
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
            {editingQuestion &&
            getDocumentId(editingQuestion) === getDocumentId(question) ? (
              <TextField
                disabled={
                  getDocumentId(editingQuestion) === getDocumentId(question) &&
                  isUpdatingQuestion
                }
                multiline
                minRows={2}
                maxRows={4}
                size="small"
                fullWidth
                value={editingQuestion?.text || ""}
                onChange={(e) =>
                  setEditingQuestion((p) => ({
                    ...p,
                    text: e.target.value,
                  }))
                }
                placeholder="Question text"
              />
            ) : (
              <EllipsisText color="primary" fontSize={14}>
                {question.text}
              </EllipsisText>
            )}
          </>
          <Stack direction={"row"} alignItems={"center"} component={"div"}>
            {editingQuestion &&
            getDocumentId(editingQuestion) === getDocumentId(question) ? (
              <>
                <IconButton
                  disabled={
                    getDocumentId(editingQuestion) ===
                      getDocumentId(question) && isUpdatingQuestion
                  }
                  size="small"
                  onClick={() => {
                    setEditingQuestion(null);
                  }}
                >
                  <Close fontSize="small" color="error" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => {
                    handleUpdateQuestion(editingQuestion);
                  }}
                  disabled={
                    getDocumentId(editingQuestion) ===
                      getDocumentId(question) && isUpdatingQuestion
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
                    handleDeleteQuestion(question);
                  }}
                  disabled={
                    (getDocumentId(editingQuestion) ===
                      getDocumentId(question) &&
                      isUpdatingQuestion) ||
                    isDeletingQuestion
                  }
                >
                  <Delete fontSize="small" color="error" />
                </IconButton>
                <IconButton
                  disabled={isDeletingQuestion}
                  size="small"
                  onClick={() => {
                    setEditingQuestion(question);
                  }}
                >
                  <Edit fontSize="small" color="primary" />
                </IconButton>
              </>
            )}
          </Stack>
        </Stack>
      ))}
      {addingQuestion && (
        <Stack direction={"row"} alignItems={"center"} mb={1}>
          <TextField
            disabled={isAddingQuestion}
            multiline
            minRows={2}
            maxRows={4}
            size="small"
            fullWidth
            value={addingQuestion?.text || ""}
            onChange={(e) =>
              setAddingQuestion({
                ...addingQuestion,
                text: e.target.value,
              })
            }
            placeholder="Enter new question"
          />
          <IconButton
            size="small"
            onClick={() => {
              setAddingQuestion(null);
            }}
          >
            <Close fontSize="small" color="error" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              handleAddQuestion(addingQuestion);
            }}
            disabled={!addingQuestion?.text?.trim() || isAddingQuestion}
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
          setAddingQuestion({ text: "" });
        }}
      >
        Add Question
      </Button>
    </>
  );
};

export default QuestionsSection;
