import { create } from 'zustand';

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
  products: [
    { id: 1, name: 'TV', category: 'Electronics', price: 6000, expiration: '', stock: 6, checked: false },
    { id: 2, name: 'Shirt', category: 'Clothing', price: 50, expiration: '', stock: 9, checked: false },
    { id: 3, name: 'Cupcake', category: 'Food', price: 30, expiration: '2025-03-15', stock: 16, checked: false },
    { id: 4, name: 'Pants', category: 'Clothing', price: 400, expiration: '', stock: 3, checked: false },
    { id: 5, name: 'Gamer PC', category: 'Electronics', price: 8000, expiration: '', stock: 16, checked: false },
    { id: 6, name: 'Ice cream sandwich', category: 'Food', price: 40, expiration: '2025-04-12', stock: 9, checked: false },
    { id: 7, name: 'Western Pants', category: 'Clothing', price: 500, expiration: '', stock: 16, checked: false },
    { id: 8, name: 'Torta de Tamal', category: 'Food', price: 40, expiration: '2025-03-30', stock: 3, checked: false },
    { id: 9, name: 'Socks', category: 'Clothing', price: 60, expiration: '', stock: 16, checked: false },
    { id: 10, name: 'Burritos de Machaca', category: 'Food', price: 20, expiration: '2025-03-25', stock: 9, checked: false },
    { id: 11, name: 'Hat', category: 'Clothing', price: 250, expiration: '', stock: 16, checked: false },
    { id: 12, name: 'Laptop', category: 'Electronics', price: 6000, expiration: '', stock: 3, checked: false },
    { id: 13, name: 'Nintendo Switch', category: 'Electronics', price: 6500, expiration: '', stock: 16, checked: false },
  ],
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