"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

import { useAgentsFilters } from "../../hooks/use-agents-filters";

export const AgentsSearchFilter = () => {
  const [filters, setFilters] = useAgentsFilters();
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Sync local state when URL changes (e.g., clear button)
  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  // Debounce the search to prevent overwhelming the database
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        setFilters({ search: localSearch });
      }
    }, 40);

    return () => clearTimeout(timer);
  }, [localSearch, filters.search, setFilters]);

  return (
    <div className="relative">
      <Input
        placeholder="Filter by name"
        className="h-9 bg-white w-50 pl-7"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
      />
      <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
};
