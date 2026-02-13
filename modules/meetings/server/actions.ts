"use server";

import { getManyMeeting, getOneMeeting } from "./procedure";

interface FetchMeetingsParams {
  page?: number;
  pageSize?: number;
}

export async function fetchMeetings(params?: FetchMeetingsParams) {
  return await getManyMeeting(params);
}

export async function fetchOneMeeting(id: string) {
  return await getOneMeeting({ id });
}
