// src/__tests__/SearchFilters.test.tsx
import { render, screen } from "@testing-library/react";
import SearchFilters from "../components/SearchFilters";
import { test, expect } from "vitest";

test("renders search filters with inputs", () => {
  render(<SearchFilters />);

  // Product Name input (by label text)
  expect(screen.getByLabelText(/Product Name/i)).toBeInTheDocument();

  // Selects: we expect 2 comboboxes (Category + Availability)
  const selects = screen.getAllByRole("combobox");
  expect(selects).toHaveLength(2);
});
