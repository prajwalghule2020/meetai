"use server";

import { getAgent } from "./procedure";

export async function fetchAgents() {
  return await getAgent();
}
