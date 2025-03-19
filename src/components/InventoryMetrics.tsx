import useStore from "../store";
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
} from "@mui/material";

const InventoryMetrics = () => {
  const {
    totalStock,
    totalValue,
    categoryStock = {},
    categoryValue = {},
  } = useStore();

  const categories = ["Food", "Clothing", "Electronics", "Overall"];

  const getCategoryStock = (category: string) =>
    category === "Overall" ? totalStock : (categoryStock[category] ?? 0);

  const getCategoryValue = (category: string) =>
    category === "Overall" ? totalValue : (categoryValue[category] ?? 0);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Inventory Metrics
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "rgba(130, 150, 170, .5)" }}>
              <TableCell sx={{ fontSize: "1rem" }}>Category</TableCell>
              <TableCell sx={{ fontSize: "1rem" }}>
                Total Stock Quantity
              </TableCell>
              <TableCell sx={{ fontSize: "1rem" }}>
                Total Value in Stock
              </TableCell>
              <TableCell sx={{ fontSize: "1rem" }}>
                Average Price in Stock
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => {
              const stock = getCategoryStock(category);
              const value = getCategoryValue(category);
              const avgPrice = stock > 0 ? value / stock : 0;

              return (
                <TableRow
                  key={category}
                  sx={
                    category === "Overall"
                      ? {
                          fontWeight: "bold",
                          borderTop: "3px solid rgba(130, 150, 170, .5)",
                          bgcolor: "#181f26",
                        }
                      : { bgcolor: "#181f26" }
                  }
                >
                  <TableCell
                    sx={
                      category === "Overall"
                        ? { fontWeight: "bold", fontSize: "1rem" }
                        : { fontSize: "1rem" }
                    }
                  >
                    {category}
                  </TableCell>
                  <TableCell
                    sx={
                      category === "Overall"
                        ? { fontWeight: "bold", fontSize: "1rem" }
                        : { fontSize: "1rem" }
                    }
                  >
                    {stock}
                  </TableCell>
                  <TableCell
                    sx={
                      category === "Overall"
                        ? { fontWeight: "bold", fontSize: "1rem" }
                        : { fontSize: "1rem" }
                    }
                  >
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(value)}
                  </TableCell>
                  <TableCell
                    sx={
                      category === "Overall"
                        ? { fontWeight: "bold", fontSize: "1rem" }
                        : { fontSize: "1rem" }
                    }
                  >
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(avgPrice)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InventoryMetrics;
