import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "../../../components/UI/PrivatePageHeader";
import {
  Box,
  Button,
  Grid2,
  IconButton,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  Add,
  //   DeleteOutline,
  EditOutlined,
  Task,
  //   PlayCircleOutline,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { SpinnerMd } from "../../../components/Spinner";
import DataTable from "../../../components/Table";
import { SearchFilter } from "../../../components/Filters";
import { formatDateStatic } from "../../../utils/dateTime";
import TaskModal from "./FormModal";
import { useGetAllTasksQuery } from "../../../apis/SMPTask/smp-task";
import { createDynamicChip } from "../../../utils/chip";
import {
  getDocumentId,
  getMin0Number,
  toTitleCase,
} from "../../../utils/toTitleCase";
import { useTaskProgressSocket } from "./socket-tasks-progress";
import { generateS3FilePath } from "../../../utils/files";
import { DocumentDialog } from "./documentViewer";
import toast from "react-hot-toast";

const TaskStatusChip = ({ status }) => {
  const colorMap = {
    pending: "warning",
    "qa-session": "primary",
    processing: "info",
    completed: "success",
  };

  return createDynamicChip({
    label: status === "qa-session" ? "QA Session" : toTitleCase(status),
    color: colorMap[status],
  });
};

const AdminOrManagerTasksTable = () => {
  const user = useSelector((s) => s?.account?.details?.user);
  const userId = getDocumentId(user) || "";
  const [query, setQuery] = useState({ page: 1, limit: 10 });
  const [selectedTask, setSelectedTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDocument, setShowDocument] = useState(false);
  const [tasks, setTasks] = useState([]);

  const { data, isLoading, isFetching, refetch } = useGetAllTasksQuery({
    ...query,
  });
  useEffect(() => {
    if (data?.smpTasks) {
      setTasks(data.smpTasks);
    }
  }, [data]);
  //   const [showDeleteModal, setShowDeleteModal] = useState(false);
  //   const [showQAModal, setShowQAModal] = useState(false);

  useTaskProgressSocket({ tasks, userId }, (taskId, updatedFields) => {
    if (selectedTask) {
      taskId === getDocumentId(selectedTask);
      setSelectedTask((p) => ({ ...p, ...updatedFields }));
    }
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        getDocumentId(task) === taskId ? { ...task, ...updatedFields } : task
      )
    );
  });

  const taskRows = useMemo(() => {
    return tasks?.map((task) => ({
      title: task?.title,
      company: task?.companyDetails,
      status: <TaskStatusChip status={task?.status} />,
      progress: (
        <Stack direction="row" alignItems="center" gap={1}>
          <>
            <CircularProgress
              thickness={8}
              variant="determinate"
              value={getMin0Number(task?.progress)}
              size={"1rem"}
            />
          </>
          <Typography variant="body2">
            {getMin0Number(task?.progress)}%
          </Typography>
        </Stack>
      ),
      date: formatDateStatic(task?.createdAt),

      action: (
        <Stack direction="row" alignItems="center" spacing={1}>
          {/* Start QA Button (Admin/Manager only) */}
          {/* {task.status === "qa-session" && (
            <IconButton
              color="primary"
              size="small"
              onClick={() => {
                setSelectedTask(task);
                setShowQAModal(true);
              }}
            >
              <PlayCircleOutline fontSize="small" />
            </IconButton>
          )} */}

          {/* Edit Button */}
          <IconButton
            color="primary"
            size="small"
            onClick={() => {
              setSelectedTask(task);
              setShowForm(true);
            }}
          >
            <EditOutlined fontSize="small" />
          </IconButton>
          {task?.status === "completed" && task?.progress === 100 && (
            <IconButton
              color="primary"
              size="small"
              onClick={() => {
                if (
                  task?.smpDocument?.endsWith(".pdf") ||
                  task?.smpDocument?.endsWith(".docx")
                ) {
                  setShowDocument(task);
                } else {
                  toast.error("Only PDF and DOCX documents are allowed.");
                }
              }}
            >
              <Task fontSize="small" />
            </IconButton>
          )}

          {/* Delete Button */}
          {/* <IconButton
            size="small"
            color="error"
            onClick={() => setShowDeleteModal(task)}
          >
            <DeleteOutline fontSize="small" />
          </IconButton> */}
        </Stack>
      ),
    }));
  }, [tasks]);

  return (
    <>
      {showDocument?.smpDocument && (
        <DocumentDialog
          open={Boolean(showDocument)}
          onClose={() => setShowDocument(null)}
          fileUrl={showDocument.smpDocument}
          taskId={getDocumentId(showDocument)}
        />
      )}

      <PageHeader
        title="SMP Tasks"
        menuBar={true}
        rightContent={
          <Button
            onClick={() => {
              setSelectedTask(null);
              setShowForm(true);
            }}
            variant="contained"
            startIcon={<Add />}
          >
            New Task
          </Button>
        }
      />
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12 }}>
          <Stack mb={1.5} gap={2} direction="row" alignItems="center">
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
              cellLines={1}
              columns={[
                { id: "title", label: "Title" },
                { id: "company", label: "Company Details" },
                { id: "status", label: "Status" },
                { id: "progress", label: "Progress" },
                { id: "date", label: "Date" },
                { id: "action", label: "Actions" },
              ]}
              rows={taskRows}
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
          <TaskModal
            initialData={selectedTask}
            showForm={showForm}
            onClose={() => setShowForm(false)}
            refetch={refetch}
          />
        )}
        {/* {showQAModal && (
          <QAModal
            task={selectedTask}
            open={showQAModal}
            onClose={() => setShowQAModal(false)}
          />
        )}
        {showDeleteModal && (
          <DeleteConfirmModal
            open={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            task={showDeleteModal}
          />
        )} */}
      </Grid2>
    </>
  );
};

const TasksPage = () => {
  //   const userDetails = useSelector((s) => s?.account?.details);
  //   const isEmployee = userDetails?.role?.type === 3;

  return <Box>{<AdminOrManagerTasksTable />}</Box>;
};

export default TasksPage;
