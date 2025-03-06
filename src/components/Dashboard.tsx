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
  const [inventoryData, setInventoryData] = useState([
    {
      category: "Food",
      name: "Watermelon",
      price: "$1.50",
      expiration: "12/25/2024",
      stock: 50,
      checked: false,
    },
    {
      category: "Electronics",
      name: "Samsung TV",
      price: "$900.00",
      expiration: "",
      stock: 0,
      checked: false,
    },
    {
      category: "Clothing",
      name: "Jeans",
      price: "$60.00",
      expiration: "",
      stock: 50,
      checked: false,
    },
    {
      category: "Clothing",
      name: "T-Shirt",
      price: "$30",
      expiration: "2025-12-31",
      stock: 100,
      checked: false,
    },
  ]);

  const handleSort = (field: keyof InventoryItem) => {
    const sortedData = [...inventoryData].sort((a, b) =>
      typeof a[field] === "number"
        ? (a[field] as number) - (b[field] as number)
        : String(a[field]).localeCompare(String(b[field]))
    );
    setInventoryData(sortedData);
  };

  const handleCheckboxChange = (index: number) => {
    setInventoryData((prevData) =>
      prevData.map((item, i) =>
        i === index
          ? { ...item, checked: !item.checked, stock: item.checked ? 10 : 0 }
          : item
      )
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        bgcolor: "#f5f5f5",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          bgcolor: "#fff",
          p: 4,
          borderRadius: 2,
          boxShadow: 4,
          minHeight: "80vh",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Inventory Dashboard
        </Typography>

        <Box component="form" sx={{ mb: 4 }}>
          <Grid2 container spacing={2} alignItems="center">
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Product Name"
                variant="outlined"
                fullWidth
              ></TextField>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 3 }}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Category</InputLabel>
                <Select label="Category" defaultValue="">
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
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Availibility</InputLabel>
                <Select label="Availability" defaultValue="">
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                </Select>
              </FormControl>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 2 }}>
              <Button variant="contained" color="primary" fullWidth>
                Search
              </Button>
            </Grid2>
          </Grid2>
        </Box>

        <Button variant="contained" color="success" sx={{ mb: 2 }}>
          New Product
        </Button>

        {/* Table */}
        <TableContainer component={Paper} sx={{ mt: 4, mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>✔</TableCell>
                <TableCell onClick={() => handleSort("category")}>
                  Category ⬍
                </TableCell>
                <TableCell onClick={() => handleSort("name")}>Name ⬍</TableCell>
                <TableCell onClick={() => handleSort("price")}>
                  Price ⬍
                </TableCell>
                <TableCell onClick={() => handleSort("expiration")}>
                  Expiration Date ⬍
                </TableCell>
                <TableCell onClick={() => handleSort("stock")}>
                  Stock ⬍
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {inventoryData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </TableCell>

                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.expiration || "-"}</TableCell>
                  <TableCell>{item.stock}</TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button variant="contained" color="secondary" size="small">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "center, mt:4" }}>
          <Pagination count={10} color="primary" />
        </Box>
      </Container>
    </Box>
  );
}

export default Dashboard;
