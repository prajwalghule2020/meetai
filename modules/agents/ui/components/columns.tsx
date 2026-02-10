"use client"

import { GeneratedAvatar } from "@/components/generated-avatar"
import { Badge } from "@/components/ui/badge"
import { CornerDownRightIcon, VideoIcon } from "lucide-react"

export interface Agent {
  id: string
  name: string
  userId: string
  instructions: string
  createdAt: Date
  updatedAt: Date
  meetingCount: number
}

export interface Column<T> {
  key: keyof T | "actions"
  header: string
  render?: (item: T) => React.ReactNode
  className?: string
}

export const columns: Column<Agent>[] = [
  {
    key: "name",
    header: "Agent Name",
    render: (agent) => (
      <div className="flex flex-col gap-y-1">
        <div className="flex items-center gap-x-2">
          <GeneratedAvatar
            variant="botttsNeutral"
            seed={agent.name}
            className="size-6"
          />
          <span className="font-semibold capitalize">{agent.name}</span>
        </div>
        <div className="flex items-center gap-x-2">
          <CornerDownRightIcon className="size-3 text-muted-foreground" />
          <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
            {agent.instructions}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "meetingCount" as keyof Agent,
    header: "Meetings",
    render: (agent) => (
      <Badge
        variant="outline"
        className="flex items-center gap-x-2 [&>svg]:size-4"
      >
        <VideoIcon className="text-blue-700" />
        {agent.meetingCount} {agent.meetingCount === 1 ? "meeting" : "meetings"}
      </Badge>
    ),
  },
]