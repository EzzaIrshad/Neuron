import { create } from "zustand";

interface TableFilterStore {
    search: string;
    setSearch: (search: string) => void;
}

export const useTableFilterStore = create<TableFilterStore>((set) => ({
    search: "",
    setSearch: (search: string) => set({ search }),
}));