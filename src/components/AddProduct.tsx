import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import React, { useState} from "react";
import { SelectChangeEvent } from "@mui/material/Select";

type Product = {
  name: string;
  category: string;
  price: string;
  stock: string;
  expiration: string;
};

type AddProductProps = {
  addProduct: (product: {
    name: string;
    category: string;
    price: number;
    stock: number;
    expiration: string;
  }) => void;
};

const AddProduct: React.FC<AddProductProps> = ({ addProduct }) => {
  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    category: "",
    price: "",
    stock: "",
    expiration: "",
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewProduct({
      name: "",
      category: "",
      price: "",
      stock: "",
      expiration: "",
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { value } = e.target;
    setNewProduct((prev) => ({ ...prev, category: value }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    addProduct({
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      expiration: newProduct.category === "Food" ? newProduct.expiration : "",
      stock: parseInt(newProduct.stock, 10),
    });
    handleClose();
  };

  const isSaveDisabled =
    !newProduct.name ||
    !newProduct.category ||
    !newProduct.price ||
    !newProduct.stock ||
    (newProduct.category === "Food" && !newProduct.expiration);

  return (
    <>
    <Button
        variant="contained"
        onClick={handleOpen}
        sx={{ marginBottom: 2, width: 170, fontSize: "1rem" }}
      >
        Add Product
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ fontSize: "1.2rem" }}>Add New Product</DialogTitle>
        <DialogContent>
          <Select
            value={newProduct.category}
            onChange={handleSelectChange}
            displayEmpty
            sx={{ marginBottom: 2, fontSize: "1rem" }}
          >
            <MenuItem value="" disabled>
              Select Category
            </MenuItem>
            <MenuItem value="Clothing">Clothing</MenuItem>
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Food">Food</MenuItem>
          </Select>
          <TextField
            autoFocus
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={newProduct.name}
            onChange={handleChange}
            sx={{ marginBottom: 2, fontSize: "1.2rem" }}
          />

          <TextField
            name="price"
            label="Price"
            type="number"
            fullWidth
            value={newProduct.price}
            onChange={handleChange}
            sx={{ marginBottom: 2, fontSize: "1.2rem" }}
          />

          {newProduct.category === "Food" && (
            <TextField
              name="expiration"
              label="Expiration Date"
              type="date"
              fullWidth
              value={newProduct.expiration}
              onChange={handleChange}
              sx={{ marginBottom: 2, fontSize: "1.2rem" }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}

          <TextField
            name="stock"
            label="Stock"
            type="number"
            fullWidth
            value={newProduct.stock}
            onChange={handleChange}
            sx={{ fontSize: "1.2rem" }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="secondary"
            sx={{ fontSize: "1rem", marginRight: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            color="primary"
            disabled={isSaveDisabled}
            sx={{ fontSize: "1rem", marginRight: 2 }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      </>
        )
        };

        export default AddProduct;