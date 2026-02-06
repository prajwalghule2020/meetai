import { db } from "@/db";
import { agents } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { agentInsertSchema } from "../schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const protectedProcedure = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return { auth: session };
};

export const getManyAgent = async () => {
  await protectedProcedure();
  const data = await db.select().from(agents);
  return data;
};

const getOneAgentSchema = z.object({ id: z.string() });

export const getOneAgent = async (input: z.infer<typeof getOneAgentSchema>) => {
  await protectedProcedure();
  const { id } = getOneAgentSchema.parse(input);
  const [existingAgent] = await db.select().from(agents).where(eq(agents.id, id));

  return existingAgent;
};

export const createAgent = async (input: z.infer<typeof agentInsertSchema>) => {
  const ctx = await protectedProcedure();
  const validatedInput = agentInsertSchema.parse(input);

  const [createdAgent] = await db
    .insert(agents)
    .values({
      ...validatedInput,
      userId: ctx.auth.user.id,
    })
    .returning();

  return createdAgent;
};