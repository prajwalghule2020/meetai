import { AgentsView } from "@/modules/agents/ui/views/agents-view";
import { fetchAgents } from "@/modules/agents/server/actions";

export default async function Pages() {
  const agents = await fetchAgents();

  return <AgentsView agents={agents} />;
}