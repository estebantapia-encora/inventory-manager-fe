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

  const { fetchProducts } = useStore();

  const handleSearch = () => {
    setSearchFilters(localFilters);

    fetchProducts(0, 1000);

    setTimeout(() => {
      toggleSearchTriggered();
    }, 0);
  };

  const handleClear = () => {
    clearSearchFilters();
    setLocalFilters({
      name: "",
      category: "",
      availability: "",
    });

    fetchProducts(0, 10);

    setTimeout(() => {
      toggleSearchTriggered();
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
          sx={{ width: "200px" }}
        />
        <FormControl variant="outlined" sx={{ width: "200px" }}>
          {" "}
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            inputProps={{ name: "category" }}
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
          <InputLabel>Availability</InputLabel>
          <Select
            label="Availability"
            inputProps={{ name: "availability" }}
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
