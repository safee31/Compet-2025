import React, { useMemo, useState } from "react";
import PageHeader from "../../../components/UI/PrivatePageHeader";
import { Button, Grid2, IconButton, Stack } from "@mui/material";
import { SpinnerMd } from "../../../components/Spinner";
import { Add, Edit, Lock } from "@mui/icons-material";
import ViolationCodeFormModal from "./FormModal";
import DataTable from "../../../components/Table";
import { SearchFilter } from "../../../components/Filters";
import { useGetAllViolationCodesQuery } from "../../../apis/violationCode/violationCode";
import { getMin0Number, toTitleCase } from "../../../utils/toTitleCase";
import { useSelector } from "react-redux";
import AccessToUsersModal from "./AccessToUsersModal";

const ViolationCodeTable = () => {
  const userDetails = useSelector((s) => s?.account?.details);
  const isAdmin = userDetails?.role?.type === 1;
  const [query, setQuery] = useState({ page: 1, limit: 10 });
  const { data, isLoading, isFetching } = useGetAllViolationCodesQuery({
    ...query,
  });
  const [initialData, setInitialData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showUserAccessModal, setShowUserAccessModal] = useState(false);

  const violationRows = useMemo(() => {
    return data?.violations?.map((violation) => ({
      section: violation?.section,
      code: violation?.code,
      severity: toTitleCase(violation?.severity),
      source_type: toTitleCase(violation?.source_type),
      description: violation?.description,
      solutions: getMin0Number(violation?.solutions?.length),
      questions: getMin0Number(violation?.questions?.length),
      action: (
        <Stack direction={"row"} alignItems={"center"}>
          <IconButton
            color="primary"
            size="small"
            onClick={() => {
              setInitialData(violation);
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
      {showUserAccessModal && (
        <AccessToUsersModal
          showForm={showUserAccessModal}
          onClose={() => {
            setShowUserAccessModal(false);
          }}
        />
      )}
      <PageHeader
        title="Violation Codes"
        menuBar={true}
        rightContent={
          <>
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
            {isAdmin && (
              <Button
                onClick={() => {
                  setShowUserAccessModal(true);
                }}
                variant="contained"
                startIcon={<Lock fontSize="small" />}
              >
                User Access
              </Button>
            )}
          </>
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
                { id: "section", label: "Section" },
                { id: "code", label: "Code" },
                { id: "severity", label: "Severity" },
                { id: "source_type", label: "Source" },
                { id: "description", label: "Description" },
                { id: "solutions", label: "Solutions" },
                { id: "questions", label: "Questions" },
                { id: "action", label: "Actions" },
              ]}
              rows={violationRows}
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
                  limit !== query?.limit && setQumery((p) => ({ ...p, limit }));
                },
                isLoading: isFetching,
                hideInfo: true,
              }}
            />
          )}
        </Grid2>
        {showForm && (
          <ViolationCodeFormModal
            initialData={initialData}
            showForm={showForm}
            onClose={() => setShowForm(false)}
          />
        )}
      </Grid2>
    </>
  );
};

export default ViolationCodeTable;
