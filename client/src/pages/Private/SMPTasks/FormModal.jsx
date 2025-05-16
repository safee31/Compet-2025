import { useEffect, useState, useRef, useCallback, memo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputLabel,
  Grid2,
  Stack,
  IconButton,
  CircularProgress,
  Typography,
  Box,
  Alert,
  LinearProgress,
  FormHelperText,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { errorMessages } from "../../../apis/messageHandler";
import toast from "react-hot-toast";
import {
  useCreateTaskMutation,
  useStartQASessionMutation,
  useUpdateTaskMutation,
} from "../../../apis/SMPTask/smp-task";
import { generateS3FilePath, validateFiles } from "../../../utils/files";
import { Close, Upload, CheckCircleOutline } from "@mui/icons-material";
import { EllipsisText } from "../../../theme/styledComponents";
import { getDocumentId } from "../../../utils/toTitleCase";
import { useSelector } from "react-redux";

import { handleSessionData } from "./socket-qa-session";
import BackdropLoading from "../../../components/BackdropLoading";

const QASession = ({ taskId, userId, onComplete }) => {
  const [state, setState] = useState({
    question: "",
    answer: "",
    isLoading: true,
    error: null,
    sessionStatus: "pending",
  });

  const socketRef = useRef(null);

  useEffect(() => {
    if (!taskId || !userId) return;

    socketRef.current = handleSessionData(taskId, userId, socketRef, setState);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [taskId, userId]);

  const handleSubmitAnswer = useCallback(() => {
    if (!state.answer.trim() || state.isLoading || !socketRef.current) return;

    setState((prevState) => ({ ...prevState, isLoading: true }));
    socketRef.current.emit("submit-smp-answer", {
      taskId,
      userId,
      answer: state.answer,
    });
    setState((prevState) => ({ ...prevState, answer: "" }));
  }, [state, taskId, userId]);

  const handleRetry = () => {
    setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
    socketRef.current = handleSessionData(taskId, userId, socketRef, setState);
  };

  return (
    <Box position={"relative"}>
      {state.error ? (
        <Stack gap={2} alignItems="center" width="100%">
          <Alert severity="error">{state.error}</Alert>
          <Button variant="contained" onClick={handleRetry}>
            Retry
          </Button>
        </Stack>
      ) : state.sessionStatus === "completed" ? (
        <Stack gap={2} alignItems="center" width="100%">
          <Alert severity="success">QA session completed!</Alert>
          <Button variant="contained" onClick={onComplete}>
            Close
          </Button>
        </Stack>
      ) : (
        <>
          {state.isLoading && <BackdropLoading loading={state?.isLoading} />}
          <Typography color="primary" fontSize={16} mb={0.5}>
            {state.question}
          </Typography>
          <TextField
            fullWidth
            value={state.answer}
            onChange={(e) =>
              setState((prev) => ({ ...prev, answer: e.target.value }))
            }
            placeholder="Your Answer"
            multiline
            minRows={4}
            maxRows={6}
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleSubmitAnswer}
              disabled={state.isLoading || !state.answer.trim()}
            >
              Submit Answer
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

// Status display component (processing or completed)
const TaskStatusDisplay = memo(({ status, progress = 0 }) => {
  // Ensure progress is within 0-100 range
  const safeProgress = Math.max(0, Math.min(100, progress));

  if (status === "completed") {
    return (
      <Box sx={{ width: "100%", my: 4, textAlign: "center" }}>
        <CheckCircleOutline
          sx={{ fontSize: 60, color: "success.main", mb: 2 }}
        />
        <Typography variant="h6" sx={{ mb: 1 }}>
          Task Completed Successfully
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Your document has been fully processed and is ready for review.
        </Typography>
        <Alert severity="success" sx={{ mt: 2 }}>
          All processing steps have been completed. You can now view the
          results.
        </Alert>
      </Box>
    );
  } else if (status === "processing") {
    // Generate appropriate message based on progress
    const getMessage = () => {
      if (safeProgress < 25) {
        return "Starting document analysis...";
      } else if (safeProgress < 50) {
        return "Extracting key information...";
      } else if (safeProgress < 75) {
        return "Processing data points...";
      } else if (safeProgress < 95) {
        return "Finalizing task processing...";
      } else {
        return "Finishing task processing...";
      }
    };

    return (
      <Box sx={{ width: "100%", my: 4, textAlign: "center" }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Processing Your Task
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {getMessage()}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={safeProgress}
          sx={{ height: 10, borderRadius: 1 }}
        />
        <Typography variant="body2" sx={{ mt: 1 }}>
          {safeProgress}% complete
        </Typography>
      </Box>
    );
  }

  return null;
});

const TaskModal = ({ initialData, showForm, onClose, refetch = () => {} }) => {
  const [createdTaskId, setCreatedTaskId] = useState(null);
  const [showQASession, setShowQASession] = useState(false);
  const [showAutoQAButton, setShowAutoQAButton] = useState(false);
  // const [isTaskActionLoading, setIsTaskActionLoading] = useState(false);
  const user = useSelector((s) => s?.account?.details?.user);
  const userId = getDocumentId(user) || "";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      title: "",
      companyDetails: "",
      smpDocument: "",
      status: "pending",
    },
  });

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [startQASession, { isLoading: isQALoading }] =
    useStartQASessionMutation();

  const smpDocument = watch("smpDocument");
  const taskStatus = watch("status");

  // Set form values when initialData changes
  useEffect(() => {
    if (initialData) {
      setValue("title", initialData?.title);
      setValue("companyDetails", initialData?.companyDetails);
      setValue("smpDocument", initialData?.smpDocument || "");
      setValue("status", initialData?.status || "pending");

      // Check if task is already in 'qa-session' status
      setShowAutoQAButton(
        initialData?.status === "qa-session" ||
          initialData?.status === "pending"
      );
    } else {
      reset();
      setShowAutoQAButton(false);
    }
    setCreatedTaskId(getDocumentId(initialData));
  }, [initialData, setValue, reset]);

  // Handle file upload
  const handleFileUpload = useCallback(
    (event) => {
      const files = event.target.files;
      const { valid = false, message } = validateFiles(
        files,
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        25 // 25MB max size
      );
      if (valid) {
        setValue("smpDocument", files[0]);
        clearErrors("smpDocument");
      } else {
        setError("smpDocument", { message });
        event.target.value = null;
      }
    },
    [setValue, setError]
  );

  // Start QA session
  const handleStartQA = async (taskId) => {
    if (!taskId) taskId = createdTaskId;
    if (!taskId) {
      toast.error("Task ID not found.");
      return;
    }

    try {
      await startQASession(taskId).unwrap();
      toast.success("QA session started successfully!");
      setShowQASession(true);
    } catch (error) {
      errorMessages(error);
    }
  };

  // Handle QA session completion
  const handleQAComplete = useCallback(() => {
    setShowQASession(false);
    refetch();
    onClose();
  }, [refetch, onClose]);

  // Submit form data
  const onSubmit = async (data) => {
    if (!data.smpDocument) {
      setError("smpDocument", { message: "SMP document is required." });
      return;
    }
    try {
      const payload = {
        title: data.title,
        companyDetails: data.companyDetails,
        file: data.smpDocument instanceof File ? data.smpDocument : "",
        smpDocument: initialData?.smpDocument,
      };

      if (createdTaskId) {
        // Update existing task
        const { data: responseData } = await updateTask({
          id: createdTaskId,
          ...payload,
        }).unwrap();
        setCreatedTaskId(getDocumentId(responseData?.task));
        toast.success("Task updated successfully!");
        handleStartQA(getDocumentId(responseData?.task));
      } else {
        // Create new task
        const { data: responseData } = await createTask(payload).unwrap();
        setCreatedTaskId(getDocumentId(responseData?.task));
        toast.success("Task created successfully!");
        handleStartQA(getDocumentId(responseData?.task));
      }
    } catch (error) {
      errorMessages(error);
    }
  };

  // Determine task status for UI display
  const isProcessingOrCompleted =
    taskStatus === "processing" || taskStatus === "completed";
  const progress = initialData?.progress || 0;

  // Combined loading state for better UI consistency
  const isLoading = isCreating || isUpdating || isQALoading;

  return (
    <Dialog open={showForm} onClose={onClose} maxWidth="sm" fullWidth>
      {!showQASession ? (
        <>
          <DialogTitle>
            {createdTaskId ? "Task Details" : "New Task"}
            <Typography variant="body2" color="text.secondary">
              {createdTaskId
                ? taskStatus === "completed"
                  ? "Review completed task"
                  : taskStatus === "processing"
                  ? "Task is currently being processed"
                  : taskStatus === "qa-session"
                  ? "QA session in progress"
                  : "Update the task details"
                : "Provide task title, company details, and upload SMP document"}
            </Typography>
          </DialogTitle>
          <DialogContent>
            {isProcessingOrCompleted ? (
              // Show progress for processing status or completion message
              <TaskStatusDisplay status={taskStatus} progress={progress} />
            ) : showAutoQAButton ? (
              // Centered QA button for tasks in 'qa-session' status
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "250px",
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" sx={{ mb: 3 }}>
                  This task is ready for QA session
                </Typography>
                <Button
                  color="primaryLight"
                  variant="contained"
                  size="large"
                  onClick={() => handleStartQA(createdTaskId)}
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={16} /> : null}
                >
                  Start QA Session
                </Button>
              </Box>
            ) : (
              // Normal task form
              <Grid2 container spacing={2} sx={{ mt: 1 }}>
                <Grid2 size={{ xs: 12 }}>
                  <InputLabel>Title</InputLabel>
                  <TextField
                    size="small"
                    fullWidth
                    required
                    placeholder="Task title"
                    {...register("title", { required: "Title is required" })}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    disabled={isLoading}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                  <InputLabel>Company Details</InputLabel>
                  <TextField
                    size="small"
                    fullWidth
                    required
                    placeholder="Company name and details"
                    {...register("companyDetails", {
                      required: "Company details are required",
                    })}
                    error={!!errors.companyDetails}
                    helperText={errors.companyDetails?.message}
                    disabled={isLoading}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                  <InputLabel>SMP Document</InputLabel>
                  {smpDocument && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EllipsisText color="primary">
                        {typeof smpDocument === "string" ? (
                          <a
                            href={generateS3FilePath(smpDocument)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {smpDocument?.split("/").pop()}
                          </a>
                        ) : (
                          smpDocument?.name
                        )}
                      </EllipsisText>
                    </Stack>
                  )}
                  <label htmlFor="smpDocument-upload">
                    <input
                      id="smpDocument-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      hidden
                      onChange={handleFileUpload}
                      disabled={isLoading}
                    />
                    <Button
                      component="span"
                      startIcon={<Upload />}
                      variant="text"
                      disabled={isLoading}
                    >
                      Upload document
                    </Button>
                  </label>
                  {errors.smpDocument && (
                    <FormHelperText error variant="body2">
                      {errors.smpDocument?.message}
                    </FormHelperText>
                  )}
                </Grid2>
              </Grid2>
            )}
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", px: 3, pb: 3 }}>
            {!showAutoQAButton && !isProcessingOrCompleted && (
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {createdTaskId ? "Update Task" : "Create Task"}
              </Button>
            )}

            {/* {createdTaskId &&
              smpTaskStatus === "pending" &&
              !showAutoQAButton &&
              !isProcessingOrCompleted && (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleStartQA}
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                  Start QA Session
                </Button>
              )} */}

            <Button
              fullWidth
              variant={isProcessingOrCompleted ? "contained" : "outlined"}
              color={isProcessingOrCompleted ? "primary" : "text"}
              onClick={onClose}
            >
              {isProcessingOrCompleted ? "Close" : "Cancel"}
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogTitle>
            Interactive QA Session
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <QASession
              taskId={createdTaskId}
              userId={userId}
              onComplete={handleQAComplete}
            />
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default TaskModal;
