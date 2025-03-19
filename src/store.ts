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
  checkedState: Map<number, { checked: boolean; stock: number }>;
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
  getTotalProductsInStock: (category: string) => number;
  getTotalValueInStock: (category: string) => number;
  getAveragePriceInStock: (category: string) => number;
}

const useStore = create<StoreState>((set, get) => ({
  products: [],
  totalPages: 1,
  totalProducts: 0,
  currentPage: 0,
  sortBy:"category",
  sortOrder:"asc",
  checkedState: new Map<number, { checked: boolean; stock: number }>(), // ✅ Stores checked + stock

  fetchProducts: async (page = 0, size = 10, sortBy = "category", sortOrder = "asc") => {
    
    try {
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
  
      set((state) => ({
        ...state,
        products: fetchedProducts, // ✅ Reset the product list with new data
        totalPages: response.data.totalPages, // ✅ Store total pages from backend
        totalProducts: response.data.totalProducts, // ✅ Store total products from backend
        currentPage: page, // ✅ Ensure current page is updated

        sortBy,
        sortOrder,

        // Preserve existing functions
        fetchProducts: state.fetchProducts, // ✅ Ensure fetchProducts remains accessible
        toggleChecked: state.toggleChecked, // ✅ Keep existing function for marking products out of stock
        addProduct: state.addProduct, // ✅ Keep existing function for adding a product
        editProduct: state.editProduct, // ✅ Keep existing function for editing a product
        deleteProduct: state.deleteProduct, // ✅ Keep existing function for deleting a product
        searchFilters: state.searchFilters, // ✅ Preserve search filters state
      }));
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
  
      // ✅ Ensure UI refreshes by fetching updated products
      await get().fetchProducts();
  
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

  addProduct: (product) => set((state) => ({
    products: [...state.products, { ...product, id: Date.now(), checked: false }],
  })),


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
            await get().fetchProducts(); // ✅ Ensure latest data is fetched
        } else {
            console.error("❌ Edit failed with status:", response.status);
        }
    } catch (error) {
        console.error("❌ Error editing product:", error);
        get().fetchProducts(); // ✅ Restore latest backend state if error
    }
},


deleteProduct: async (id) => {
  try {
    console.log(`🗑️ Sending delete request for product ID ${id}`);

    const response = await axios.delete(`http://localhost:9090/inventory/products/${id}`);

    if (response.status === 200 || response.status === 204) { 
      console.log("✅ Delete successful, updating Zustand state");

      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
      }));

      console.log("📥 Fetching latest products after delete...");
      await get().fetchProducts(); // ✅ Ensure latest data is fetched
    } else {
      console.error("❌ Delete failed with status:", response.status);
    }
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    get().fetchProducts(); // ✅ Restore latest backend state if error
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
