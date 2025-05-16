import React, { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import PageHeader from "../../../components/UI/PrivatePageHeader";
import ManagerModal from "./FormModal";
import { SpinnerMd } from "../../../components/Spinner";
import DataTable from "../../../components/Table";
import {
  useGetAllManagersQuery,
  useToggleManagerActivationMutation,
} from "../../../apis/Manager/manager";
import {
  ArrowBack,
  Delete,
  EditOutlined,
  MeetingRoom,
} from "@mui/icons-material";
import { getDocumentId } from "../../../utils/toTitleCase";
import { errorMessages } from "../../../apis/messageHandler";
import { CompanyFilter, SearchFilter } from "../../../components/Filters";
import toast from "react-hot-toast";
import { generateS3FilePath } from "../../../utils/files";
import AccountDetails from "../Employees/AccountDetails";
import { createDynamicChip } from "../../../utils/chip";
import DeleteAccountModal from "../../../components/DeleteAccountModal";
import AssignDepartmentManagerModal from "./AssingDptToManager";

const ManagersPage = () => {
  const [query, setQuery] = useState({ page: 1, limit: 10 });
  const { data, isLoading, isFetching } = useGetAllManagersQuery({ ...query });
  // const [deleteManager] = useDeleteManagerMutation();
  const [initialData, setInitialData] = useState(null);
  const [showAssignDpt, setShowAssignDpt] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState("");

  const [toggleManagerActivation, { isLoading: isToggling }] =
    useToggleManagerActivationMutation();

  const handleToggleActivation = async (id) => {
    try {
      const response = await toggleManagerActivation(id).unwrap();
      toast.success(response.message || "Employee status updated successfully");
    } catch (error) {
      errorMessages(error);
    }
  };

  const handleShowFormOrDetails = (manager) => {
    setInitialData(manager);

    if (manager?.isOnboarded) {
      setShowForm(false);
      setShowDetails(true);
    } else {
      setShowForm(true);
      setShowDetails(false);
    }
  };
  const handleDepartmenAssign = (manager) => {
    setShowDetails(false);
    if (manager?.isOnboarded) {
      setInitialData(manager);
      setShowAssignDpt(true);
    } else {
      toast.error("Manager onboarding is incomplete.");
      setShowAssignDpt(false);
    }
  };

  const headCells = [
    { id: "avatar", label: "Profile", is_sortable: false },
    { id: "name", label: "Name", is_sortable: false },
    { id: "department", label: "Department", is_sortable: false },
    { id: "company", label: "Company", is_sortable: false },
    { id: "onboarding", label: "Onboarding", is_sortable: false },
    { id: "action", label: "Action" },
  ];

  const handleDeleteAccount = async (userId) => {
    setDeletingUserId(userId);
  };

  let rows = useMemo(() => {
    return data?.managers?.map((manager) => ({
      avatar: (
        <Avatar
          src={generateS3FilePath(manager?.user?.profileImage) || ""}
          alt={manager?.personalInfo?.firstName || "Manager Image"}
        />
      ),
      name: `${manager?.personalInfo?.firstName || "N/A"} ${
        manager?.personalInfo?.lastName || "N/A"
      }`,
      department: manager?.department?.name,
      company: manager?.company?.name,
      onboarding: createDynamicChip({
        label: manager?.isOnboarded ? "Completed" : "Incomplete",
        color: manager?.isOnboarded ? "primary" : "warning",
      }),
      action: (
        <Stack direction={"row"} alignItems={"center"}>
          <IconButton
            size="small"
            onClick={() => handleShowFormOrDetails(manager)}
            color="primary"
          >
            <EditOutlined fontSize="small" />
          </IconButton>
          <Tooltip
            arrow
            placement="top"
            title={`${manager?.isActive ? "Activate" : "Deactivate"}`}
          >
            <span>
              <Switch
                size="small"
                onChange={() => handleToggleActivation(getDocumentId(manager))}
                checked={manager?.isActive}
                disabled={isToggling}
              />
            </span>
          </Tooltip>
          {/* {isAdmin && ( */}
          <IconButton
            size="small"
            onClick={() => handleDeleteAccount(getDocumentId(manager?.user))}
            color="error"
          >
            <Delete fontSize="small" />
          </IconButton>
          {/* )} */}
          <IconButton
            size="small"
            onClick={() => handleDepartmenAssign(manager)}
            color="primary"
          >
            <MeetingRoom fontSize="small" />
          </IconButton>
        </Stack>
      ),
    }));
  }, [data]);

  return showDetails && initialData ? (
    <>
      <Box display="flex" alignItems="center" mb={1}>
        <IconButton
          onClick={() => {
            setInitialData(null);
            setShowForm(false);
            setShowDetails(false);
          }}
          color="disabled"
        >
          <ArrowBack />
        </IconButton>
        <Typography fontWeight="bold" color="textPrimary">
          Back to Managers
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
      {showAssignDpt && initialData && (
        <AssignDepartmentManagerModal
          showForm={showAssignDpt}
          onClose={() => {
            setInitialData(null);
            setShowAssignDpt(false);
          }}
          initialData={initialData}
        />
      )}
      <PageHeader
        title={"Managers"}
        rightContent={
          <Button
            variant="contained"
            color="white"
            onClick={() => {
              setInitialData(null);
              setShowForm(true);
            }}
          >
            Add Manager
          </Button>
        }
      />
      <Stack
        mb={1.5}
        gap={2}
        direction={"row"}
        alignItems={"center"}
        // justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
        <SearchFilter query={query} setQuery={setQuery} disabled={isFetching} />

        <CompanyFilter
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
          isPaginationLoading={isToggling || isFetching}
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

      {showForm && (
        <ManagerModal
          initialData={initialData}
          showForm={showForm}
          onClose={() => setShowForm(false)}
        />
      )}
    </Box>
  );
};

export default ManagersPage;
