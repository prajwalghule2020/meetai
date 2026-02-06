"use server";

import { getManyAgent, createAgent, getOneAgent } from "./procedure";
import { agentInsertSchema } from "../schema";
import { z } from "zod";

export async function fetchAgents() {
  return await getManyAgent();
}

export async function createAgentAction(input: z.infer<typeof agentInsertSchema>) {
  return await createAgent(input);
}

export async function fetchOneAgent(id: string) {
  return await getOneAgent({ id });
}
