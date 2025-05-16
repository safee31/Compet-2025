import { Typography, Divider, Grid2 } from "@mui/material";
import { EllipsisText } from "../theme/styledComponents";

// Utility function to create grid items
export const generateGridItem = ({ label, value, isLast = false }) => (
  <>
    <Grid2
      container
      spacing={1.5}
      borderBottom={isLast ? "" : "1px solid lightgrey"}
      py={1}
    >
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <EllipsisText align="left">{label}:</EllipsisText>
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <EllipsisText align="left" color={"textDisabled"}>
          {value || "N/A"}
        </EllipsisText>
      </Grid2>
    </Grid2>
  </>
);
