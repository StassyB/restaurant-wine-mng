// src/components/tables/WineTable.js
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Card, CardContent, Typography } from "@mui/material";
import wineData from "../../data/wineData";

export default function WineTable() {
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Wine Name", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "year", headerName: "Year", flex: 1 },
    { field: "price", headerName: "Price ($)", flex: 1 },
  ];

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Wine Collection
        </Typography>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid rows={wineData} columns={columns} pageSize={5} />
        </div>
      </CardContent>
    </Card>
  );
}
