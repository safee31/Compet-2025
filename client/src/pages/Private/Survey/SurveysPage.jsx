import React, { useState } from "react";
import {
  Box,
  Button,
  Grid2,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import SurveyCard from "../../../components/UI/SurveyCard";
import PageHeader from "../../../components/UI/PrivatePageHeader";
import { Add, Person } from "@mui/icons-material";
import { useGetAllSurveysQuery } from "../../../apis/Survey/survey";
import { SpinnerMd } from "../../../components/Spinner";
import DataInfo from "../../../components/DataInfo";
import SurveyResultsList from "./SurveyResultsList";
import SurveyModal from "./FormModal";
import DeleteConfirmModal from "./DeleteModal";
import { CustomPagination } from "../../../components/CustomPagination";
import { useSelector } from "react-redux";

const SurveysPage = () => {
  const [query, setQuery] = useState({ page: 1, limit: 10, targetRole: "all" });
  const [surveyData, setSurveyData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { data, isLoading, isFetching } = useGetAllSurveysQuery({ ...query });
  const userDetails = useSelector((s) => s?.account?.details);
  const isAdmin = userDetails?.role?.type === 1;
  return (
    <Box>
      {showDeleteModal && (
        <DeleteConfirmModal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          survey={showDeleteModal}
        />
      )}

      {showForm && (
        <SurveyModal
          initialData={surveyData}
          showForm={showForm}
          onClose={() => {
            setSurveyData(null);
            setShowForm(false);
          }}
        />
      )}

      <>
        {surveyData && !showForm ? (
          <>
            <SurveyResultsList
              survey={surveyData}
              onBack={() => setSurveyData(null)}
            />
          </>
        ) : (
          <>
            <PageHeader
              title={"Survey's"}
              menuBar={true}
              rightContent={
                <>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    // size="small"
                    color="primary"
                    disableElevation
                    onClick={() => {
                      setSurveyData(null);
                      setShowForm(true);
                    }}
                  >
                    New
                  </Button>

                  {isAdmin && (
                    <TextField
                      size="small"
                      color="white"
                      select
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="primary" fontSize="small" />
                            </InputAdornment>
                          ),
                          style: { background: "white", paddingLeft: "6px" },
                        },
                      }}
                      onChange={(e) =>
                        setQuery((p) => ({
                          ...p,
                          targetRole: e.target.value || "",
                        }))
                      }
                      value={query?.targetRole}
                    >
                      <MenuItem value={"all"}>All</MenuItem>
                      <MenuItem value={2}>Manager</MenuItem>
                      <MenuItem value={3}>Employee</MenuItem>
                    </TextField>
                  )}
                </>
              }
            />
            {isLoading ? (
              <SpinnerMd />
            ) : !data?.data || !data?.data?.length ? (
              <DataInfo />
            ) : (
              <Grid2 container spacing={2}>
                {data?.data?.map((survey, idx) => (
                  <Grid2 size={{ xs: 12, sm: 4, lg: 3 }} key={idx + 1}>
                    <SurveyCard
                      key={idx + 1}
                      survey={survey}
                      onClick={() => setSurveyData(survey)}
                      handleShowForm={() => {
                        setSurveyData(survey);
                        setShowForm(true);
                      }}
                      handleDelete={() => setShowDeleteModal(survey)}
                    />
                  </Grid2>
                ))}
                <Grid2 size={{ xs: 12 }}>
                  <CustomPagination
                    hideInfo={true}
                    isLoading={isFetching}
                    handlePageChange={(page) => {
                      page !== query?.page && setQuery((p) => ({ ...p, page }));
                    }}
                    handleLimitChange={(limit) => {
                      limit !== query?.limit &&
                        setQuery((p) => ({ ...p, limit }));
                    }}
                    totalItems={data?.total}
                    itemsPerPage={data?.limit}
                    currentPage={data?.page}
                  />
                </Grid2>
              </Grid2>
            )}
          </>
        )}
      </>
    </Box>
  );
};

export default SurveysPage;
