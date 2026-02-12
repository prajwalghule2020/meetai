"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchOneAgent } from "../../server/actions";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { Agent } from "../components/columns";

interface AgentIdViewProps {
  agentId: string;
}

export const AgentIdView = ({ agentId }: AgentIdViewProps) => {
  const [data, setData] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadAgent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const agent = await fetchOneAgent(agentId);
      setData(agent);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch agent"));
    } finally {
      setIsLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    loadAgent();
  }, [loadAgent]);

  if (isLoading) {
    return <LoadingState title="Loading agent" description="This may take a moment" />;
  }

  if (error) {
    return <ErrorState title="Error loading agent" description={error.message} />;
  }

  return (
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
      <AgentIdViewHeader
      agentId = {agentId}
      agentName = {data.name}
      onEdit={()=>{}}
      onRemove = {()=>{}} 
      />
      <div className="bg-white rounded-lg border">
        <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
          <div className="flex items-center gap-x-3">
            <GeneratedAvatar
              variant="botttsNeutral"
              seed={data.name}
              className="size-10"
            />
            <h2 className="text-2xl font-medium">{data.name}</h2>
          </div>
          <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4 w-fit">
            <VideoIcon className="text-blue-700" />
            {data.meetingCount} {data.meetingCount === 1 ? "meeting" : "meetings"}
          </Badge>
          <div className="flex flex-col  gap-y-4">
             <p className="text-lg font-medium">Instructions</p>
             <p className="text-neutral-800">{data?.instructions}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
