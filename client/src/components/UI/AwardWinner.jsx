import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Avatar,
} from "@mui/material";
import { useGetPreviousMonthWinnerQuery } from "../../apis/Analytics/analytics";
import { generateS3FilePath } from "../../utils/files";
import { formatDateStatic } from "../../utils/dateTime";

const AwardWinner = () => {
  const { data, isLoading } = useGetPreviousMonthWinnerQuery();

  if (isLoading)
    return (
      <Skeleton
        variant="rounded"
        width={"100%"}
        height={"100%"}
        animation="wave"
      />
    );
  return (
    <Card>
      <CardContent sx={{ p: 1.5 }}>
        <Typography variant="h6">H-E-R-B-I-E-S Award</Typography>
        {data?.month && (
          <Typography fontSize={13} color={"#0A0A0AB2"}>
            {formatDateStatic(data?.month, "MMMM, YYYY")}
          </Typography>
        )}
        <Avatar
          src={generateS3FilePath(data?.profileImage)}
          alt={data?.firstName + " " + data?.lastName}
          sx={{ width: 50, height: 50, marginBlock: 2 }}
        />
        <Typography variant="body2">Overall Winner</Typography>
        {data ? (
          <>
            <Typography fontSize={13} color={"#0A0A0AB2"}>
              {data?.firstName + " " + data?.lastName}
            </Typography>
          </>
        ) : (
          "Winner not available"
        )}
      </CardContent>
    </Card>
  );
};

export default AwardWinner;
