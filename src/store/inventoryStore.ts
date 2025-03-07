import { create} from "zustand";

interface InventoryItem {
    category: string;
    name: string;
    price: number;
    expiration: string;
    stock: number;
    checked: boolean;
}

interface InventoryState {
    inventoryData: InventoryItem[];
    sortInventory: (field: keyof InventoryItem) => void;
    toggleStock: (Index: number) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
    inventoryData: [
        {
            category:"Food",
            name: "Watermelon",
            price: 1.50,
            expiration: "2025-03-07",
            stock: 4,
            checked: false,
        },
        {
            category:"Food",
            name: "Milk",
            price: 1.50,
            expiration: "2025-03-25",
            stock: 7,
            checked: false,
        },
        {
            category:"Electronics",
            name: "Samsung TV",
            price: 900.00,
            expiration: "",
            stock: 10,
            checked: false,
        },
        {
            category:"Food",
            name: "Sushi",
            price: 8.00,
            expiration: "2025-03-15",
            stock: 7,
            checked: false,
        },
        {
            category:"Food",
            name: "Quesadilla",
            price: 3.00,
            expiration: "2025-03-25",
            stock: 7,
            checked: false,
        },
        {
            category:"Food",
            name: "Torta de Tamal",
            price: 5.00,
            expiration: "2025-03-10",
            stock: 7,
            checked: false,
        },
    ],

    sortInventory: (field) =>
        set((state) => ({
            inventoryData:[...state.inventoryData].sort((a, b) => {
                if (typeof a[field] === "number" && typeof b[field] === "number") {
                    return a[field] as number - (b[field] as number);
                }
                return String(a[field]).localeCompare(String(b[field]));
            }),
        })),

        toggleStock: (index) =>
            set((state) => ({
                inventoryData: state.inventoryData.map((item, i) =>
                    i === index ? { ...item, checked: !item.checked, stock: !item.checked ? 0: 10 } : item 
            ),
            })),
            }));