import React, { useMemo, useState } from "react";
import PageHeader from "../../../components/UI/PrivatePageHeader";
import {
  Box,
  Button,
  Card,
  Grid2,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { SpinnerMd } from "../../../components/Spinner";
import DataInfo from "../../../components/DataInfo";
import { Add, Edit } from "@mui/icons-material";
import { useSelector } from "react-redux";
import MeetingModal from "./FormModal";
import MeetingDetailsModal from "./DetailsModal";
import DataTable from "../../../components/Table";
import { CompanyFilter, SearchFilter } from "../../../components/Filters";
import { formatDateStatic } from "../../../utils/dateTime";
import {
  useGetAllMeetingsForMeQuery,
  useGetAllMeetingsQuery,
} from "../../../apis/Meeting/meeting";
import { CustomPagination } from "../../../components/CustomPagination";

const AdminMeetingsTable = () => {
  const userDetails = useSelector((s) => s?.account?.details);
  const isManager = userDetails?.role?.type === 2;
  const [query, setQuery] = useState({ page: 1, limit: 10, company: "all" });
  const { data, isLoading, isFetching } = useGetAllMeetingsQuery({ ...query });
  const [initialData, setInitialData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const meetingRows = useMemo(() => {
    return data?.meetings?.map((meeting) => ({
      title: meeting?.title,
      attendees: meeting?.attendees?.length || 0,
      company: meeting?.company?.name,
      date: formatDateStatic(meeting?.date, "MM/DD/YYYY"),
      action: (
        <Stack direction={"row"} alignItems={"center"}>
          <IconButton
            color="primary"
            size="small"
            onClick={() => {
              setInitialData(meeting);
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
        title="BP Meetings"
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
            {!isManager && (
              <CompanyFilter
                query={query}
                setQuery={setQuery}
                disabled={isFetching}
              />
            )}
          </Stack>
          {isLoading ? (
            <SpinnerMd />
          ) : (
            <DataTable
              columns={[
                { id: "title", label: "Title" },
                { id: "attendees", label: "Attendees" },
                { id: "company", label: "Company" },
                { id: "date", label: "Date" },
                { id: "action", label: "Action" },
              ]}
              rows={meetingRows}
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
          <MeetingModal
            initialData={initialData}
            showForm={showForm}
            onClose={() => setShowForm(false)}
          />
        )}
      </Grid2>
    </>
  );
};

const ManagerOrEmployeeMeetingsList = () => {
  const [query, setQuery] = useState({ page: 1, limit: 10, company: "all" });
  const { data, isLoading, isFetching } = useGetAllMeetingsForMeQuery(query);
  const [initialData, setInitialData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <PageHeader title="BP Meetings" menuBar={true} />
      <Stack mb={2} gap={2} direction={"row"} alignItems={"center"}>
        <SearchFilter query={query} setQuery={setQuery} disabled={isFetching} />
      </Stack>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 7, md: 8 }}>
          {isLoading ? (
            <SpinnerMd />
          ) : !data?.meetings?.length ? (
            <DataInfo />
          ) : (
            <Box>
              {data?.meetings?.map((meeting, idx) => (
                <Paper
                  key={idx}
                  sx={{ p: 1, mb: 1.5, cursor: "pointer" }}
                  onClick={() => {
                    setInitialData(meeting);
                    setShowForm(true);
                  }}
                >
                  <Typography variant="body1" fontWeight="bold" color="primary">
                    {formatDateStatic(meeting?.date, "MM/DD/YYYY")}-
                    {meeting?.title}
                  </Typography>
                </Paper>
              ))}
              <CustomPagination
                hideInfo={true}
                isLoading={isFetching}
                handlePageChange={(page) => {
                  page !== query?.page && setQuery((p) => ({ ...p, page }));
                }}
                handleLimitChange={(limit) => {
                  limit !== query?.limit && setQuery((p) => ({ ...p, limit }));
                }}
                totalItems={data?.totalDocs}
                itemsPerPage={query?.limit}
                currentPage={query?.page}
              />
            </Box>
          )}
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 5, md: 4 }}>
          <Card sx={{ mb: 2, p: 1.5 }}>
            <Typography variant="body1">This Month</Typography>
            <Typography variant="body2" color="textSecondary">
              You need to have at least one meeting per month.
            </Typography>
            <Button
              variant="contained"
              color="primaryLight"
              fullWidth
              sx={{ mt: 2 }}
            >
              Document Meeting
            </Button>
          </Card>
        </Grid2>
        {showForm && (
          <MeetingDetailsModal
            meetingData={initialData}
            open={showForm}
            onClose={() => setShowForm(false)}
          />
        )}
      </Grid2>
    </>
  );
};

const MeetingsPage = () => {
  const userDetails = useSelector((s) => s?.account?.details);
  const isManager = userDetails?.role?.type === 2;
  const isEmployee = userDetails?.role?.type === 3;
  const [tabIndex, setTabIndex] = useState(1);

  return (
    <Box>
      {isManager ? (
        <>
          <Stack gap={2} direction={"row"} flexWrap={"wrap"} mb={2}>
            <Button
              color={tabIndex === 1 ? "primaryLight" : "white"}
              variant="contained"
              onClick={() => setTabIndex(1)}
            >
              Meetings for me
            </Button>
            <Button
              color={tabIndex === 2 ? "primaryLight" : "white"}
              variant="contained"
              onClick={() => setTabIndex(2)}
            >
              Meetings
            </Button>
          </Stack>
          {tabIndex === 1 && <ManagerOrEmployeeMeetingsList />}
          {tabIndex === 2 && <AdminMeetingsTable />}
        </>
      ) : isEmployee ? (
        <ManagerOrEmployeeMeetingsList />
      ) : (
        <AdminMeetingsTable />
      )}
    </Box>
  );
};

export default MeetingsPage;
