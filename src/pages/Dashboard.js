// src/pages/Dashboard.js
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MenuTable from "../components/tables/MenuTable";
import WineTable from "../components/tables/WineTable";
import { Box, Toolbar } from "@mui/material";
import AppBarHeader from "../components/AppBarHeader";

export default function Dashboard() {
  const [currentSection, setCurrentSection] = useState("menu");

  return (
    <Box sx={{ display: "flex" }}>
      <AppBarHeader />
      <Sidebar currentSection={currentSection} setCurrentSection={setCurrentSection} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {currentSection === "menu" && <MenuTable />}
        {currentSection === "wines" && <WineTable />}
      </Box>
    </Box>
  );
}

