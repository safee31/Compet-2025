const components = {
  MuiCard: {
    styleOverrides: {
      root: {
        cursor: "pointer",
        "& .MuiPaper-root": {
          ":hover": { boxShadow: 3 },
          boxShadow: 1,
          borderRadius: 2,
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: "6px",
        textTransform: "none",
        // fontSize: "1rem",
        // "hover:": { bgColor: "secondary" },
      },
    },
  },
  MuiButtonBase: {
    styleOverrides: {
      root: {
        borderRadius: "6px",
        textTransform: "none", // Disable uppercase transformation
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: "6px",
        textTransform: "none", // Ensure standard buttons don't use uppercase
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: "6px",
        textTransform: "none", // Apply to IconButton
      },
    },
  },
  MuiFab: {
    styleOverrides: {
      root: {
        borderRadius: "6px",
        textTransform: "none", // Apply to Floating Action Button (FAB)
      },
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: {
        borderRadius: "6px",
        textTransform: "none", // Apply to ToggleButton
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: "6px",
      },
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: {
        marginBottom: "4px",
        fontWeight: 600,
        color: "#0a0a0a",
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        marginBottom: "4px",
        fontWeight: 600,
        color: "#0a0a0a",
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        marginBottom: "1px",
        marginTop: "1px",
        "& .MuiInputBase-root": {
          borderRadius: "6px", // Add rounded corners to inputs
        },
      },
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: {
        marginTop: "2px",
        marginLeft: "2px",
        // fontSize: "0.85rem",
        // color: "#d32f2f", // Default color for error messages
        // "&.Mui-error": {
        //   fontWeight: 500,
        // },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: "none",
        paddingBlock: 12,
      },
    },
  },
};

export default components;
export const customStyles = {
  themeScrollbar: {
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#B0B0B0", // Grey track
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#0E57FF", // Blue thumb
      borderRadius: "10px",
    },
  },
  themeScrollbarThin: {
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "5px", // Thin scrollbar
    },
  },
  hiddenScrollbar: {
    overflow: "auto",
    scrollbarWidth: "none", // For Firefox
    "&::-webkit-scrollbar": {
      display: "none", // For Chrome, Safari, Opera
    },
    msOverflowStyle: "none",
  },
};
