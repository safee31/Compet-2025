import { Box, Chip } from "@mui/material";

export const createDynamicChip = ({
  label,
  color = "default",
  backgroundColor = "",
  textColor = "#FFFFFF",
  size = "small",
  fontSize = "11px",
  variant = "filled",
}) => {
  return (
    <Box>
      <Chip
        label={label}
        color={color}
        sx={{
          backgroundColor: backgroundColor,
          color: textColor,
          fontSize,
        }}
        size={size}
        variant={variant}
      />
    </Box>
  );
};
