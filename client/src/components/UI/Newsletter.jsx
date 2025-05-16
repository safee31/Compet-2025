import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Skeleton,
} from "@mui/material";
import { useGetLatestNewsLetterQuery } from "../../apis/Analytics/analytics";
import { generateS3FilePath } from "../../utils/files";

const Newsletter = () => {
  const { data, isLoading } = useGetLatestNewsLetterQuery();

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
      <CardContent>
        <Typography variant="h6" mb={1}>
          Newsletter
        </Typography>
        <CardMedia
          component="video"
          controls
          src={generateS3FilePath(data?.videoUrl)}
          sx={{ height: 216, width: "100%", borderRadius: 1.5 }}
        />
      </CardContent>
    </Card>
  );
};

export default Newsletter;
