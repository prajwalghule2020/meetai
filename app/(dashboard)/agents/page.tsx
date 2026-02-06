import { AgentsView } from "@/modules/agents/ui/views/agents-view";
import { fetchAgents } from "@/modules/agents/server/actions";
import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Pages() {
  
   const session = await auth.api.getSession({
        headers : await headers(),
    });
  
    if(!session){
      redirect("/sign-in");
    }

  const agents = await fetchAgents();

  return(
  <>
  <AgentsListHeader/>
  <AgentsView agents={agents} />
  </> 
  

);
}