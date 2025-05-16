import React, { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import PageHeader from "../../../components/UI/PrivatePageHeader";
import { SpinnerMd } from "../../../components/Spinner";
import DataTable from "../../../components/Table";
import {
  ArrowBack,
  Delete,
  EditOutlined,
  NewReleases,
  TaskAlt,
  Verified,
} from "@mui/icons-material";
import {
  useApproveEmployeeAccountMutation,
  useGetAllEmployeesQuery,
  useToggleEmployeeStatusMutation,
} from "../../../apis/Employee/employee";
import AccountDetails from "./AccountDetails";
import { createDynamicChip } from "../../../utils/chip";
import { errorMessages } from "../../../apis/messageHandler";
import toast from "react-hot-toast";
import { getDocumentId } from "../../../utils/toTitleCase";
import { useSelector } from "react-redux";
import {
  ApprovalFilter,
  CompanyFilter,
  SearchFilter,
} from "../../../components/Filters";
import { generateS3FilePath } from "../../../utils/files";
import DeleteAccountModal from "../../../components/DeleteAccountModal";

const EmployeesPage = () => {
  const userDetails = useSelector((s) => s?.account?.details);
  const isManager = userDetails?.role?.type === 2;
  const isAdmin = userDetails?.role?.type === 1;
  const [query, setQuery] = useState({ page: 1, limit: 10 });
  const { data, isLoading, isFetching } = useGetAllEmployeesQuery({ ...query });
  const [initialData, setInitialData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState("");

  const [toggleEmployeeStatus, { isLoading: isToggling }] =
    useToggleEmployeeStatusMutation();

  const handleToggleActivation = async (id) => {
    try {
      const response = await toggleEmployeeStatus(id).unwrap();
      toast.success(response.message || "Employee status updated successfully");
    } catch (error) {
      errorMessages(error);
    }
  };
  const [approveEmployeeAccount, { isLoading: isApproving }] =
    useApproveEmployeeAccountMutation();

  const handleApprove = async (accountId) => {
    try {
      await approveEmployeeAccount(accountId).unwrap();
      toast.success("Employee approved successfully!");
    } catch (error) {
      errorMessages(error);
    }
  };
  const headCells = [
    { id: "avatar", label: "", is_sortable: false },
    { id: "name", label: "Name", is_sortable: false },
    // { id: "email", label: "Email", is_sortable: false },
    { id: "company", label: "Company", is_sortable: false },
    { id: "isApproved", label: "Approval", is_sortable: false },
    { id: "isVerified", label: "Verification", is_sortable: false },
    { id: "onboarding", label: "Onboarding", is_sortable: false },
    { id: "action", label: "Action" },
  ];

  const handleDeleteAccount = async (userId) => {
    setDeletingUserId(userId);
  };

  let rows = useMemo(() => {
    return data?.employees?.map((employee) => ({
      avatar: (
        <Avatar
          src={generateS3FilePath(employee?.user?.profileImage) || ""}
          alt={employee?.personalInfo?.firstName || "Employee Image"}
        />
      ),
      name: `${employee?.personalInfo?.firstName || "N/A"} ${
        employee?.personalInfo?.lastName || "N/A"
      }`,
      // email: employee?.user?.email,
      company: employee?.company?.name,
      isApproved: employee?.isApproved ? (
        <Verified color="success" />
      ) : (
        <NewReleases color="error" />
      ),
      isVerified: createDynamicChip({
        label: employee?.user?.isVerified ? "Verified" : "Unverified",
        color: employee?.user?.isVerified ? "success" : "error",
      }),
      onboarding: createDynamicChip({
        label: employee?.isOnboarded ? "Completed" : "Incomplete",
        color: employee?.isOnboarded ? "primary" : "warning",
      }),
      action: (
        <Stack direction={"row"} alignItems={"center"}>
          <IconButton
            size="small"
            onClick={() => {
              setInitialData(employee);
              setShowForm(true);
            }}
            color="primary"
          >
            <EditOutlined fontSize="small" />
          </IconButton>
          <Tooltip
            arrow
            placement="top"
            title={`${employee?.isActive ? "Activate" : "Deactivate"}`}
          >
            <span>
              <Switch
                size="small"
                onChange={() => handleToggleActivation(getDocumentId(employee))}
                checked={employee?.isActive}
                disabled={isToggling}
              />
            </span>
          </Tooltip>
          {!employee?.isApproved && !isManager && (
            <Tooltip arrow placement="top" title="Approve Account">
              <span>
                <IconButton
                  size="small"
                  onClick={() => handleApprove(getDocumentId(employee))}
                  color="primary"
                  disabled={isApproving}
                >
                  <TaskAlt fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          )}
          {isAdmin && (
            <IconButton
              size="small"
              onClick={() => handleDeleteAccount(getDocumentId(employee?.user))}
              color="error"
            >
              <Delete fontSize="small" />
            </IconButton>
          )}
        </Stack>
      ),
    }));
  }, [data]);

  return showForm && initialData ? (
    <>
      <Box display="flex" alignItems="center" mb={1}>
        <IconButton
          onClick={() => {
            setInitialData(null);
            setShowForm(false);
          }}
          color="disabled"
        >
          <ArrowBack />
        </IconButton>
        <Typography fontWeight="bold" color="textPrimary">
          Back to Employees
        </Typography>
      </Box>
      <AccountDetails
        accountData={initialData}
        setAccountData={setInitialData}
      />
    </>
  ) : (
    <Box>
      {deletingUserId && (
        <DeleteAccountModal
          onClose={() => setDeletingUserId("")}
          userId={deletingUserId}
          open={deletingUserId ? true : false}
        />
      )}
      <PageHeader title={"Employees"} menuBar={true} />
      <Stack
        mb={1.5}
        gap={2}
        direction={"row"}
        alignItems={"center"}
        // justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
        <SearchFilter query={query} setQuery={setQuery} disabled={isFetching} />
        {!isManager && (
          <CompanyFilter
            query={query}
            setQuery={setQuery}
            disabled={isFetching}
          />
        )}
        <ApprovalFilter
          query={query}
          setQuery={setQuery}
          disabled={isFetching}
        />
      </Stack>
      {isLoading ? (
        <SpinnerMd />
      ) : (
        <DataTable
          columns={headCells}
          rows={rows}
          isPaginationLoading={isFetching || isToggling || isApproving}
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
      )}
    </Box>
  );
};

export default EmployeesPage;
