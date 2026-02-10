import { db } from "@/db";
import { agents } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { agentInsertSchema } from "../schema";
import { z } from "zod";
import { eq, and, getTableColumns, sql } from "drizzle-orm";

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
  const ctx = await protectedProcedure();
  const data = await db
    .select({
      ...getTableColumns(agents),
      meetingCount: sql<number>`5`,
    })
    .from(agents)
    .where(eq(agents.userId, ctx.auth.user.id));
  return data;
};

const getOneAgentSchema = z.object({
  id: z.string().min(1, { message: "Agent ID is required" }),
});

export const getOneAgent = async (input: z.infer<typeof getOneAgentSchema>) => {
  const ctx = await protectedProcedure();
  const { id } = getOneAgentSchema.parse(input);
  const [existingAgent] = await db
    .select({
      ...getTableColumns(agents),
      meetingCount: sql<number>`5`,
    })
    .from(agents)
    .where(and(eq(agents.id, id), eq(agents.userId, ctx.auth.user.id)));

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