"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { DataTable } from "../components/data-table"
import { columns, Agent } from "../components/columns"
import { EmptyState } from "@/components/empty-state"
import { LoadingState } from "@/components/loading-state"
import { DataPagination } from "../components/data-pagination"
import { useAgentsFilters } from "../../hooks/use-agents-filters"
import { fetchAgents } from "../../server/actions"

export const AgentsView = () => {
  const [filters , setFilters] = useAgentsFilters();
  const [data, setData] = useState<Agent[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadData = useCallback(async (search: string, page: number) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    try {
      const result = await fetchAgents({
        search: search || undefined,
        page,
      });
      setData(result.items);
      setTotalPages(result.totalPages);
    } catch (error) {
      // Ignore abort errors
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Failed to fetch agents:', error);
      }
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    loadData(filters.search, filters.page);
  }, [filters.search, filters.page, loadData]);

  if (isInitialLoad) {
    return <LoadingState title="Loading agents" description="This may take a moment" />;
  }

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable data={data} columns={columns} />
      <DataPagination
        page={filters.page}
        totalPages={totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
      {!isLoading && data.length === 0 && (
        <EmptyState
          title="Create your first agent"
          description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call."
        />
      )}
    </div>
  );
};
