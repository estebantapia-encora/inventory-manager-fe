import { vi } from "vitest";

const mockAxios = {
  get: vi.fn(() => Promise.resolve({ data: [] })), // Simula una respuesta vacía
  post: vi.fn(() => Promise.resolve({ data: {} })),
  put: vi.fn(() => Promise.resolve({ data: {} })),
  delete: vi.fn(() => Promise.resolve({ data: {} })),
};

export default {
  ...mockAxios, // Spread all methods
  default: mockAxios, // ✅ Ensure there's a default export
};
