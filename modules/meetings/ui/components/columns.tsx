"use client"

import { GeneratedAvatar } from "@/components/generated-avatar"
import { Badge } from "@/components/ui/badge"
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  ClockFadingIcon,
  CornerDownRightIcon,
  LoaderIcon,
} from "lucide-react"
import { format } from "date-fns"
import humanizeDuration from "humanize-duration"
import { cn } from "@/lib/utils"
import { MeetingGetMany } from "../../server/actions"

function formatDuration(seconds: number) {
  return humanizeDuration(seconds * 1000, {
    largest: 1,
    round: true,
    units: ["h", "m", "s"],
  })
}

const statusIconMap = {
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  cancelled: CircleXIcon,
}

const statusColorMap = {
  upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
  active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
  completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
  cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5",
  processing: "bg-gray-300/20 text-gray-800 border-gray-800/5",
}

export interface Column<T> {
  key: keyof T | "actions"
  header: string
  render?: (item: T) => React.ReactNode
  className?: string
}

export const columns: Column<MeetingGetMany[number]>[] = [
  {
    key: "name",
    header: "Meeting Name",
    render: (meeting) => (
      <div className="flex flex-col gap-y-1">
        <span className="font-semibold capitalize">{meeting.name}</span>
        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-1">
            <CornerDownRightIcon className="size-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
              {meeting.agent.name}
            </span>
          </div>
          <GeneratedAvatar
            variant="botttsNeutral"
            seed={meeting.agent.name}
            className="size-4"
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {meeting.startedAt ? format(meeting.startedAt, "MMM d") : ""}
        </span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (meeting) => {
      const Icon = statusIconMap[meeting.status as keyof typeof statusIconMap]

      return (
        <Badge
          variant="outline"
          className={cn(
            "capitalize [&>svg]:size-4 text-muted-foreground",
            statusColorMap[meeting.status as keyof typeof statusColorMap]
          )}
        >
          <Icon
            className={cn(
              meeting.status === "processing" && "animate-spin"
            )}
          />
          {meeting.status}
        </Badge>
      )
    },
  },
  {
    key: "duration",
    header: "duration",
    render: (meeting) => (
      <Badge
        variant="outline"
        className="capitalize [&>svg]:size-4 flex items-center gap-x-2"
      >
        <ClockFadingIcon className="text-blue-700" />
        {meeting.duration ? formatDuration(meeting.duration) : "No duration"}
      </Badge>
    ),
  },
]