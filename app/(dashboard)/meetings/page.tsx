import { MeetingsView } from "@/modules/meetings/views/meeting-view";
import { MeetingsListHeader } from "@/modules/meetings/ui/components/meetings-list-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { fetchMeetings } from "@/modules/meetings/server/actions";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const initialData = await fetchMeetings();

  return (
    <>
      <MeetingsListHeader />
      <MeetingsView initialData={initialData} />
    </>
  );
}