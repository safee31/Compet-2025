import React from "react";
import { createContext, useState, useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import getTheme from "../theme/theme";
import ToasterWrapper from "../components/UI/Alerts";

export const ThemeContext = createContext();

export const ThemeProviderWrapper = ({ children }) => {
  const [themeMode, setThemeMode] = useState("light");

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <ToasterWrapper />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
