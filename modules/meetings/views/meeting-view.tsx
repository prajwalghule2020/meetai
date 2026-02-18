"use client"

import { DataTable } from "@/components/data-table";
import { fetchMeetings } from "../server/actions";
import { columns } from "../ui/components/columns";
import { EmptyState } from "@/components/empty-state";

type MeetingsData = Awaited<ReturnType<typeof fetchMeetings>>;

interface MeetingsViewProps {
    initialData: MeetingsData;
}

export const MeetingsView = ({ initialData }: MeetingsViewProps) => {
    const isEmpty = !initialData.items || initialData.items.length === 0;
    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            {isEmpty ? (
                <EmptyState
                    title="Create your first meeting"
                    description="Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas, and interact with participants in real time."
                />
            ) : (
                <DataTable columns={columns} data={initialData.items} />
            )}
        </div>
    )
}