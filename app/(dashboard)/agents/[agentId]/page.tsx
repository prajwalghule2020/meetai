import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { fetchOneAgent } from "@/modules/agents/server/actions";
import { AgentIdView } from "@/modules/agents/ui/views/agent-id-view";

interface Props {
  params: Promise<{ agentId: string }>;
}

const Page = async ({ params }: Props) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { agentId } = await params;

  const agent = await fetchOneAgent(agentId);

  if (!agent) {
    notFound();
  }

  return <AgentIdView agentId={agentId} />;
};

export default Page;
