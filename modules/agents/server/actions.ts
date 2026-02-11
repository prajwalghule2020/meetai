"use server";

import { getManyAgent, createAgent, getOneAgent } from "./procedure";
import { agentInsertSchema } from "../schema";
import { z } from "zod";

interface FetchAgentsParams {
  page?: number;
  pageSize?: number;
  search?: string | null;
}

export async function fetchAgents(params?: FetchAgentsParams) {
  return await getManyAgent(params);
}

export async function createAgentAction(input: z.infer<typeof agentInsertSchema>) {
  return await createAgent(input);
}

export async function fetchOneAgent(id: string) {
  return await getOneAgent({ id });
}
