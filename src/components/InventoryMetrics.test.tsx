import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import InventoryMetrics from "./InventoryMetrics";

// ✅ Mock Zustand store
const mockGetTotalProductsInStock = vi.fn();
const mockGetTotalValueInStock = vi.fn();
const mockGetAveragePriceInStock = vi.fn();

vi.mock("../store", () => ({
  __esModule: true,
  default: vi.fn(() => ({
    getTotalProductsInStock: mockGetTotalProductsInStock,
    getTotalValueInStock: mockGetTotalValueInStock,
    getAveragePriceInStock: mockGetAveragePriceInStock,
  })),
}));

describe("InventoryMetrics component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTotalProductsInStock.mockImplementation(() => 10);
    mockGetTotalValueInStock.mockImplementation(() => 500);
    mockGetAveragePriceInStock.mockImplementation(() => 50);
  });

  it("renders metrics table with all categories", () => {
    render(<InventoryMetrics />);

    ["Food", "Clothing", "Electronics", "Overall"].forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });

    // Check that mocked metric values appear correctly
    expect(screen.getAllByText("10")).toHaveLength(4); // 4 categories
    expect(screen.getAllByText("$500.00")).toHaveLength(4);
    expect(screen.getAllByText("$50.00")).toHaveLength(4);
  });

  it("calls store functions for each category", () => {
    render(<InventoryMetrics />);

    expect(mockGetTotalProductsInStock).toHaveBeenCalledTimes(4);
    expect(mockGetTotalValueInStock).toHaveBeenCalledTimes(4);
    expect(mockGetAveragePriceInStock).toHaveBeenCalledTimes(4);
  });
});
