import React, { useMemo, useState } from "react";
import PageHeader from "../../../components/UI/PrivatePageHeader";
import {
  Box,
  Button,
  // Card,
  Grid2,
  IconButton,
  // Paper,
  Stack,
  // Typography,
} from "@mui/material";
import { SpinnerMd } from "../../../components/Spinner";
// import DataInfo from "../../../components/DataInfo";
import { Add, Edit } from "@mui/icons-material";
// import { useSelector } from "react-redux";
import OnboardingQuestionFormModal from "./FormModal";
// import OnboardingQuestionDetailsModal from "./DetailsModal";
import DataTable from "../../../components/Table";
import { SearchFilter } from "../../../components/Filters";
// import { CustomPagination } from "../../../components/CustomPagination";
import {
  useGetAllOnboardQuestionsQuery,
  // useGetUserQuestionsQuery,
} from "../../../apis/Onboarding-Q&A/questions";

const AdminOnboardingQuestionsTable = () => {
  const [query, setQuery] = useState({ page: 1, limit: 10 });
  const { data, isLoading, isFetching } = useGetAllOnboardQuestionsQuery({
    ...query,
  });
  const [initialData, setInitialData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const questionRows = useMemo(() => {
    return data?.questions?.map((question) => ({
      text: question?.text,
      action: (
        <Stack direction={"row"} alignItems={"center"}>
          <IconButton
            color="primary"
            size="small"
            onClick={() => {
              setInitialData(question);
              setShowForm(true);
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Stack>
      ),
    }));
  }, [data]);

  return (
    <>
      <PageHeader
        title="Onboarding Questions"
        menuBar={true}
        rightContent={
          <Button
            onClick={() => {
              setInitialData(null);
              setShowForm(true);
            }}
            variant="contained"
            startIcon={<Add />}
          >
            New
          </Button>
        }
      />
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12 }}>
          <Stack mb={1.5} gap={2} direction={"row"} alignItems={"center"}>
            <SearchFilter
              query={query}
              setQuery={setQuery}
              disabled={isFetching}
            />
          </Stack>
          {isLoading ? (
            <SpinnerMd />
          ) : (
            <DataTable
              columns={[
                { id: "text", label: "Question Text" },
                { id: "action", label: "Action" },
              ]}
              rows={questionRows}
              isPaginationLoading={isFetching}
              showPagination={true}
              paginationOptions={{
                itemsPerPage: query?.limit,
                currentPage: query.page,
                totalItems: data?.totalDocs || 0,
                handlePageChange: (evt, page) => {
                  page !== query?.page && setQuery((p) => ({ ...p, page }));
                },
                handleLimitChange: (evt) => {
                  const limit = evt.target.value;
                  limit !== query?.limit && setQuery((p) => ({ ...p, limit }));
                },
                isLoading: isFetching,
                hideInfo: true,
              }}
            />
          )}
        </Grid2>
        {showForm && (
          <OnboardingQuestionFormModal
            initialData={initialData}
            showForm={showForm}
            onClose={() => setShowForm(false)}
          />
        )}
      </Grid2>
    </>
  );
};

// const ManagerOrEmployeeOnboardingQuestionsList = () => {
//   const [query, setQuery] = useState({ page: 1, limit: 10 });
//   const { data, isLoading, isFetching } = useGetUserQuestionsQuery({
//     ...query,
//     isAnswered: true,
//   });
//   const [initialData, setInitialData] = useState(null);
//   const [showForm, setShowForm] = useState(false);

//   return (
//     <>
//       <PageHeader title="Onboarding Questions" menuBar={true} />
//       <Stack mb={2} gap={2} direction={"row"} alignItems={"center"}>
//         <SearchFilter query={query} setQuery={setQuery} disabled={isFetching} />
//       </Stack>
//       <Grid2 container spacing={2}>
//         <Grid2 size={{ xs: 12,  }}>
//           {isLoading ? (
//             <SpinnerMd />
//           ) : !data?.questions?.length ? (
//             <DataInfo />
//           ) : (
//             <Box>
//               {data?.questions?.map((question, idx) => (
//                 <Paper
//                   key={idx}
//                   sx={{ p: 1, mb: 1.5, cursor: "pointer" }}
//                   onClick={() => {
//                     setInitialData(question);
//                     setShowForm(true);
//                   }}
//                 >
//                   <Typography variant="body1" fontWeight="bold" color="primary">
//                     {question?.text}
//                   </Typography>
//                 </Paper>
//               ))}
//               <CustomPagination
//                 hideInfo={true}
//                 isLoading={isFetching}
//                 handlePageChange={(page) => {
//                   page !== query?.page && setQuery((p) => ({ ...p, page }));
//                 }}
//                 handleLimitChange={(limit) => {
//                   limit !== query?.limit && setQuery((p) => ({ ...p, limit }));
//                 }}
//                 totalItems={data?.totalDocs}
//                 itemsPerPage={query?.limit}
//                 currentPage={query?.page}
//               />
//             </Box>
//           )}
//         </Grid2>
//         {/* <Grid2 size={{ xs: 12, md: 4 }}>
//           <Card sx={{ mb: 2, p: 1.5 }}>
//             <Typography variant="body1">This Month</Typography>
//             <Typography variant="body2" color="textSecondary">
//               You need to create at least one onboarding question per month.
//             </Typography>
//             <Button
//               variant="contained"
//               color="primaryLight"
//               fullWidth
//               sx={{ mt: 2 }}
//             >
//               Create New Question
//             </Button>
//           </Card>
//         </Grid2> */}
//         {showForm && (
//           <OnboardingQuestionDetailsModal
//             questionData={initialData}
//             open={showForm}
//             onClose={() => setShowForm(false)}
//           />
//         )}
//       </Grid2>
//     </>
//   );
// };

const OnboardingQuestionsPage = () => {
  // const userDetails = useSelector((s) => s?.account?.details);
  // const isManager = userDetails?.role?.type === 2;
  // const isEmployee = userDetails?.role?.type === 3;

  return (
    <Box>
      {/* {isManager ? (
        <ManagerOrEmployeeOnboardingQuestionsList />
      ) : isEmployee ? (
        <ManagerOrEmployeeOnboardingQuestionsList />
      ) : ( */}
      <AdminOnboardingQuestionsTable />
      {/* )} */}
    </Box>
  );
};

export default OnboardingQuestionsPage;
