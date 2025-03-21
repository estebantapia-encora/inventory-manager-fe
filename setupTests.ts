import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Mock Axios
vi.mock("axios", () => {
  console.log("✅ Axios is being mocked!");

  const mockAxios = {
    get: vi.fn(async () => {
      console.log("✅ Mock Axios GET called!");
      return { data: [] }; // Ensure data is always an array
    }),
    post: vi.fn(async () => ({ data: {} })),
    put: vi.fn(async () => ({ data: {} })),
    delete: vi.fn(async () => ({ data: {} })),
  };

  return {
    ...mockAxios,
    default: mockAxios, // ✅ Ensure there's a default export
  };
});
