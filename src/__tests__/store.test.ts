import { vi } from "vitest";
import { create } from "zustand";
import useStore from "../store"; // Asegura que la ruta sea correcta

vi.mock("../store", async (importOriginal) => {
  const actual = (await importOriginal()) as { default: typeof useStore };

  return {
    ...actual,
    default: create(() => ({
      products: [
        { id: 1, name: "Item 1", category: "Food", price: 10, expiration: "2025-01-01", stock: 5, checked: false },
        { id: 2, name: "Item 2", category: "Tools", price: 20, expiration: "2025-06-01", stock: 2, checked: true },
      ],
      totalProducts: 2,
      totalStock: 7,
      totalValue: 70,
      totalPages: 1,
      currentPage: 0,
      sortBy: "category",
      sortOrder: "asc",
      categoryStock: { Food: 5, Tools: 2 }, // ✅ Agregado Tools para evitar errores
      categoryValue: { Food: 50, Tools: 20 }, // ✅ Agregado Tools para evitar errores
      checkedState: new Map(),

      // ✅ Mocking async functions
      fetchProducts: vi.fn(async () => Promise.resolve()), 
      toggleChecked: vi.fn(async (_id: number, _checked: boolean) => Promise.resolve()), 
      addProduct: vi.fn(async (_product: any) => Promise.resolve()), // ✅ Especificado any para evitar conflictos
      editProduct: vi.fn(async (_id: number, _product: any) => Promise.resolve()), // ✅ Corregido
      deleteProduct: vi.fn(async (_id: number) => Promise.resolve()), // ✅ Corregido

      // ✅ Mocking calculation functions
      getTotalProductsInStock: vi.fn(() => 7),   // ✅ Corregido
      getTotalValueInStock: vi.fn(() => 70),     // ✅ Corregido
      getAveragePriceInStock: vi.fn(() => 10),   // ✅ Corregido
    })),
  };
});
