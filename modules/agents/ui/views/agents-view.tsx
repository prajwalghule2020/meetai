"use client"

import { DataTable } from "../components/data-table"
import { columns, Agent } from "../components/columns"
import { EmptyState } from "@/components/empty-state"

interface AgentsViewProps {
  data: Agent[];
}

export const AgentsView = ({ data }: AgentsViewProps) => {
  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable data={data} columns={columns} />
      {data.length === 0 && (
        <EmptyState
          title="Create your first agent"
          description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call."
        />
      )}
    </div>
  );
};
