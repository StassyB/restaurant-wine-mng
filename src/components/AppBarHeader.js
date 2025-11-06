// src/components/AppBarHeader.js
import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useColorMode } from "../theme/ThemeProvider";

export default function AppBarHeader() {
  const { toggleColorMode } = useColorMode();

  return (
    <AppBar position="fixed" sx={{ zIndex: 1201 }}>
      <Toolbar>
        <MenuBookIcon sx={{ mr: 2 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Restaurant & Wine Manager
        </Typography>
        <IconButton color="inherit" onClick={toggleColorMode}>
          <Brightness4Icon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
