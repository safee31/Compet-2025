import React, { useState } from "react";
import { Box, Typography, IconButton, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DataInfo from "../../../components/DataInfo";
import { formatDateStatic, formatDateTimeFromISO } from "../../../utils/dateTime";
import {
  useDeleteSurveySubmissionMutation,
  useGetSurveyResultsQuery,
} from "../../../apis/Survey/survey";
import { getDocumentId, getMin0Number } from "../../../utils/toTitleCase";
import { SpinnerMd } from "../../../components/Spinner";
import ListItem from "../../../components/UI/ListItem";
import SurveyDetails from "./SurveyDetails";
import toast from "react-hot-toast";
import { errorMessages } from "../../../apis/messageHandler";

const SurveyResultsList = ({ survey, onBack }) => {
  const [query, setQuery] = useState({ page: 1, limit: 10 });
  const [selectedResponse, setSelectedResponse] = useState(null);

  const {
    data = { responses: [] },
    isLoading,
    isFetching,
  } = useGetSurveyResultsQuery(
    { ...query, survey: getDocumentId(survey) },
    {
      skip: !getDocumentId(survey),
    }
  );
  const [deleteSurveySubmission, { isLoading: isDeleting }] =
    useDeleteSurveySubmissionMutation();

  const handleDeleteSubmission = async (id) => {
    try {
      await deleteSurveySubmission({
        id,
        surveyId: getDocumentId(survey),
      }).unwrap();
      toast.success("Submission deleted successfully.");
    } catch (error) {
      errorMessages(error);
    }
  };
  return (
    <Box>
      {selectedResponse ? (
        <SurveyDetails
          response={selectedResponse}
          onBack={() => setSelectedResponse(null)}
          survey={survey}
        />
      ) : (
        <>
          <Box display="flex" alignItems="center" mb={1}>
            <IconButton onClick={onBack} color="disabled">
              <ArrowBackIcon />
            </IconButton>
            <Typography fontWeight="bold" color="textPrimary">
              Back to Survey's
            </Typography>
          </Box>
          <Typography fontWeight="bold" color="textPrimary" mb={1}>
            {formatDateTimeFromISO(survey.nextTriggerDate, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Typography>

          {isLoading ? (
            <SpinnerMd />
          ) : data?.responses && !data?.responses?.length ? (
            <DataInfo />
          ) : data?.responses?.length > 0 ? (
            <Stack gap={1.5}>
              {data?.responses?.map((result, idx) => (
                <ListItem
                  fields={[
                    {
                      label: "Name",
                      render: `${result?.user?.personalInfo?.firstName} ${result?.user?.personalInfo?.lastName}`,
                      ellipses: true,
                    },
                    {
                      label: "Company",
                      render: survey?.company?.name,
                      ellipses: true,
                    },
                    {
                      label: "Date",
                      render: formatDateStatic(result.submittedAt),
                    },
                    {
                      label: "Avg Score",
                      render: getMin0Number(result?.avgScore),
                    },
                  ]}
                  key={idx + 1}
                  onClick={() => setSelectedResponse(result)}
                  allowDelete={true}
                  // allowSelect={true}
                  handleDelete={() =>
                    handleDeleteSubmission(getDocumentId(result))
                  }
                  isLoading={isDeleting || isFetching}
                />
              ))}
            </Stack>
          ) : (
            <DataInfo />
          )}
        </>
      )}
    </Box>
  );
};

export default SurveyResultsList;
