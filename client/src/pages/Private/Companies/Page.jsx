import React, { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { useGetAllCompaniesQuery } from "../../../apis/company/company";
import PageHeader from "../../../components/UI/PrivatePageHeader";
import CompanyModal from "./FormModal";
import { SpinnerMd } from "../../../components/Spinner";
import { EditOutlined, Search } from "@mui/icons-material";
import DataTable from "../../../components/Table";
import { SearchFilter } from "../../../components/Filters";
import { generateS3FilePath } from "../../../utils/files";

const CompaniesPage = () => {
  const [query, setQuery] = useState({ page: 1, limit: 10 });
  const { data, isLoading, isFetching } = useGetAllCompaniesQuery({ ...query });
  // const [deleteCompany] = useDeleteCompanyMutation();
  const [initialData, setInitialData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // const handleDelete = async (id) => {
  //   await deleteCompany(id);
  // };
  const headCells = [
    { id: "logo", label: "Logo", is_sortable: false },
    { id: "name", label: "Name", is_sortable: false },
    { id: "action", label: "Action" },
  ];
  let rows = useMemo(() => {
    return data?.companies?.map((company) => ({
      logo: (
        <Avatar
          src={generateS3FilePath(company?.logo)}
          alt={company?.name || "Company Image"}
        />
      ),
      name: company?.name,
      action: (
        <Box
          sx={{
            display: "flex",
            justifyItems: "center",
            gap: "0px 14px",
            fontSize: "18px",
            alignItems: "center",
          }}
        >
          <IconButton
            size="small"
            onClick={() => {
              setInitialData(company);
              setShowForm(true);
            }}
            color="primary"
          >
            <EditOutlined fontSize="small" />
          </IconButton>
        </Box>
      ),
    }));
  }, [data]);

  return (
    <Box>
      <PageHeader
        title={"Companies"}
        rightContent={
          <>
            <Button
              variant="contained"
              color="white"
              onClick={() => {
                setInitialData(null);
                setShowForm(true);
              }}
            >
              Add Company
            </Button>
          </>
        }
      />
      <Stack
        gap={1}
        direction={"row"}
        alignItems={"center"}
        mb={1.5}
        // justifyContent={"space-between"}
        // flexWrap={{ xs: "wrap", sm: "nowrap" }}
      >
        <SearchFilter query={query} setQuery={setQuery} disabled={isFetching} />
      </Stack>
      <>
        {isLoading ? (
          <SpinnerMd />
        ) : (
          <>
            <DataTable
              columns={headCells}
              rows={rows}
              isPaginationLoading={isLoading || isFetching}
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
                hideInfo: true,
              }}
            />
          </>
        )}
      </>
      {showForm && (
        <CompanyModal
          initialData={initialData}
          showForm={showForm}
          onClose={() => setShowForm(false)}
        />
      )}
    </Box>
  );
};

export default CompaniesPage;
