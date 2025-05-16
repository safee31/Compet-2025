import React from "react";
import {
  Box,
  Typography,
  Checkbox,
  IconButton,
  Stack,
  Grid2,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { EllipsisText } from "../../theme/styledComponents";

const CustomListItem = ({
  fields,
  onClick = () => {},
  handleDelete = () => {},
  allowSelect = false,
  allowDelete = false,
  outlined = false,
  isLoading = false,
  ...props
}) => {
  return (
    <Stack
      {...props}
      direction={"row"}
      gap={1}
      flexWrap={"wrap"}
      p={1}
      borderRadius={2}
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
        boxShadow: outlined ? 0 : 2,
        border: outlined ? "1px solid grey" : "none",
        bgcolor: outlined ? "transparent" : "background.paper",
      }}
    >
      {/* Checkbox */}
      {allowSelect && <Checkbox disabled={isLoading} color="muted" />}

      {/* Dynamic Fields */}
      <Grid2
        container
        spacing={1}
        alignItems={"center"}
        flexGrow={1}
        // justifyContent={"space-around"}
      >
        {fields.map((field, index) => (
          <Grid2 size={{ xs: 6, sm: 4, md: 3 }} key={index} onClick={onClick}>
            <Typography variant="body2" fontSize={"12px"} color="gray">
              {field.label}
            </Typography>
            {field.ellipses ? (
              <EllipsisText variant="body1" fontWeight="bold" color="black">
                {field.render || "N/A"}
              </EllipsisText>
            ) : (
              <Typography variant="body1" fontWeight="bold" color="black">
                {field.render || "N/A"}
              </Typography>
            )}
          </Grid2>
        ))}
      </Grid2>

      {/* Delete Button */}
      {allowDelete && (
        <IconButton disabled={isLoading} onClick={handleDelete}>
          <DeleteOutlineIcon sx={{ color: "gray" }} />
        </IconButton>
      )}
    </Stack>
  );
};

export default CustomListItem;
