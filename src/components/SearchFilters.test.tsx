import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import SearchFilters from './SearchFilters';


// Spies
const mockSetSearchFilters = vi.fn();
const mockClearSearchFilters = vi.fn();
const mockToggleSearchTriggered = vi.fn();

// Zustand mock
vi.mock('../store', () => ({
  __esModule: true,
  default: vi.fn(() => ({
    searchFilters: { name: '', category: '', availability: '' },
    setSearchFilters: mockSetSearchFilters,
    clearSearchFilters: mockClearSearchFilters,
    toggleSearchTriggered: mockToggleSearchTriggered,
  })),
}));

describe('SearchFilters component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('allows typing in the Product Name input', () => {
    render(<SearchFilters />);
    const input = screen.getByLabelText(/Product Name/i);
    fireEvent.change(input, { target: { value: 'Laptop' } });
    expect((input as HTMLInputElement).value).toBe('Laptop');
  });

  it('allows selecting a Category', () => {
    render(<SearchFilters />);
    const comboboxes = screen.getAllByRole('combobox');
    const categorySelect = comboboxes[0]; // First is Category

    fireEvent.mouseDown(categorySelect);
    const listbox = screen.getByRole('listbox');
    const option = within(listbox).getByText('Food');
    fireEvent.click(option);

    expect(categorySelect).toHaveTextContent('Food');
  });

  it('allows selecting Availability', () => {
    render(<SearchFilters />);
    const comboboxes = screen.getAllByRole('combobox');
    const availabilitySelect = comboboxes[1]; // Second is Availability

    fireEvent.mouseDown(availabilitySelect);
    const listbox = screen.getByRole('listbox');
    const option = within(listbox).getByText('Available');
    fireEvent.click(option);

    expect(availabilitySelect).toHaveTextContent('Available');
  });

it('calls setSearchFilters and toggleSearchTriggered on Search', async () => {
  render(<SearchFilters />);
  const searchButton = screen.getByRole('button', { name: /search/i });
  fireEvent.click(searchButton);

  await waitFor(() => {
    expect(mockSetSearchFilters).toHaveBeenCalled();
    expect(mockToggleSearchTriggered).toHaveBeenCalled();
  });
});



  it('calls clearSearchFilters and resets fields on Clear', async () => {
    render(<SearchFilters />);
    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);


    expect(mockClearSearchFilters).toHaveBeenCalled();
    expect(mockToggleSearchTriggered).toHaveBeenCalled();
  });
});
