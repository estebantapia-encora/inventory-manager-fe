import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  TableSortLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  SelectChangeEvent,
  InputAdornment,
} from "@mui/material";

import Grid2 from "@mui/material/Grid2";
import { useState } from "react";

interface InventoryItem {
  category: string;
  name: string;
  price: number;
  expiration: string;
  stock: number;
  checked: boolean;
}

function Dashboard() {
  const getRowBackground = (expiration: string | null) => {
    if (!expiration) return { color: "transparent", daysUntilExpiration: null };
    const expDate = new Date(expiration);
    const currentDate = new Date();
    const diffInDays = Math.floor(
      (expDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffInDays < 7)
      return { color: "#FF6961", daysUntilExpiration: diffInDays };
    if (diffInDays >= 7 && diffInDays <= 14)
      return { color: "#FFFB29", daysUntilExpiration: diffInDays };
    if (diffInDays > 14)
      return { color: "#77DD77", daysUntilExpiration: diffInDays };
    return { color: "transparent", daysUntilExpiration: null };
  };
  const getStockCellColor = (stock: number) => {
    if (stock < 5) return "rgba(255, 0, 0, 0.3)";
    if (stock >= 5 && stock <= 10) return "rgba(241, 154, 24, 0.65)";
    return "transparent";
  };

  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([
    {
      category: "Food",
      name: "Watermelon",
      price: 1.5,
      expiration: "2025-04-07",
      stock: 4,
      checked: false,
    },
    {
      category: "Food",
      name: "Milk",
      price: 1.5,
      expiration: "2025-04-25",
      stock: 7,
      checked: false,
    },
    {
      category: "Food",
      name: "Egg",
      price: 1.5,
      expiration: "2025-03-15",
      stock: 12,
      checked: false,
    },
    {
      category: "Food",
      name: "Sushi",
      price: 1.5,
      expiration: "2025-03-07",
      stock: 20,
      checked: false,
    },
    {
      category: "Food",
      name: "Doritos",
      price: 1.5,
      expiration: "2025-03-07",
      stock: 10,
      checked: false,
    },
    {
      category: "Electronics",
      name: "Samsung TV",
      price: 900,
      expiration: "",
      stock: 10,
      checked: false,
    },
    {
      category: "Clothing",
      name: "Jeans",
      price: 60,
      expiration: "",
      stock: 10,
      checked: false,
    },
  ]);

  const handleSort = (field: keyof InventoryItem) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
    setInventoryData((prevData) =>
      [...prevData].sort((a, b) =>
        isAsc
          ? typeof a[field] === "number"
            ? (a[field] as number) - (b[field] as number)
            : String(a[field]).localeCompare(String(b[field]))
          : typeof a[field] === "number"
          ? (b[field] as number) - (a[field] as number)
          : String(b[field]).localeCompare(String(a[field]))
      )
    );
  };

  const handleCheckboxChange = (index: number) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index;
    setInventoryData((prevData) =>
      prevData.map((item, i) =>
        i === actualIndex
          ? { ...item, checked: !item.checked, stock: !item.checked ? 0 : 10 }
          : item
      )
    );
  };

  const [sortField, setSortField] = useState<keyof InventoryItem>("category");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [searchFilters, setSearchFilters] = useState({
    name: "",
    category: "",
    availability: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAvailability, setselectedAvailability] = useState("");

  const handleSearch = () => {
    setSearchTerm(searchFilters.name);
    setSelectedCategory(searchFilters.category);
    setselectedAvailability(searchFilters.availability);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchFilters({
      name: "",
      category: "",
      availability: "",
    });
    setSearchTerm("");
    setSelectedCategory("");
    setselectedAvailability("");
    setCurrentPage(1);
  };

  const updateSearchFilters = (field: string, value: string) => {
    setSearchFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const filteredData = inventoryData.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory ? item.category === selectedCategory : true) &&
      (selectedAvailability
        ? selectedAvailability === "Available"
          ? item.stock > 0
          : item.stock === 0
        : true)
    );
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const calculateMetrics = () => {
    const categories = ["Food", "Clothing", "Electronics", "Overall"];
    return categories.map((category) => {
      const filteredItems =
        category === "Overall"
          ? inventoryData
          : inventoryData.filter((item) => item.category === category);

      console.log(`Category: ${category}`, filteredItems);

      const totalStock = filteredItems.reduce(
        (acc, item) => acc + item.stock,
        0
      );
      const totalValue = filteredItems.reduce(
        (acc, item) => acc + item.price * item.stock,
        0
      );
      const avgPrice = totalStock > 0 ? totalValue / totalStock : 0;

      console.log(
        `Category: ${category}, Total Stock: ${totalStock}, Total Value: ${totalValue}, Avg Price: ${avgPrice}`
      );

      return {
        category,
        totalStock,
        totalValue,
        avgPrice,
      };
    });
  };

  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    stock: "",
    price: "",
    expiration: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name!]: value }));
  };

  const handleSave = () => {
    const newProductParsed = {
      ...newProduct,
      stock: parseInt(newProduct.stock, 10),
      price: parseFloat(newProduct.price),
      checked: false,
      expiration: newProduct.category === "Food" ? newProduct.expiration : "",
    };
    console.log("New Product:", newProductParsed);
    setInventoryData((prevData) => [...prevData, newProductParsed]);
    handleClose();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        minHeight: "100vh",
        width: "100vw",
        bgcolor: "#f5f5f5",
        overflowY: "auto",
        marginTop: "20px",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          mt: 4,
          bgcolor: "#fff",
          borderRadius: 2,
          boxShadow: 4,
          minHeight: "80vh",
        }}
      >
        <Typography
          variant="h4"
          color="black"
          sx={{ mt: 2, mb: 4, fontWeight: "600", textDecoration: "underline" }} // Added mb: 4 for margin-bottom
        >
          Inventory Dashboard
        </Typography>

        <Box component="form" sx={{ mb: 4 }}>
          <Grid2 container spacing={2} alignItems="center">
            <Grid2 size={{ xs: 12, sm: 3 }}>
              <TextField
                label="Search Product"
                variant="outlined"
                fullWidth
                value={searchFilters.name}
                onChange={(e) => updateSearchFilters("name", e.target.value)}
                sx={{ height: "56px" }} // Match the height of the search button
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 3 }}>
              <FormControl variant="outlined" fullWidth sx={{ height: "56px" }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={searchFilters.category}
                  onChange={(e) =>
                    updateSearchFilters("category", e.target.value)
                  }
                  label="Category"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Clothing">Clothing</MenuItem>
                </Select>
              </FormControl>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 3 }}>
              <FormControl variant="outlined" fullWidth sx={{ height: "56px" }}>
                <InputLabel>Availability</InputLabel>
                <Select
                  value={searchFilters.availability}
                  onChange={(e) =>
                    updateSearchFilters("availability", e.target.value)
                  }
                  label="Availability"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                </Select>
              </FormControl>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 2 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ fontWeight: "bold", height: "56px" }} // Ensure consistent height
                onClick={handleSearch}
              >
                Search
              </Button>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 1 }}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ fontWeight: "bold", height: "56px" }} // Ensure consistent height
                onClick={handleClearSearch}
              >
                Clear
              </Button>
            </Grid2>
          </Grid2>
        </Box>

        <Button
          variant="contained"
          sx={{ mb: 2, backgroundColor: "green", fontWeight: "bold" }}
          onClick={handleOpen}
        >
          New Product
        </Button>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogContent>
            <TextField
              label="Product Name"
              autoFocus
              margin="dense"
              name="name"
              onChange={handleInputChange}
              type="text"
              fullWidth
              variant="outlined"
              value={newProduct.name}
            />
            <FormControl fullWidth variant="outlined" margin="dense">
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={newProduct.category}
                onChange={handleSelectChange}
                label="Category"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Clothing">Clothing</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              name="stock"
              label="Stock"
              type="number"
              fullWidth
              variant="outlined"
              value={newProduct.stock}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="price"
              label="Unit Price"
              type="number"
              fullWidth
              variant="outlined"
              value={newProduct.price}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
            {newProduct.category === "Food" && (
              <TextField
                margin="dense"
                name="expiration"
                label="Expiration Date"
                type="date"
                fullWidth
                variant="outlined"
                value={newProduct.expiration}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Table */}
        <TableContainer component={Paper} sx={{ mt: 4, mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>✔</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "category"}
                    direction={sortOrder}
                    onClick={() => handleSort("category")}
                  >
                    Category
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "name"}
                    direction={sortOrder}
                    onClick={() => handleSort("name")}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "price"}
                    direction={sortOrder}
                    onClick={() => handleSort("price")}
                  >
                    Price
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "expiration"}
                    direction={sortOrder}
                    onClick={() => handleSort("expiration")}
                  >
                    Expiration Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "stock"}
                    direction={sortOrder}
                    onClick={() => handleSort("stock")}
                  >
                    Stock
                  </TableSortLabel>
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.map((item, index) => {
                const { color, daysUntilExpiration } = getRowBackground(
                  item.expiration
                );
                return (
                  <TableRow
                    key={index}
                    sx={{
                      textDecoration:
                        item.stock === 0 ? "line-through" : "none",
                    }}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </TableCell>
                    <TableCell sx={{ backgroundColor: color }}>
                      {item.category}
                    </TableCell>
                    <TableCell sx={{ backgroundColor: color }}>
                      {item.name}
                    </TableCell>
                    <TableCell sx={{ backgroundColor: color }}>
                      ${Number(item.price).toFixed(2)}
                    </TableCell>
                    <TableCell sx={{ backgroundColor: color }}>
                      {item.expiration || "-"}
                      {daysUntilExpiration !== null &&
                        daysUntilExpiration >= 7 &&
                        daysUntilExpiration <= 14 && (
                          <Typography variant="caption" color="error">
                            {` (expiring in ${daysUntilExpiration} days)`}
                          </Typography>
                        )}
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: getStockCellColor(item.stock),
                        fontWeight: "bold",
                        borderLeft: "0.5px solid black",
                        borderRight: "0.5px solid black",
                      }}
                    >
                      {item.stock}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ mr: 1, fontWeight: "bold" }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#e85831",
                          "&:hover": {
                            backgroundColor: "#d64b24",
                          },
                          fontWeight: "bold",
                        }}
                        size="small"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination
            count={Math.ceil(inventoryData.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>

        <Box
          component={Paper}
          sx={{ mt: 2, mb: 2, p: 3, bgcolor: "#f9f9f9", borderRadius: 2 }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "black",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            Inventory Metrics
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Total Products in Stock
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Total Value in Stock
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Average Price in Stock
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {calculateMetrics().map(
                ({ category, totalStock, totalValue, avgPrice }) => (
                  <TableRow
                    key={category}
                    sx={{
                      borderTop:
                        category === "Overall" ? "1.5px solid gray" : "none",
                      fontWeight: category === "Overall" ? "bold" : "normal",
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: category === "Overall" ? "bold" : "normal",
                      }}
                    >
                      {category}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: category === "Overall" ? "bold" : "normal",
                      }}
                    >
                      {totalStock}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: category === "Overall" ? "bold" : "normal",
                      }}
                    >
                      ${totalValue.toFixed(2)}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: category === "Overall" ? "bold" : "normal",
                      }}
                    >
                      ${avgPrice.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </Box>
      </Container>
    </Box>
  );
}

export default Dashboard;
