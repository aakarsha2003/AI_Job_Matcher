import React, { createContext, useContext, useState } from "react";

interface FilterState {
  search: string;
  location: string;
  type: string;
  workMode: string;
  skills: string;
  minMatchScore: number;
}

interface FilterContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  updateFilter: (key: keyof FilterState, value: any) => void;
}

const defaultFilters: FilterState = {
  search: "",
  location: "",
  type: "",
  workMode: "",
  skills: "",
  minMatchScore: 0,
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const resetFilters = () => setFilters(defaultFilters);
  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters, resetFilters, updateFilter }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (!context) throw new Error("useFilterContext must be used within FilterProvider");
  return context;
}
