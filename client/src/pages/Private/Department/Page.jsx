import React, { useMemo, useState } from "react";
import PageHeader from "../../../components/UI/PrivatePageHeader";
import { Box, Button, Grid2, IconButton, Stack } from "@mui/material";

import { SpinnerMd } from "../../../components/Spinner";
import { Add, Edit } from "@mui/icons-material";
import { useSelector } from "react-redux";
import DepartmentModal from "./FormModal";
import DataTable from "../../../components/Table";
import { CompanyFilter, SearchFilter } from "../../../components/Filters";
import { useGetAllDepartmentsQuery } from "../../../apis/Department/department";
import { getMin0Number } from "../../../utils/toTitleCase";

const AdminDepartmentsTable = () => {
  const userDetails = useSelector((s) => s?.account?.details);
  const isManager = userDetails?.role?.type === 1;
  const [query, setQuery] = useState({ page: 1, limit: 10, company: "all" });
  const { data, isLoading, isFetching } = useGetAllDepartmentsQuery({
    ...query,
  });
  const [initialData, setInitialData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const departmentRows = useMemo(() => {
    return data?.departments?.map((department) => ({
      name: department?.name,
      company: department?.company?.name,
      manager: `${department?.manager?.personalInfo?.firstName || ""} ${
        department?.manager?.personalInfo?.lastName || ""
      }`,
      employees: getMin0Number(department?.employees?.length),
      action: (
        <Stack direction={"row"} alignItems={"center"}>
          <IconButton
            color="primary"
            size="small"
            onClick={() => {
              setInitialData(department);
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
        title="Departments"
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
                { id: "name", label: "Name" },
                { id: "company", label: "Company" },
                { id: "manager", label: "Manager" },
                { id: "employees", label: "Employees" },
                { id: "action", label: "Action" },
              ]}
              rows={departmentRows}
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
          <DepartmentModal
            initialData={initialData}
            showForm={showForm}
            onClose={() => setShowForm(false)}
          />
        )}
      </Grid2>
    </>
  );
};

const DepartmentsPage = () => {
  return (
    <Box>
      <AdminDepartmentsTable />
    </Box>
  );
};

export default DepartmentsPage;
