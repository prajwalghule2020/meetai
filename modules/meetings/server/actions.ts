"use server";

import { getManyMeeting, getOneMeeting, createMeeting } from "./procedure";
import { meetingInsertSchema } from "../schema";
import { z } from "zod";

interface FetchMeetingsParams {
  page?: number;
  pageSize?: number;
}

export type MeetingGetMany = Awaited<ReturnType<typeof fetchMeetings>>["items"];

export async function fetchMeetings(params?: FetchMeetingsParams) {
  return await getManyMeeting(params);
}

export async function fetchOneMeeting(id: string) {
  return await getOneMeeting({ id });
}

export async function createMeetingAction(
  input: z.infer<typeof meetingInsertSchema>,
) {
  return await createMeeting(input);
}
