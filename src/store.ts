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
  fetchProducts: () => Promise<void>;
  searchFilters: {
    name: string;
    category: string;
    availability: string;
  };
  isSearchTriggered: boolean;
  setSearchFilters: (filters: Partial<StoreState['searchFilters']>) => void;
  clearSearchFilters: () => void;
  toggleSearchTriggered: () => void;
  toggleChecked: (id: number) => void;
  addProduct: (product: Omit<Product, 'id' | 'checked'>) => void;
  editProduct: (id: number, updatedProduct: Omit<Product, 'id' | 'checked'>) => void;
  deleteProduct: (id: number) => void;
  getTotalProductsInStock: (category: string) => number;
  getTotalValueInStock: (category: string) => number;
  getAveragePriceInStock: (category: string) => number;
}

const useStore = create<StoreState>((set, get) => ({
  products: [],
  fetchProducts: async () => {
    try {
      const response = await axios.get("http://localhost:9090/inventory/products");
      set({ products: response.data });
    } catch (error) {
      console.error("Error fetching products:", error);
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
    isSearchTriggered: !state.isSearchTriggered, // Still a boolean, but will always trigger an update
  })),
  

  toggleChecked: (id) => set((state) => ({
    products: state.products.map((product) =>
      product.id === id
        ? { ...product, checked: !product.checked, stock: product.checked ? 10 : 0 }
        : product
    ),
  })),

  addProduct: (product) => set((state) => ({
    products: [...state.products, { ...product, id: Date.now(), checked: false }],
  })),

  editProduct: (id, updatedProduct) => set((state) => ({
    products: state.products.map((product) =>
      product.id === id ? { ...product, ...updatedProduct } : product
    ),
  })),

  deleteProduct: (id) => set((state) => ({
    products: state.products.filter((product) => product.id !== id),
  })),

  getTotalProductsInStock: (category) => {
    const products = get().products.filter(product => category === 'Overall' || product.category === category);
    return products.reduce((total, product) => total + product.stock, 0);
  },

  getTotalValueInStock: (category) => {
    const products = get().products.filter(product => category === 'Overall' || product.category === category);
    return products.reduce((total, product) => total + (product.price * product.stock), 0);
  },

  getAveragePriceInStock: (category) => {
    const products = get().products.filter(product => category === 'Overall' || product.category === category);
    const totalValue = products.reduce((total, product) => total + (product.price * product.stock), 0);
    const totalStock = products.reduce((total, product) => total + product.stock, 0);
    return totalStock ? totalValue / totalStock : 0;
  },
}));

export default useStore;