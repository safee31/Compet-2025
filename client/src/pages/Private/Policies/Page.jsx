import React, { useMemo, useState } from "react";
import PageHeader from "../../../components/UI/PrivatePageHeader";
import {
  Box,
  Button,
  Grid2,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { SpinnerMd } from "../../../components/Spinner";
import DataInfo from "../../../components/DataInfo";
import { Add, DeleteOutline, Edit, EditOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import PolicyModal from "./FormModal";
import PolicyDetailsModal from "./DetailsModal";
import DeleteConfirmModal from "./DeleteModal";
import DataTable from "../../../components/Table";
import { CompanyFilter, SearchFilter } from "../../../components/Filters";
import { formatDateStatic } from "../../../utils/dateTime";
import { useGetAllPoliciesQuery } from "../../../apis/Policy/policy";
import { CustomPagination } from "../../../components/CustomPagination";

const AdminOrManagerPoliciesTable = () => {
  const userDetails = useSelector((s) => s?.account?.details);
  const isManager = userDetails?.role?.type === 2;
  const [query, setQuery] = useState({ page: 1, limit: 10, company: "all" });
  const { data, isLoading, isFetching } = useGetAllPoliciesQuery({ ...query });
  const [initialData, setInitialData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const policyRows = useMemo(() => {
    return data?.data?.map((policy) => ({
      title: policy?.title,
      link: policy?.link,
      company: policy?.companies?.map((c) => c.name).join(", ") || "",
      date: formatDateStatic(policy?.createdAt),
      action: (
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          {/* Edit Button */}
          <IconButton
            color="primary"
            size="small"
            onClick={() => {
              setInitialData(policy);
              setShowForm(true);
            }}
          >
            <EditOutlined fontSize="small" />
          </IconButton>

          {/* Delete Button */}
          <IconButton
            size="small"
            color="error"
            onClick={() => setShowDeleteModal(policy)}
          >
            <DeleteOutline fontSize="small" />
          </IconButton>
        </Stack>
      ),
    }));
  }, [data]);

  return (
    <>
      <PageHeader
        title="Policies"
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
              cellLines={1}
              columns={[
                { id: "title", label: "Title" },
                { id: "link", label: "Link" },
                { id: "company", label: "Companies" },
                { id: "date", label: "Date" },
                { id: "action", label: "Action" },
              ]}
              rows={policyRows}
              isPaginationLoading={isFetching}
              showPagination={true}
              paginationOptions={{
                itemsPerPage: query?.limit,
                currentPage: query.page,
                totalItems: data?.total || 0,
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
          <PolicyModal
            initialData={initialData}
            showForm={showForm}
            onClose={() => setShowForm(false)}
          />
        )}
        {showDeleteModal && (
          <DeleteConfirmModal
            open={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            policy={showDeleteModal}
          />
        )}
      </Grid2>
    </>
  );
};

const EmployeePoliciesList = () => {
  const [query, setQuery] = useState({ page: 1, limit: 10 });
  const { data, isLoading, isFetching } = useGetAllPoliciesQuery(query);
  const [initialData, setInitialData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <PageHeader title="Policies" menuBar={true} />
      <Stack mb={2} gap={2} direction={"row"} alignItems={"center"}>
        <SearchFilter query={query} setQuery={setQuery} disabled={isFetching} />
      </Stack>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12 }}>
          {isLoading ? (
            <SpinnerMd />
          ) : !data?.data?.length ? (
            <DataInfo />
          ) : (
            <Box>
              {data?.data?.map((policy, idx) => (
                <Paper
                  key={idx}
                  sx={{ p: 1, mb: 1.5, cursor: "pointer" }}
                  onClick={() => {
                    setInitialData(policy);
                    setShowForm(true);
                  }}
                >
                  <Typography variant="body1" fontWeight="bold" color="primary">
                    {formatDateStatic(policy?.createdAt)} - {policy?.title}
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
                totalItems={data?.total}
                itemsPerPage={query?.limit}
                currentPage={query?.page}
              />
            </Box>
          )}
        </Grid2>
        {showForm && (
          <PolicyDetailsModal
            policyData={initialData}
            open={showForm}
            onClose={() => setShowForm(false)}
          />
        )}
      </Grid2>
    </>
  );
};

const PoliciesPage = () => {
  const userDetails = useSelector((s) => s?.account?.details);
  const isManager = userDetails?.role?.type === 2;
  const isEmployee = userDetails?.role?.type === 3;

  return (
    <Box>
      {isManager ? (
        <AdminOrManagerPoliciesTable />
      ) : isEmployee ? (
        <EmployeePoliciesList />
      ) : (
        <AdminOrManagerPoliciesTable />
      )}
    </Box>
  );
};

export default PoliciesPage;
