import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Stack,
} from "@mui/material";
import { errorMessages } from "../../apis/messageHandler";
import { useDispatch } from "react-redux";
import { authenticateEmployee } from "../../redux/Slices/Account";
import { useSubmitOnbaordAnswersMutation } from "../../apis/Employee/onboarding";
import LogoutButton from "../../components/LogoutButton";
import { SpinnerSm } from "../../components/Spinner";
import DataInfo from "../../components/DataInfo";
import { getDocumentId } from "../../utils/toTitleCase";
import { useGetUserQuestionsQuery } from "../../apis/Onboarding-Q&A/questions";

const OnboardingAnswers = () => {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);

  // Fetch the onboarding questions
  const { data, isLoading: questionsLoading } = useGetUserQuestionsQuery({
    isAll: true,
    isAnswered: "false",
  });
  const onboardingQuestions = data?.questions || [];
  const [submitOnboardAnswers, { isLoading }] =
    useSubmitOnbaordAnswersMutation();

  // Initialize the form with the questions data as an array of objects
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      answers: onboardingQuestions?.map((question) => ({
        answer: "",
        questionSnapshot: question?.text || "N/A",
        question: getDocumentId(question),
      })),
    },
  });

  // Watch the current question's answer
  const currentAnswer = watch(`answers.${currentStep}.answer`);

  useEffect(() => {
    // Reset the form when the data changes
    if (onboardingQuestions?.length) {
      reset({
        answers: onboardingQuestions?.map((question) => ({
          answer: "",
          questionSnapshot: question?.text || "N/A",
          question: getDocumentId(question),
        })),
      });
    }
  }, [onboardingQuestions, reset]);

  const handleNext = async () => {
    const isValid = await trigger(`answers.${currentStep}.answer`);
    if (isValid && currentStep < onboardingQuestions?.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data) => {
    try {
      await submitOnboardAnswers({ answers: data.answers }).unwrap();
      dispatch(authenticateEmployee());
      console.log("Answers submitted successfully!");
    } catch (error) {
      errorMessages(error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ p: 0 }}>
      <Typography
        variant="h5"
        color="white"
        fontWeight="bold"
        align="center"
        py={2}
      >
        Welcome!
      </Typography>
      <Box
        width="100%"
        bgcolor="white.main"
        p={3}
        borderRadius={2}
        boxShadow={3}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Onboarding Questions
          </Typography>
          <Typography align="right" variant="body2">
            <Typography component="span" color="primary">
              {currentStep + 1}
            </Typography>{" "}
            / {onboardingQuestions.length}
          </Typography>
        </Stack>
        {questionsLoading ? (
          <SpinnerSm />
        ) : !onboardingQuestions?.length ? (
          <DataInfo />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box>
              <Typography
                variant="body1"
                mb={2}
                fontWeight="bold"
                color="primary"
                gutterBottom
              >
                {onboardingQuestions[currentStep]?.text}
              </Typography>
              <Controller
                name={`answers.${currentStep}.answer`}
                control={control}
                rules={{
                  required: "Answer is required.",
                  validate: (value) =>
                    value.trim() !== "" || "Answer cannot be empty.",
                }}
                render={({ field }) => (
                  <TextField
                    label="Answer"
                    size="small"
                    {...field}
                    fullWidth
                    value={currentAnswer || ""}
                    placeholder="Your answer..."
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                    error={!!errors.answers?.[currentStep]?.answer}
                    helperText={errors.answers?.[currentStep]?.answer?.message}
                  />
                )}
              />
            </Box>

            <Stack
              direction="row"
              justifyContent={"center"}
              alignItems={"center"}
              spacing={2}
              mt={3}
            >
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                fullWidth
              >
                Previous
              </Button>
              {currentStep < onboardingQuestions.length - 1 ? (
                <Button fullWidth variant="contained" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit Answers"}
                </Button>
              )}
            </Stack>
          </form>
        )}
        <LogoutButton sx={{ mt: 2 }} fullWidth />
      </Box>
    </Container>
  );
};

export default OnboardingAnswers;
