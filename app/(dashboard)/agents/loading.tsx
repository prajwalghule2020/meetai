import { LoadingState } from "@/components/loading-state";
import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";

export default function Loading() {
  return (
    <>
      <AgentsListHeader />
      <LoadingState
        title="Loading Agents"
        description="This may take few seconds"
      />
    </>
  );
}
