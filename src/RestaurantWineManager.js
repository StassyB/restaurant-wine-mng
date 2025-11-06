import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tooltip,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
} from "@mui/material";
import { motion } from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import StarIcon from "@mui/icons-material/Star";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import WineBarIcon from "@mui/icons-material/WineBar";
import SaladIcon from "@mui/icons-material/Grass";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TheVelvetTable() {
  // --- State ---
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const [sortBy, setSortBy] = useState("rating");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const isMobile = useMediaQuery("(max-width:900px)");

  // --- Color Theme ---
  const themeColors = {
    primary: "#800020",      // wine red
    secondary: "#f8f4f0",    // cream
    background: "#fcf9f7",   // very light cream
    textPrimary: "#2c2c2c",  // dark gray
    wineHighlight: "#660018" // darker wine for wine items
  };

  // --- Dishes ---
  const baseDishes = [
    { id: 1, name: "Grilled Salmon", category: "Seafood", price: 1800, rating: 4.5 },
    { id: 2, name: "Beef Steak", category: "Main Course", price: 2200, rating: 4.8 },
    { id: 3, name: "Caesar Salad", category: "Salad", price: 850, rating: 4.1 },
    { id: 4, name: "Cabernet Sauvignon", category: "Wine", price: 3200, rating: 4.9 },
    { id: 5, name: "Chardonnay", category: "Wine", price: 2800, rating: 4.7 },
    { id: 6, name: "Prawn Pasta", category: "Seafood", price: 1950, rating: 4.6 },
    { id: 7, name: "Margarita Pizza", category: "Main Course", price: 1400, rating: 4.3 },
    { id: 8, name: "Greek Salad", category: "Salad", price: 950, rating: 4.2 },
  ];
  const [dishes, setDishes] = useState(baseDishes);

  // --- Categories ---
  const categories = [
    { name: "All", icon: <FastfoodIcon /> },
    { name: "Seafood", icon: <FastfoodIcon /> },
    { name: "Main Course", icon: <FastfoodIcon /> },
    { name: "Salad", icon: <SaladIcon /> },
    { name: "Wine", icon: <WineBarIcon /> },
  ];

  // --- Filtering + Sorting ---
  const filtered = useMemo(() => {
    const lower = search.trim().toLowerCase();
    return dishes
      .filter(d => selectedCategory === "All" ? true : d.category === selectedCategory)
      .filter(d => lower ? d.name.toLowerCase().includes(lower) : true)
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "price_asc") return a.price - b.price;
        if (sortBy === "price_desc") return b.price - a.price;
        return b.rating - a.rating;
      });
  }, [dishes, search, selectedCategory, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const drawerWidth = collapsed ? 60 : 260;

  // --- CSV Export ---
  const exportCSV = () => {
    const header = ["id", "name", "category", "price", "rating"];
    const rows = filtered.map(r => [r.id, r.name, r.category, r.price, r.rating]);
    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `velvet_table_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setSnack({ open: true, message: "Exported CSV", severity: "success" });
  };

  const handleSaveItem = (item) => {
    if (item.id) {
      setDishes(p => p.map(d => d.id === item.id ? item : d));
      setSnack({ open: true, message: "Item updated", severity: "success" });
    } else {
      setDishes(p => [{ ...item, id: Date.now() }, ...p]);
      setSnack({ open: true, message: "Item added", severity: "success" });
    }
    setOpenDialog(false);
  };

  const handleDelete = (id) => {
    setDishes(p => p.filter(d => d.id !== id));
    setSnack({ open: true, message: "Item removed", severity: "info" });
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: themeColors.background }}>
      {/* AppBar */}
      <AppBar position="fixed" sx={{ bgcolor: themeColors.primary, zIndex: 1300 }}>
        <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
          {isMobile && (
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <RestaurantMenuIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            The Velvet Table
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Toggle view">
              <IconButton color="inherit" onClick={() => setViewMode(v => v === "grid" ? "table" : "grid")}>
                {viewMode === "grid" ? <ViewListIcon /> : <GridViewIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Export visible items">
              <IconButton color="inherit" onClick={exportCSV}>
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
            <Avatar sx={{ bgcolor: themeColors.secondary, color: themeColors.primary, fontWeight: "bold" }}>VT</Avatar>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? drawerOpen : true}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: themeColors.secondary,
            borderRight: '1px solid #eee',
            pt: 10,
            transition: 'width 0.25s ease',
          },
        }}
      >
        <List>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', px: collapsed ? 1 : 2, py: 1, mb: 2 }}>
            {!collapsed && <Typography variant="subtitle1" fontWeight={700}>Menu</Typography>}
            <IconButton onClick={() => setCollapsed(c => !c)} size="small" sx={{ bgcolor: 'white', color: themeColors.primary }}>
              <MenuIcon fontSize="small" />
            </IconButton>
          </Box>

          {categories.map(cat => (
            <ListItemButton
              key={cat.name}
              selected={selectedCategory === cat.name}
              onClick={() => { setSelectedCategory(cat.name); if (isMobile) setDrawerOpen(false); }}
              sx={{ mx: collapsed ? 0 : 1, my: 0.6, borderRadius: 2, '&.Mui-selected': { bgcolor: themeColors.primary, color: themeColors.secondary } }}
            >
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', color: selectedCategory === cat.name ? themeColors.secondary : themeColors.textPrimary }}>
                {cat.icon}
              </ListItemIcon>
              {!collapsed && <ListItemText primary={cat.name} sx={{ ml: 2 }} />}
            </ListItemButton>
          ))}

          {!collapsed && (
            <Box sx={{ px: 2, mt: 2 }}>
              <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                <InputLabel>Sort</InputLabel>
                <Select value={sortBy} label="Sort" onChange={e => setSortBy(e.target.value)}>
                  <MenuItem value="rating">Top rated</MenuItem>
                  <MenuItem value="price_asc">Price: Low → High</MenuItem>
                  <MenuItem value="price_desc">Price: High → Low</MenuItem>
                </Select>
              </FormControl>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button size="small" variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: themeColors.primary, color: themeColors.secondary, '&:hover': { bgcolor: themeColors.wineHighlight } }} onClick={() => { setEditingItem(null); setOpenDialog(true); }}>
                  Add item
                </Button>
              </Stack>
            </Box>
          )}
        </List>
      </Drawer>

      {/* Main */}
     <Box sx={{ flexGrow: 1, width: '100%', mt: 10, px: 3 }}>
  <Container sx={{ mt: 2, mb: 8, px: 2 }}>
    {/* Search + Controls */}
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      justifyContent="space-between"
      alignItems="center"
      mb={3}
    >
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search menu..."
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{
          bgcolor: 'white',
          borderRadius: 2,
          width: { xs: '100%', sm: '60%' },
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        }}
      />
      <Stack direction="row" spacing={1} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Rows</InputLabel>
          <Select
            value={rowsPerPage}
            label="Rows"
            onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
          >
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={12}>12</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: themeColors.primary,
            color: themeColors.secondary,
            '&:hover': { bgcolor: themeColors.wineHighlight },
          }}
          onClick={() => { setEditingItem(null); setOpenDialog(true); }}
        >
          New
        </Button>
      </Stack>
    </Stack>

    {/* Grid / Table */}
    {viewMode === 'grid' ? (
      <Grid container spacing={3}>
        {paginated.length > 0 ? paginated.map(dish => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={dish.id}>
            <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300 }}>
             <Card
  sx={{
    borderRadius: 3,
    height: 280,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    p: 2,
    '&:hover': { boxShadow: '0 6px 25px rgba(0,0,0,0.15)' },
  }}
>
  <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
    <Box>
      <Typography variant="h6" noWrap>{dish.name}</Typography>
      <Chip
        label={dish.category}
        size="small"
        sx={{
          mt: 1,
          bgcolor: dish.category === 'Wine' ? themeColors.wineHighlight : themeColors.secondary,
          color: dish.category === 'Wine' ? 'white' : themeColors.textPrimary,
        }}
      />
    </Box>
    
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Price: <strong>KES {dish.price.toLocaleString()}</strong>
      </Typography>
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
        <StarIcon sx={{ color: 'gold' }} />
        <Typography variant="body2">{dish.rating}</Typography>
      </Stack>
    </Box>
  </CardContent>

  <Divider />

  <CardActions sx={{ justifyContent: 'space-between', px: 1 }}>
    <Button size="small" onClick={() => { setEditingItem(dish); setOpenDialog(true); }}>Edit</Button>
    <Button
      size="small"
      color="error"
      startIcon={<DeleteIcon />}
      onClick={() => handleDelete(dish.id)}
    >
      Remove
    </Button>
  </CardActions>
</Card>

            </motion.div>
          </Grid>
        )) : (
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: 3,
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                bgcolor: themeColors.secondary,
              }}
            >
              <Typography variant="h6">No items found</Typography>
              <Typography variant="body2" color="text.secondary">
                Try changing filters or add a new menu item.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    ) : (
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          borderRadius: 3,
          p: 1,
        }}
      >
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price (KES)</TableCell>
              <TableCell align="right">Rating</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map(r => (
              <TableRow key={r.id} hover>
                <TableCell>{r.id}</TableCell>
                <TableCell sx={{ maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {r.name}
                </TableCell>
                <TableCell>{r.category}</TableCell>
                <TableCell align="right">{r.price.toLocaleString()}</TableCell>
                <TableCell align="right">{r.rating}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button size="small" startIcon={<EditIcon />} onClick={() => { setEditingItem(r); setOpenDialog(true); }}>Edit</Button>
                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(r.id)}>Delete</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}

    {/* Pagination */}
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
      <Typography variant="body2">Showing {filtered.length} items</Typography>
      <Pagination count={pageCount} page={page} onChange={(_, v) => setPage(v)} color="primary" />
    </Stack>
  </Container>

  {/* Footer */}
  <Box sx={{ bgcolor: themeColors.primary, color: themeColors.secondary, py: 1, textAlign: 'center' }}>
    <Typography variant="body2">© {new Date().getFullYear()} The Velvet Table | All rights reserved</Typography>
  </Box>
</Box>


      {/* Dialog + Snackbar */}
      <ItemDialog open={openDialog} onClose={() => setOpenDialog(false)} item={editingItem} onSave={handleSaveItem} />
      <Snackbar open={snack.open} autoHideDuration={2500} onClose={() => setSnack(p => ({ ...p, open: false }))}>
        <Alert severity={snack.severity} sx={{ width: '100%' }}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}

// --- Dialog Component ---
function ItemDialog({ open, onClose, item, onSave }) {
  const [form, setForm] = useState({ name: "", category: "Main Course", price: 0, rating: 0 });

  React.useEffect(() => { if (item) setForm(item); else setForm({ name: "", category: "Main Course", price: 0, rating: 0 }); }, [item]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{item ? "Edit Item" : "Add New Item"}</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <TextField label="Name" fullWidth size="small" sx={{ my: 1 }} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <FormControl fullWidth size="small" sx={{ my: 1 }}>
          <InputLabel>Category</InputLabel>
          <Select value={form.category} label="Category" onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
            <MenuItem value="Main Course">Main Course</MenuItem>
            <MenuItem value="Salad">Salad</MenuItem>
            <MenuItem value="Seafood">Seafood</MenuItem>
            <MenuItem value="Wine">Wine</MenuItem>
          </Select>
        </FormControl>
        <TextField label="Price" type="number" fullWidth size="small" sx={{ my: 1 }} value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} />
        <TextField label="Rating" type="number" fullWidth size="small" sx={{ my: 1 }} inputProps={{ step: 0.1, min: 0, max: 5 }} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(form)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
