import { render, screen, fireEvent } from "@testing-library/react";
import Table from "../components/Table";
import { vi, expect, describe, beforeEach, test } from "vitest";
import useStore from "../store"; // Mock Zustand store

// Mock Zustand Store
vi.mock("../store", async (importOriginal) => {
  const actual = (await importOriginal()) as { default: typeof useStore };

  return {
    ...actual,
    default: () => ({
      products: [
        {
          id: 1,
          name: "Item 1",
          category: "Food",
          price: 10,
          expiration: "2025-01-01",
          stock: 5,
          checked: false,
        },
        {
          id: 2,
          name: "Item 2",
          category: "Tools",
          price: 20,
          expiration: "2025-06-01",
          stock: 2,
          checked: true,
        },
      ],
      fetchProducts: vi.fn(),
      toggleChecked: vi.fn(),
      deleteProduct: vi.fn(),
      editProduct: vi.fn(),
    }),
  };
});

describe("Table Component", () => {
  beforeEach(() => {
    render(<Table />);
  });

  test("renders table headers correctly", () => {
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Stock")).toBeInTheDocument();
    expect(screen.getByText("Expiration")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  test("renders products in the table", () => {
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Tools")).toBeInTheDocument();
    expect(screen.getByText("$10")).toBeInTheDocument();
    expect(screen.getByText("$20")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("calls deleteProduct when delete button is clicked", () => {
    const deleteButton = screen.getAllByText("Delete")[0]; // Assume "Delete" is the button text
    fireEvent.click(deleteButton);

    expect(useStore().deleteProduct).toHaveBeenCalled();
  });

  test("calls editProduct when edit button is clicked", () => {
    const editButton = screen.getAllByText("Edit")[0]; // Assume "Edit" is the button text
    fireEvent.click(editButton);

    expect(useStore().editProduct).toHaveBeenCalled();
  });

  test("calls toggleChecked when checkbox is clicked", () => {
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    expect(useStore().toggleChecked).toHaveBeenCalled();
  });
});
