"use client"
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";

interface Agent {
  id: string;
  name: string;
  userId: string;
  instructions: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AgentsViewProps {
  agents: Agent[];
}

export const AgentsView = ({ agents }: AgentsViewProps) => {
  return (
    <div>
         <pre>{JSON.stringify(agents, null, 2)}</pre>
    </div>
  );
};
