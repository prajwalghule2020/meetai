"use client"

import { fetchMeetings } from "../server/actions";

type MeetingsData = Awaited<ReturnType<typeof fetchMeetings>>;

interface MeetingsViewProps {
    initialData: MeetingsData;
}

export const MeetingsView = ({ initialData }: MeetingsViewProps) => {

    return (
        <div>
            <pre>{JSON.stringify(initialData, null, 2)}</pre>
        </div>
    )
}