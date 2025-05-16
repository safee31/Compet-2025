const lightPalette = {
  mode: "light",
  primary: {
    main: "#0E57FF",
  },
  primaryLight: {
    main: "rgba(14, 87, 255, 0.2)", // Custom primaryLight
    contrastText: "#0E57FF", // Text color for contrast
  },
  secondary: {
    main: "#dc004e",
  },
  success: {
    main: "#52BE68", // ✅ Custom Success Color
    light: "#6DDC82", // Lighter shade for hover effects
    dark: "#3E9B53", // Darker shade for active effects
    contrastText: "#fff", // White text for contrast
  },
  white: {
    main: "#ffffff", // White background
    contrastText: "#000", // Black text
    light: "#f0f0f0", // Hover effect (lighter shade)
    dark: "#e0e0e0", // Active effect (darker shade)
  },
  background: {
    default: "#e1e2e0",
    paper: "white",
  },
  text: {
    primary: "#000",
    secondary: "#555",
  },
};

const darkPalette = {
  mode: "dark",
  primary: {
    main: "#0E57FF",
  },
  primaryLight: {
    main: "rgba(14, 87, 255, 0.2)", // Custom primaryLight
    contrastText: "#0E57FF", // Text color for contrast
  },
  secondary: {
    main: "#f48fb1",
  },
  success: {
    main: "#52BE68", // ✅ Custom Success Color
    light: "#6DDC82",
    dark: "#3E9B53",
    contrastText: "#fff",
  },
  white: {
    main: "#ffffff", // White background
    contrastText: "#000", // Black text
    light: "#f0f0f0", // Hover effect
    dark: "#e0e0e0", // Active effect
  },
  background: {
    default: "#121212",
    paper: "#1e1e1e",
  },
  text: {
    primary: "#fff",
    secondary: "#bbb",
  },
};

export { lightPalette, darkPalette };
