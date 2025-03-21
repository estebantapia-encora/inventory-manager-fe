import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import "@testing-library/jest-dom/vitest"; // ✅ Ensure jest-dom matchers are available

import App from "../App";

test("renders Inventory Manager", () => {
  render(<App />);
  expect(screen.getByText(/Inventory Manager/i)).toBeInTheDocument();
});
