import React from "react";
import { Box, Grid2, Stack } from "@mui/material";
import { useGetUserQuestionsQuery } from "../../../../apis/Onboarding-Q&A/questions";
import DataInfo from "../../../../components/DataInfo";
import { SpinnerMd } from "../../../../components/Spinner";
import { getDocumentId } from "../../../../utils/toTitleCase";
import OnbaordingQuestion from "../../../../components/UI/OnboardingQuestion";

const ManagerOrEmployeeOnboardingQuestionsList = ({ accountData }) => {
  // const [query, setQuery] = useState({ page: 1, limit: 10 });
  const { data, isLoading } = useGetUserQuestionsQuery(
    {
      // ...query,
      isAnswered: true,
      isAll: true,
      user: getDocumentId(accountData?.user),
    },
    { skip: !getDocumentId(accountData?.user) }
  );

  return (
    <>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12 }}>
          {isLoading ? (
            <SpinnerMd />
          ) : !data?.questions?.length ? (
            <DataInfo />
          ) : (
            <Stack gap={1.5}>
              {data?.questions?.map((question, idx) => (
                <OnbaordingQuestion question={question} index={idx} />
              ))}
            </Stack>
          )}
        </Grid2>
      </Grid2>
    </>
  );
};

const OnboardingAnsweredQuestionsPage = ({ accountData }) => {
  //   const userDetails = useSelector((s) => s?.account?.details);

  return (
    <Box>
      <ManagerOrEmployeeOnboardingQuestionsList accountData={accountData} />
    </Box>
  );
};

export default OnboardingAnsweredQuestionsPage;
