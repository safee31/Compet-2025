import { keyframes, styled, TableCell, Typography } from "@mui/material";
import { Box } from "@mui/material";

export const MainSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1), // Default padding
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(1.5),
  },
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(2.5),
  },
  transition: "margin 0.2s ease-in-out",
  height: "100%",
}));
export const EllipsisTableCell = ({ children, lines = 1, ...props }) => (
  <Box
    sx={{
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: lines,
      WebkitBoxOrient: "vertical",
    }}
    {...props}
  >
    {children}
  </Box>
);
export const StyledTableHeadCell = styled(TableCell)({
  backgroundColor: "#ffff",
  // borderBottom: "0px",
  whiteSpace: "nowrap",
  fontWeight: "bold",
});
export const EllipsisText = ({ children, lines = 1, ...props }) => (
  <Typography
    sx={{
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: lines,
      WebkitBoxOrient: "vertical",
    }}
    {...props}
  >
    {children}
  </Typography>
);

const ping = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.75;
  }
  70%, 100% {
    transform: scale(2);
    opacity: 0;
  }
`;

const PingDotContainer = styled(Box)({
  position: "relative",
  display: "flex",
  width: "12px",
  height: "12px",
});

const PingDotAnimated = styled(Box)(({ color = "green" }) => ({
  position: "absolute",
  animation: `${ping} 1.5s cubic-bezier(0, 0, 0.0, 1) infinite`,
  borderRadius: "50%",
  backgroundColor: color === "green" ? "#52BE68" : color,
  width: "100%",
  height: "100%",
}));

const PingDotStatic = styled(Box)(({ color = "green" }) => ({
  position: "relative",
  borderRadius: "50%",
  backgroundColor: color === "green" ? "#52BE68" : color, // green-500
  width: "100%",
  height: "100%",
}));

export function PingDot({ color = "green", size = 12 }) {
  return (
    <PingDotContainer sx={{ width: size, height: size }}>
      <PingDotAnimated color={color} />
      <PingDotStatic color={color} />
    </PingDotContainer>
  );
}

// Usage example:
// <PingDot color="sky" size={12} />
// <PingDot color="#ff0000" size={16} />
