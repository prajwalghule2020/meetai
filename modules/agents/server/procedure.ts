import { db } from "@/db";
import { agents } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { agentInsertSchema } from "../schema";
import { z } from "zod";
import { eq, and, getTableColumns, sql, ilike, count, desc } from "drizzle-orm";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "../constants";

export const protectedProcedure = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return { auth: session };
};

const getManyAgentSchema = z.object({
  page: z.number().optional().default(DEFAULT_PAGE),
  pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).optional().default(DEFAULT_PAGE_SIZE),
  search: z.string().nullish(),
});

export const getManyAgent = async (input?: z.input<typeof getManyAgentSchema>) => {
  const ctx = await protectedProcedure();
  const { page, pageSize, search } = getManyAgentSchema.parse(input ?? {});

  const whereCondition = and(
    eq(agents.userId, ctx.auth.user.id),
    search ? ilike(agents.name, `%${search}%`) : undefined,
  );

  // Run both queries in parallel to reduce connection time
  const [data, [total]] = await Promise.all([
    db
      .select({
        ...getTableColumns(agents),
        meetingCount: sql<number>`5`,
      })
      .from(agents)
      .where(whereCondition)
      .orderBy(desc(agents.createdAt), desc(agents.id))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db
      .select({ count: count() })
      .from(agents)
      .where(whereCondition),
  ]);

  const totalPages = Math.ceil(total.count / pageSize);

  return {
    items: data,
    total: total.count,
    totalPages,
  };
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