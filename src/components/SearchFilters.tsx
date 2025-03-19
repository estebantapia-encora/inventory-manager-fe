import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import useStore from "../store";

const SearchFilters = () => {
  const {
    searchFilters,
    setSearchFilters,
    clearSearchFilters,
    toggleSearchTriggered,
  } = useStore();
  const [localFilters, setLocalFilters] = useState(searchFilters);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFilters({ ...localFilters, [name]: value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setLocalFilters({ ...localFilters, [name as string]: value as string });
  };

  const { fetchProducts } = useStore(); // ✅ Access from Zustand

  const handleSearch = () => {
    setSearchFilters(localFilters); // ✅ Apply filters

    // ✅ Fetch all products before filtering
    fetchProducts(0, 1000); // 🚀 Fetch large dataset (fixes search scope)

    setTimeout(() => {
      toggleSearchTriggered(); // ✅ Ensure UI updates correctly
    }, 0);
  };

  const handleClear = () => {
    clearSearchFilters();
    setLocalFilters({
      name: "",
      category: "",
      availability: "",
    });

    fetchProducts(0, 10); // ✅ Refetch the first page with default pagination

    setTimeout(() => {
      toggleSearchTriggered(); // ✅ Ensure search updates correctly
    }, 0);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
      <Box sx={{ mb: 1 }}>Search products</Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Product Name"
          name="name"
          value={localFilters.name}
          onChange={handleInputChange}
          variant="outlined"
          sx={{ width: "200px" }} // Set the width for the Product Name input
        />
        <FormControl variant="outlined" sx={{ width: "200px" }}>
          {" "}
          {/* Set the same width for Category */}
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            inputProps={{ name: "category" }} // Ensure the name attribute is set
            value={localFilters.category}
            onChange={handleSelectChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Clothing">Clothing</MenuItem>
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Food">Food</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ width: "200px" }}>
          {" "}
          {/* Set the same width for Availability */}
          <InputLabel>Availability</InputLabel>
          <Select
            label="Availability"
            inputProps={{ name: "availability" }} // Ensure the name attribute is set
            value={localFilters.availability}
            onChange={handleSelectChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Out of Stock">Out of Stock</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="contained" color="secondary" onClick={handleClear}>
          Clear
        </Button>
      </Box>
    </Box>
  );
};

export default SearchFilters;
