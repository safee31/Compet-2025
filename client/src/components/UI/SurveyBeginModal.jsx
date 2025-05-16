import React, { useState, useMemo } from "react";
import {
  Typography,
  IconButton,
  Stack,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from "@mui/material";
import { useSubmitSurveyResponseMutation } from "../../apis/Survey/survey";
import { getDocumentId } from "../../utils/toTitleCase";
import toast from "react-hot-toast";
import { errorMessages } from "../../apis/messageHandler";

const SurveyBeginModalWrapper = ({ open, onClose, survey, children }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [addComment, setAddComment] = useState(true);
  const [ratingError, setRatingError] = useState(false);

  const [submitSurveyResponse, { isLoading }] =
    useSubmitSurveyResponseMutation();

  const questions = survey?.questions || [];

  const handleRatingSelect = (rating) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion]: {
        ...prev[currentQuestion],
        question: getDocumentId(questions[currentQuestion]),
        rating,
      },
    }));
    setRatingError(false); // Clear error when rating is selected
  };

  const handleCommentChange = (e) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion]: {
        ...prev[currentQuestion],
        question: getDocumentId(questions[currentQuestion]),
        answer: e.target.value,
      },
    }));
  };

  const handleNext = () => {
    if (!responses[currentQuestion]?.rating) {
      setRatingError(true);
      return;
    }
    setCurrentQuestion((prev) => prev + 1);
    setAddComment(true);
    setRatingError(false);
  };

  const handlePrevious = () => {
    setCurrentQuestion((prev) => prev - 1);
    setRatingError(false);
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    if (Object.keys(responses).length !== questions.length) {
      toast.error("Please answer all questions before submitting.");
      return;
    }
    const payloadResponses = Object.values(responses);
    try {
      await submitSurveyResponse({
        id: getDocumentId(survey),
        responses: payloadResponses,
      }).unwrap();
      onClose();
    } catch (error) {
      errorMessages(error);
    }
  };

  const isLastQuestion = useMemo(
    () => currentQuestion === questions.length - 1,
    [currentQuestion, questions.length]
  );

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle component={'div'} display="flex" justifyContent="space-between">
          <Typography variant="h6">
            {questions[currentQuestion]?.text}
          </Typography>
          <Typography
            component={"span"}
            color="textSecondary"
            whiteSpace={"nowrap"}
          >
            <Typography component={"span"} color="success" fontSize={20}>
              {currentQuestion + 1}
            </Typography>{" "}
            / {questions.length}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack direction="row" justifyContent="center" mb={2} flexWrap="wrap">
            {[1, 2, 3, 4, 5].map((rating) => (
              <IconButton
                key={rating}
                onClick={() => handleRatingSelect(rating)}
                sx={{
                  border:
                    responses[currentQuestion]?.rating === rating
                      ? "2px solid"
                      : "2px solid transparent",
                  borderColor:
                    responses[currentQuestion]?.rating === rating
                      ? "primary.main"
                      : "transparent",
                  borderRadius: "50%",
                  color: "black",
                }}
              >
                <span>{["😡", "😟", "😐", "😊", "😁"][rating - 1]}</span>
              </IconButton>
            ))}
          </Stack>

          {ratingError && (
            <Typography color="error" variant="body2">
              Rating is required.
            </Typography>
          )}

          <Typography variant="body1" gutterBottom>
            Do you wish to add any comments?
          </Typography>
          <RadioGroup
            row
            value={addComment ? "Yes" : "No"}
            onChange={(e) => setAddComment(e.target.value === "Yes")}
          >
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>

          {addComment && (
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Enter comments here"
              value={responses[currentQuestion]?.answer || ""}
              onChange={handleCommentChange}
            />
          )}

          <DialogActions sx={{ justifyContent: "center", mt: 3 }}>
            <Button
              fullWidth
              size="small"
              disabled={currentQuestion === 0 || isLoading}
              variant="outlined"
              onClick={handlePrevious}
            >
              Previous
            </Button>
            {!isLastQuestion ? (
              <Button
                fullWidth
                size="small"
                disabled={isLoading}
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            ) : (
              <Button
                fullWidth
                size="small"
                disabled={isLoading}
                variant="contained"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            )}
          </DialogActions>
        </DialogContent>
      </Dialog>
      {children}
    </>
  );
};

export default SurveyBeginModalWrapper;
