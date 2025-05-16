import { createTheme } from "@mui/material/styles";
import { lightPalette, darkPalette } from "./palette";
import typography from "./typography";
import components from "./components";

const customShadows = {
  main: "0px 4px 12px rgba(160, 168, 198, 0.1956)", // Matches the given shadow
  light: "0px 2px 6px rgba(160, 168, 198, 0.15)", // Lighter version
  strong: "0px 6px 18px rgba(160, 168, 198, 0.25)", // Stronger version
};
const getTheme = (mode) =>
  createTheme({
    palette: mode === "dark" ? darkPalette : lightPalette,
    typography,
    components,
    shadows: [
      "none", // Elevation 0
      customShadows.light, // Elevation 1
      customShadows.main, // Elevation 2
      customShadows.strong, // Elevation 3
      ...Array(22).fill(customShadows.main), // Apply custom shadow to all elevations
    ],
  });

export default getTheme;
