// src/theme/ThemeProvider.js
import React, { useMemo, useState, createContext, useContext } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const ColorModeContext = createContext();

export const useColorMode = () => useContext(ColorModeContext);

export default function CustomThemeProvider({ children }) {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#d32f2f" },
          secondary: { main: "#7b1fa2" },
          background: {
            default: mode === "light" ? "#fafafa" : "#121212",
            paper: mode === "light" ? "#fff" : "#1e1e1e",
          },
        },
        shape: { borderRadius: 12 },
        components: {
          MuiPaper: { styleOverrides: { root: { borderRadius: 12 } } },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
