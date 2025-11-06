// src/components/tables/MenuTable.js
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Button,
  Checkbox,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import PrintIcon from "@mui/icons-material/Print";
import menuData from "../../data/menuData";

export default function MenuTable({ selectedCategory }) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const printRef = useRef();

  useEffect(() => {
    setData(menuData);
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "All" || item.category === selectedCategory)
  );

  const handleSelect = (item) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  };

  const handleDelete = (id) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (id) => {
    alert(`Edit functionality for ID ${id} (implement later)`);
  };

  const handlePrint = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to print.");
      return;
    }
    setTimeout(() => window.print(), 200);
  };

  const total = selectedItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <Box>
      {/* Search Bar + Print Button */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            width: "70%",
            "& .MuiOutlinedInput-root": { borderRadius: 3 },
          }}
        />
        <Button
          variant="contained"
          color="secondary"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
            bgcolor: "#8B0000",
            "&:hover": { bgcolor: "#6A0000" },
          }}
        >
          Print Selected Order
        </Button>
      </Stack>

      {/* Menu Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#5A1E1E" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Select</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Category</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Price (KES)</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Rating</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredData.map((item) => (
              <TableRow
                key={item.id}
                hover
                sx={{
                  "&:hover": { backgroundColor: "rgba(245, 222, 179, 0.2)" },
                }}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedItems.some((i) => i.id === item.id)}
                    onChange={() => handleSelect(item)}
                    sx={{
                      color: "#8B0000",
                      "&.Mui-checked": { color: "#8B0000" },
                    }}
                  />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <Chip
                    label={item.category}
                    size="small"
                    sx={{
                      bgcolor:
                        item.category === "Wine"
                          ? "#8B0000"
                          : item.category === "Seafood"
                          ? "#007B83"
                          : item.category === "Salad"
                          ? "#3C763D"
                          : "#6E2C00",
                      color: "white",
                    }}
                  />
                </TableCell>
                <TableCell>{item.price.toLocaleString()}</TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <StarIcon sx={{ color: "gold" }} fontSize="small" />
                    <Typography>{item.rating ?? "4.5"}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton color="primary" onClick={() => handleEdit(item.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No menu items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Printable Multi-Item Receipt */}
      {selectedItems.length > 0 && (
        <Box
          ref={printRef}
          sx={{
            display: "none",
            "@media print": {
              display: "block",
              p: 4,
              fontFamily: "Georgia, serif",
              color: "#3E2723",
              backgroundColor: "white",
            },
          }}
        >
          <Typography
            variant="h5"
            align="center"
            sx={{ mb: 1, fontWeight: "bold", color: "#8B0000" }}
          >
            🍷 Royal Haven Restaurant
          </Typography>
          <Typography align="center" variant="subtitle2" sx={{ mb: 2 }}>
            Elegant Dining • Exquisite Wines
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1">
            <strong>Date:</strong> {new Date().toLocaleString()}
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ mb: 1, color: "#5A1E1E" }}>
            Order Summary
          </Typography>

          {selectedItems.map((item) => (
            <Stack
              key={item.id}
              direction="row"
              justifyContent="space-between"
              sx={{ mb: 0.5 }}
            >
              <Typography>{item.name}</Typography>
              <Typography>KES {item.price.toLocaleString()}</Typography>
            </Stack>
          ))}

          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" align="right">
            Total: KES {total.toLocaleString()}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography align="center" sx={{ fontStyle: "italic", fontSize: "0.9rem" }}>
            “Thank you for dining with us. Bon Appétit!”
          </Typography>
          <Divider sx={{ mt: 2 }} />
          <Typography align="center" sx={{ fontSize: "0.8rem", mt: 1 }}>
            Printed by Royal Haven POS • {new Date().getFullYear()}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
