import React, { useMemo, useState } from "react";
import { Box, Button, Paper, Switch, Tooltip, Typography } from "@mui/material";
import PageHeader from "../../../components/UI/PrivatePageHeader";
import CompanyModal from "./FormModal";
import { SpinnerMd } from "../../../components/Spinner";
import DataInfo from "../../../components/DataInfo";
import {
  useGetAllNewslettersQuery,
  useToggleNewsletterArchiveStatusMutation,
} from "../../../apis/NewsLetter/newsLetter";
import { Add } from "@mui/icons-material";
import { useSelector } from "react-redux";
import NewsletterDetailsModal from "./DetailsModal";
import { SearchFilter } from "../../../components/Filters";
import DataTable from "../../../components/Table";
import { getDocumentId } from "../../../utils/toTitleCase";
import toast from "react-hot-toast";
import { errorMessages } from "../../../apis/messageHandler";
import { CustomPagination } from "../../../components/CustomPagination";

const NewsLettersPage = () => {
  const userDetails = useSelector((s) => s?.account?.details);
  const isAdmin = userDetails?.role?.type === 1;
  const isManagerOrEmployee =
    userDetails?.role?.type === 2 || userDetails?.role?.type === 3;

  const [query, setQuery] = useState({ page: 1, limit: 10 });
  const { data, isLoading, isFetching } = useGetAllNewslettersQuery({
    ...query,
  });

  const [initialData, setInitialData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [updateArchivedStatus, { isLoading: isToggling }] =
    useToggleNewsletterArchiveStatusMutation();

  const handleToggleArchive = async (id) => {
    try {
      const response = await updateArchivedStatus(id).unwrap();
      toast.success(
        response.message || "Newsletter archived status updated successfully"
      );
    } catch (error) {
      errorMessages(error);
    }
  };

  const headCells = [
    { id: "title", label: "Title", is_sortable: false },
    { id: "createdAt", label: "Published Date", is_sortable: false },
    { id: "archived", label: "Archived", is_sortable: false },
  ];

  const rows = useMemo(() => {
    return data?.newsletters?.map((newsLetter) => ({
      title: (
        <Typography
          variant="body1"
          fontWeight="bold"
          color="primary"
          sx={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={() => {
            setInitialData(newsLetter);
            setShowForm(true);
          }}
        >
          {newsLetter?.title}
        </Typography>
      ),
      createdAt: new Date(newsLetter?.createdAt).toLocaleDateString(),
      archived: (
        <Tooltip arrow title="Toggle Archive Status">
          <Switch
            size="small"
            checked={newsLetter?.isArchived || false} // Use isArchived from API
            onChange={() => handleToggleArchive(getDocumentId(newsLetter))}
            disabled={isToggling}
          />
        </Tooltip>
      ),
    }));
  }, [data]);

  return (
    <Box>
      {isManagerOrEmployee && showForm && (
        <NewsletterDetailsModal
          initialData={initialData}
          open={showForm}
          onClose={() => setShowForm(false)}
        />
      )}

      <PageHeader
        title="Newsletters"
        menuBar={true}
        rightContent={
          isAdmin && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setInitialData(null);
                setShowForm(true);
              }}
              startIcon={<Add />}
            >
              New
            </Button>
          )
        }
      />

      <SearchFilter query={query} setQuery={setQuery} disabled={isFetching} />

      <Box mt={2}>
        {isLoading ? (
          <SpinnerMd />
        ) : isAdmin ? (
          // ✅ Table View for Admin
          <DataTable
            columns={headCells}
            rows={rows}
            isPaginationLoading={isFetching || isToggling}
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
        ) : (
          // ✅ List View for Managers & Employees
          <>
            {data?.newsletters?.length > 0 ? (
              data?.newsletters?.map((newsLetter, idx) => (
                <Paper
                  sx={{ p: 1, mb: 1.5, cursor: "pointer" }}
                  key={idx + 1}
                  onClick={() => {
                    setInitialData(newsLetter);
                    setShowForm(true);
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    color="primary"
                    sx={{ textDecoration: "underline" }}
                  >
                    {newsLetter?.title}
                  </Typography>
                </Paper>
              ))
            ) : (
              <DataInfo />
            )}
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
          </>
        )}
      </Box>

      {showForm && !isManagerOrEmployee && (
        <CompanyModal
          initialData={initialData}
          showForm={showForm}
          onClose={() => setShowForm(false)}
        />
      )}
    </Box>
  );
};

export default NewsLettersPage;
