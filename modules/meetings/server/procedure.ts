import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { eq, and, getTableColumns, count, desc } from "drizzle-orm";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "../constants";

const protectedProcedure = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return { auth: session };
};

const getManyMeetingSchema = z.object({
  page: z.number().optional().default(DEFAULT_PAGE),
  pageSize: z
    .number()
    .min(MIN_PAGE_SIZE)
    .max(MAX_PAGE_SIZE)
    .optional()
    .default(DEFAULT_PAGE_SIZE),
});

export const getManyMeeting = async (
  input?: z.input<typeof getManyMeetingSchema>,
) => {
  const ctx = await protectedProcedure();
  const { page, pageSize } = getManyMeetingSchema.parse(input ?? {});

  const whereCondition = eq(meetings.userId, ctx.auth.user.id);

  const [data, [total]] = await Promise.all([
    db
      .select({
        ...getTableColumns(meetings),
        agent: agents,
      })
      .from(meetings)
      .innerJoin(agents, eq(meetings.agentId, agents.id))
      .where(whereCondition)
      .orderBy(desc(meetings.createdAt), desc(meetings.id))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ count: count() }).from(meetings).where(whereCondition),
  ]);

  const totalPages = Math.ceil(total.count / pageSize);

  return {
    items: data,
    total: total.count,
    totalPages,
  };
};

const getOneMeetingSchema = z.object({
  id: z.string().min(1, { message: "Meeting ID is required" }),
});

export const getOneMeeting = async (
  input: z.infer<typeof getOneMeetingSchema>,
) => {
  const ctx = await protectedProcedure();
  const { id } = getOneMeetingSchema.parse(input);

  const [existingMeeting] = await db
    .select({
      ...getTableColumns(meetings),
      agent: agents,
    })
    .from(meetings)
    .innerJoin(agents, eq(meetings.agentId, agents.id))
    .where(and(eq(meetings.id, id), eq(meetings.userId, ctx.auth.user.id)));

  if (!existingMeeting) {
    throw new Error("NOT_FOUND");
  }

  return existingMeeting;
};
