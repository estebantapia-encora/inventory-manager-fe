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
  const getRowBackground = (expiration: string | null) => {
    if (!expiration) return "transparent";
    const expDate = new Date(expiration);
    const currentDate = new Date();
    const diffInDays = Math.floor(
      (expDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffInDays < 7) return "#FF6961";
    if (diffInDays >= 7 && diffInDays <= 14) return "#FFFB29";
    if (diffInDays > 14) return "#77DD77";
    return "transparent";
  };

  const getStockCellColor = (stock: number) => {
    if (stock < 5) return "rgba(255, 0, 0, 0.3)";
    if (stock >= 5 && stock <= 10) return "rgba(241, 154, 24, 0.65)";
    return "transparent";
  };

  const [inventoryData, setInventoryData] = useState([
    {
      category: "Food",
      name: "Watermelon",
      price: "1.50",
      expiration: "2025-03-07",
      stock: 4,
      checked: false,
    },
    {
      category: "Food",
      name: "Milk",
      price: "1.50",
      expiration: "2025-03-25",
      stock: 7,
      checked: false,
    },
    {
      category: "Food",
      name: "Egg",
      price: "1.50",
      expiration: "2025-03-15",
      stock: 12,
      checked: false,
    },
    {
      category: "Food",
      name: "Sushi",
      price: "1.50",
      expiration: "2025-03-07",
      stock: 20,
      checked: false,
    },
    {
      category: "Food",
      name: "Doritos",
      price: "1.50",
      expiration: "2025-03-07",
      stock: 10,
      checked: false,
    },
    {
      category: "Electronics",
      name: "Samsung TV",
      price: "900.00",
      expiration: "",
      stock: 10,
      checked: false,
    },
    {
      category: "Clothing",
      name: "Jeans",
      price: "60.00",
      expiration: "",
      stock: 10,
      checked: false,
    },
    {
      category: "Clothing",
      name: "T-Shirt",
      price: "30.00",
      expiration: "",
      stock: 10,
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

  const calculateMetrics = () => {
    const categories = ["Food", "Clothing", "Electronics", "Overall"];
    return categories.map((category) => {
      const filteredItems =
        category === "Overall"
          ? inventoryData
          : inventoryData.filter((item) => item.category === category);

      const totalStock = filteredItems.reduce(
        (acc, item) => acc + item.stock,
        0
      );
      const totalValue = filteredItems.reduce(
        (acc, item) => acc + parseFloat(item.price) * item.stock,
        0
      );
      const avgPrice = totalStock > 0 ? totalValue / totalStock : 0;

      return {
        category,
        totalStock,
        totalValue,
        avgPrice,
      };
    });
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
        <Typography
          variant="h3"
          color="black"
          sx={{ mb: 4, fontWeight: "600", textDecoration: "underline" }}
        >
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
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ fontWeight: "bold" }}
              >
                Search
              </Button>
            </Grid2>
          </Grid2>
        </Box>

        <Button
          variant="contained"
          sx={{ mb: 2, backgroundColor: "green", fontWeight: "bold" }}
        >
          New Product
        </Button>

        {/* Table */}
        <TableContainer component={Paper} sx={{ mt: 4, mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>✔</TableCell>
                <TableCell
                  onClick={() => handleSort("category")}
                  sx={{
                    fontWeight: "bold",
                    transition: "all ease 300ms",
                    "&:hover": {
                      cursor: "pointer",
                      textDecoration: "underline",
                      color: "#4971d6",
                    },
                  }}
                >
                  Category ⬍
                </TableCell>
                <TableCell
                  onClick={() => handleSort("name")}
                  sx={{
                    fontWeight: "bold",
                    transition: "all ease 300ms",
                    "&:hover": {
                      cursor: "pointer",
                      textDecoration: "underline",
                      color: "#4971d6",
                    },
                  }}
                >
                  Name ⬍
                </TableCell>
                <TableCell
                  onClick={() => handleSort("price")}
                  sx={{
                    fontWeight: "bold",
                    transition: "all ease 300ms",
                    "&:hover": {
                      cursor: "pointer",
                      textDecoration: "underline",
                      color: "#4971d6",
                    },
                  }}
                >
                  Price ⬍
                </TableCell>
                <TableCell
                  onClick={() => handleSort("expiration")}
                  sx={{
                    fontWeight: "bold",
                    transition: "all ease 300ms",
                    "&:hover": {
                      cursor: "pointer",
                      textDecoration: "underline",
                      color: "#4971d6",
                    },
                  }}
                >
                  Expiration Date ⬍
                </TableCell>
                <TableCell
                  onClick={() => handleSort("stock")}
                  sx={{
                    fontWeight: "bold",
                    transition: "all ease 300ms",
                    "&:hover": {
                      cursor: "pointer",
                      textDecoration: "underline",
                      color: "#4971d6",
                    },
                  }}
                >
                  Stock ⬍
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
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

                  <TableCell
                    sx={{ backgroundColor: getRowBackground(item.expiration) }}
                  >
                    {item.category}
                  </TableCell>
                  <TableCell
                    sx={{ backgroundColor: getRowBackground(item.expiration) }}
                  >
                    {item.name}
                  </TableCell>
                  <TableCell
                    sx={{ backgroundColor: getRowBackground(item.expiration) }}
                  >
                    ${Number(item.price).toFixed(2)}
                  </TableCell>
                  <TableCell
                    sx={{ backgroundColor: getRowBackground(item.expiration) }}
                  >
                    {item.expiration || "-"}
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination count={10} color="primary" />
        </Box>

        <Box sx={{ mt: 4, p: 3, bgcolor: "#f9f9f9", borderRadius: 2 }}>
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
