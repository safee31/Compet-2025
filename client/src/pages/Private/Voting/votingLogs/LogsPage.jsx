import { useSelector } from "react-redux";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

import { Stack, IconButton, Box } from "@mui/material";
import { Block } from "@mui/icons-material";
import { useGetVotesQuery } from "../../../../apis/Voting/voting";
import { UTCDatePicker } from "../../../../components/UTCdatePicker";
import { SpinnerMd } from "../../../../components/Spinner";
import DataTable from "../../../../components/Table";
import { formatDateStatic } from "../../../../utils/dateTime";
import ConfirmIgnoreDialog from "./IgnoreVoteModal";
import { getDocumentId } from "../../../../utils/toTitleCase";
import { CompanyFilter } from "../../../../components/Filters";

const VotingLogs = () => {
  const userDetails = useSelector((s) => s?.account?.details);
  const isManager = userDetails?.role?.type === 2;
  const isAdmin = userDetails?.role?.type === 1;
  const [selectedVoteId, setSelectedVoteId] = useState(null);

  const handleOpenDialog = (voteId) => {
    setSelectedVoteId(voteId);
  };

  const handleCloseDialog = () => {
    setSelectedVoteId(null);
  };

  // ✅ Default: first and last day of current month
  const defaultStartDate = dayjs()
    .utc()
    // .subtract(1, "month")
    .startOf("month")
    .format("YYYY-MM-DD");
  const defaultEndDate = dayjs()
    .utc()
    .add(1, "month")
    .startOf("month")
    .format("YYYY-MM-DD");

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  });

  const { data, isLoading, isFetching } = useGetVotesQuery({ ...query });

  const votingRows = useMemo(() => {
    return data?.votes?.map((v) => ({
      voter:
        v?.voter?.role?.type === 1
          ? "Super Admin"
          : `${v?.voter?.firstName || "N/A"} ${v?.voter?.lastName || ""} (${
              v?.voter?.company || "N/A"
            }) `,
      nominee: `${v?.nominee?.firstName} ${v?.nominee?.lastName} (${v?.nominee?.company})`,
      votedAt: formatDateStatic(v?.createdAt),
      company: v?.company?.name,
      reason: v?.reason,
      disabled: v?.isIgnored,
      action: v?.isIgnored ? (
        <IconButton size="small" color="disabled">
          <Block fontSize="small" />
        </IconButton>
      ) : isAdmin ? (
        <IconButton
          size="small"
          color="error"
          onClick={() => handleOpenDialog(getDocumentId(v))}
        >
          <Block fontSize="small" />
        </IconButton>
      ) : (
        ""
      ),
    }));
  }, [data]);

  const handleMonthChange = (monthDate) => {
    if (!monthDate) return;

    const selected = dayjs(monthDate);
    const now = dayjs().utc();

    if (selected.endOf("month").isAfter(now)) return;

    const updatedStart = selected.startOf("month").format("YYYY-MM-DD");
    const updatedEnd = defaultEndDate;

    setQuery((q) => ({
      ...q,
      startDate: updatedStart,
      endDate: updatedEnd,
      page: 1,
    }));
  };

  return (
    <Box>
      {selectedVoteId && (
        <ConfirmIgnoreDialog
          open={Boolean(selectedVoteId)}
          onClose={handleCloseDialog}
          voteId={selectedVoteId}
        />
      )}
      <Stack
        my={1.5}
        gap={2}
        direction={"row"}
        flexWrap={"wrap"}
        alignItems={"center"}
      >
        <UTCDatePicker
          views={["month", "year"]}
          maxDate={dayjs().utc()}
          value={query.startDate}
          onChange={handleMonthChange}
          openTo="month"
          yearsOrder="desc"
          format="MMMM YYYY"
          name="Monthly votes"
          // textFieldProps={{
          //   helperText: `To ${formatDateStatic(dayjs().utc(), "MMMM YYYY")}`,
          // }}
          sx={{ background: "white", borderRadius: "5px", maxWidth: 220 }}
        />
        {!isManager && (
          <CompanyFilter
            minWidth={120}
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
            { id: "voter", label: "Voter" },
            { id: "nominee", label: "Nominee" },
            { id: "votedAt", label: "Voted At" },
            { id: "company", label: "Company" },
            { id: "reason", label: "Reason" },
            { id: "action", label: "Action" },
          ]}
          rows={votingRows}
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
    </Box>
  );
};

export default VotingLogs;
