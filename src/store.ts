import { create } from 'zustand';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  expiration: string;
  stock: number;
  checked: boolean;
}

interface StoreState {
  products: Product[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  sortBy: string;
  sortOrder:string;
  totalStock: number;
  totalValue: number;
  categoryStock: Record<string, number>; // ✅ Add this
  categoryValue: Record<string, number>;
  checkedState: Map<number, { checked: boolean; stock: number }>;
  isLoading: boolean;
  fetchProducts: (page?: number, size?: number, sortBy?: string, sortOrder?: string) => Promise<void>;
  searchFilters: {
    name: string;
    category: string;
    availability: string;
  };
  isSearchTriggered: boolean;
  setSearchFilters: (filters: Partial<StoreState["searchFilters"]>) => void;
  clearSearchFilters: () => void;
  toggleSearchTriggered: () => void;
  toggleChecked: (id: number, checked: boolean) => void; 
  addProduct: (product: Omit<Product, "id" | "checked">) => void;
  editProduct: (id: number, updatedProduct: Omit<Product, "id" | "checked">) => void;
  deleteProduct: (id: number) => void;
}

const useStore = create<StoreState>((set, get) => ({
  products: [],
  totalPages: 1,
  totalProducts: 0,
  totalStock: 0,
  totalValue: 0,
  categoryStock: {},
  categoryValue: {},
  currentPage: 0,
  sortBy:"category",
  sortOrder:"asc",
  isLoading: false,
  checkedState: new Map<number, { checked: boolean; stock: number }>(), // ✅ Stores checked + stock

  fetchProducts: async (page = get().currentPage, size = 10, sortBy = "category", sortOrder = "asc") => {    
    try {
      set({ isLoading: true });

      const response = await axios.get(`http://localhost:9090/inventory/products`, {
        params: { 
          page, 
          size, 
          sortBy: sortBy || get().sortBy,   // ✅ Uses Zustand store default if not provided
          sortOrder: sortOrder || get().sortOrder // ✅ Uses Zustand store default if not provided
        }
      });

      const fetchedProducts = response.data.products.map((product: any) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.unitPrice ?? null,
        expiration: product.expirationDate ?? null,
        stock: product.quantityInStock ?? null,
      }));
  
      // Update state with the new fetched data
      set(() => ({
        products: fetchedProducts, // ✅ Full replacement, no merging
        totalPages: response.data.totalPages,
        totalProducts: response.data.totalProducts,
        totalStock: response.data.totalStock !== undefined ? response.data.totalStock : 0,
        totalValue: response.data.totalValue !== undefined ? response.data.totalValue : 0,
        categoryStock: response.data.categoryStock || {}, 
        categoryValue: response.data.categoryValue || {},
        currentPage: page,
        sortBy,
        sortOrder,
        isLoading:false,
      }));
      

      console.log("✅ categoryStock: ", response.data.categoryStock);
      console.log("✅ categoryValue: ", response.data.categoryValue);
      console.log("✅ Fetched products:", fetchedProducts); 

    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },
  
  
  toggleChecked: async (id: number, checked: boolean) => {
    try {
      const baseUrl = "http://localhost:9090"; // ✅ Ensure the correct backend URL
      const endpoint = checked
        ? `${baseUrl}/inventory/products/${id}/outofstock`
        : `${baseUrl}/inventory/products/${id}/instock`;
  
      const response = await fetch(endpoint, { method: checked ? "POST" : "PUT" });
  
      if (!response.ok) {
        throw new Error(`❌ Backend request failed with status ${response.status}`);
      }
  
      console.log(`✅ Stock successfully updated for product ${id}`);
  
      set((state) => {
        const updatedProducts = state.products.map((product) =>
          product.id === id ? { ...product, stock: checked ? 0 : 10 } : product
        );
  
        // 🔹 Recalculate total stock and value
        const newTotalStock = updatedProducts.reduce((sum, p) => sum + p.stock, 0);
        const newTotalValue = updatedProducts.reduce((sum, p) => sum + p.price * p.stock, 0);
  
        return {
          products: updatedProducts,
          totalStock: newTotalStock,
          totalValue: newTotalValue,
        };
      });
  
 
  
    } catch (error) {
      console.error("❌ Error updating stock status:", error);
    }
  },
  
  
  searchFilters: {
    name: '',
    category: '',
    availability: '',
  },

  isSearchTriggered: false,
  setSearchFilters: (filters) => set((state) => ({
    searchFilters: { ...state.searchFilters, ...filters },
  })),

  clearSearchFilters: () => set(() => ({
    searchFilters: {
      name: '',
      category: '',
      availability: '',
    },
    isSearchTriggered: false,
  })),

  toggleSearchTriggered: () => set((state) => ({
    isSearchTriggered: !state.isSearchTriggered,
  })),

  
  addProduct: async (product) => {
    try {
      const formattedProduct = {
        name: product.name,
        category: product.category,
        unitPrice: product.price, // ✅ Match backend naming
        expirationDate: product.expiration, // ✅ Match backend naming
        quantityInStock: product.stock, // ✅ Match backend naming
      };
  
      console.log("🆕 Sending request to add new product:", formattedProduct);
  
      const response = await axios.post(
        "http://localhost:9090/inventory/products",
        formattedProduct
      );
  
      if (response.status === 200 || response.status === 201) {
        console.log("✅ Product added successfully, updating Zustand state");
  
        // Fetch latest products from backend
        await get().fetchProducts();
      } else {
        console.error("❌ Failed to add product, status:", response.status);
      }
    } catch (error) {
      console.error("❌ Error adding product:", error);
    }
  },
  


  editProduct: async (id, updatedProduct) => {
    try {
      const formattedProduct = {
        ...updatedProduct,
        unitPrice: updatedProduct.price, // ✅ Fix naming issue
        quantityInStock: updatedProduct.stock, // ✅ Fix naming issue
        expirationDate: updatedProduct.expiration || null, // ✅ Correct field name
      };
  
      console.log(`🔄 Sending update request for product ID ${id}`, formattedProduct);
  
      const response = await axios.put(`http://localhost:9090/inventory/products/${id}`, formattedProduct);
  
      if (response.status === 200) {
        console.log("✅ Edit successful, updating Zustand state");
  
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, ...updatedProduct } : product
          ),
        }));
  
        console.log("📥 Fetching latest products after update...");
        await get().fetchProducts(get().currentPage); // ✅ Keep current page
      } else {
        console.error("❌ Edit failed with status:", response.status);
      }
    } catch (error) {
      console.error("❌ Error editing product:", error);
      get().fetchProducts(get().currentPage); // ✅ Restore latest backend state if error
    }
  },
  

  deleteProduct: async (id) => {
    try {
      console.log(`🗑️ Sending delete request for product ID ${id}`);
  
      const response = await axios.delete(`http://localhost:9090/inventory/products/${id}`);
  
      if (response.status === 200 || response.status === 204) { 
        console.log("✅ Delete successful, updating Zustand state");
  
        set((state) => {
          const updatedProducts = state.products.filter((product) => product.id !== id);
  
          // 🔹 Recalculate total stock and value
          const newTotalStock = updatedProducts.reduce((sum, p) => sum + p.stock, 0);
          const newTotalValue = updatedProducts.reduce((sum, p) => sum + p.price * p.stock, 0);
  
          return {
            products: updatedProducts,
            totalStock: newTotalStock, // ✅ Update immediately
            totalValue: newTotalValue, // ✅ Update immediately
          };
        });


        console.log("📥 Fetching latest products after delete...");
        await get().fetchProducts(get().currentPage); // ✅ Keep current page
      } else {
        console.error("❌ Delete failed with status:", response.status);
      }
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      get().fetchProducts(get().currentPage); // ✅ Keep current page even on error
    }
  },


  getTotalProductsInStock: (category: string) => {
    const products = get().products.filter(
      (product: Product) => category === "Overall" || product.category === category
    );
    return products.reduce((total: number, product: Product) => total + product.stock, 0);
  },
  
  getTotalValueInStock: (category: string) => {
    const products = get().products.filter(
      (product: Product) => category === "Overall" || product.category === category
    );
    return products.reduce((total: number, product: Product) => total + product.price * product.stock, 0);
  },

  getAveragePriceInStock: (category: string) => {
    const products = get().products.filter(
      (product: Product) => category === "Overall" || product.category === category
    );
    const totalValue = products.reduce(
      (total: number, product: Product) => total + product.price * product.stock,
      0
    );
    const totalStock = products.reduce(
      (total: number, product: Product) => total + product.stock,
      0
    );
    return totalStock ? totalValue / totalStock : 0;
  },
}));

export default useStore;
