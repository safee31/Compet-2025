import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Stack,
} from "@mui/material";
import { EditOutlined } from "@mui/icons-material";
import { EllipsisText } from "../../theme/styledComponents";
import { generateS3FilePath } from "../../utils/files";

const CompanyCard = ({ company, onEdit, onDelete }) => {
  return (
    <Card>
      <CardContent sx={{ width: 200 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <EllipsisText variant="body1" fontWeight="bold">
            {company.name}
          </EllipsisText>
          <Stack direction="row" gap={1}>
            <IconButton size="small" onClick={onEdit} color="primary">
              <EditOutlined fontSize="small" />
            </IconButton>
            {/* <IconButton size="small" onClick={onDelete} color="error">
              <DeleteOutline fontSize="small" />
            </IconButton> */}
          </Stack>
        </Stack>
        <Box display="flex" justifyContent="center" my={2}>
          <Box
            sx={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 1.5,
            }}
            variant="h3"
            component={"img"}
            src={generateS3FilePath(company?.logo)}
          />
        </Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <EllipsisText variant="body2" fontWeight="bold">
            {company.manager?.firstName || "N/A"}
          </EllipsisText>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;
