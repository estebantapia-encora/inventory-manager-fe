import { render, screen } from "@testing-library/react";
import { vi, test, expect } from "vitest"; // ✅ Import vi from vitest
import InventoryMetrics from "../components/InventoryMetrics";

// Mock the store
vi.mock(
  "../store",
  async (importActual: () => Promise<typeof import("../store")>) => {
    const actual = await importActual();
    return {
      ...actual,
      useInventoryStore: () => ({
        products: [
          { category: "Food", stock: 10, price: 5 },
          { category: "Food", stock: 5, price: 3 },
          { category: "Electronics", stock: 2, price: 100 },
        ],
      }),
    };
  }
);

test("renders inventory metrics correctly", () => {
  render(<InventoryMetrics />);

  expect(screen.getByText("Food")).toBeInTheDocument();
  expect(screen.getByText("Electronics")).toBeInTheDocument();
  expect(screen.getByText("Overall")).toBeInTheDocument();

  expect(screen.getAllByText(/\$\d+\.\d{2}/).length).toBeGreaterThan(0);
});
