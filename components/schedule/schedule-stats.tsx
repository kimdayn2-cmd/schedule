"use client"

import { CalendarDays, CheckCircle2, CircleDashed, Sun } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ScheduleStats } from "@/lib/schedule/types"

type ScheduleStatsCardsProps = {
  stats: ScheduleStats
}

const items = [
  {
    key: "total",
    label: "전체 일정",
    icon: CalendarDays,
    getValue: (s: ScheduleStats) => s.total,
  },
  {
    key: "completed",
    label: "완료",
    icon: CheckCircle2,
    getValue: (s: ScheduleStats) => s.completed,
  },
  {
    key: "pending",
    label: "미완료",
    icon: CircleDashed,
    getValue: (s: ScheduleStats) => s.pending,
  },
  {
    key: "today",
    label: "오늘 일정",
    icon: Sun,
    getValue: (s: ScheduleStats) => s.todayCount,
  },
] as const

export function ScheduleStatsCards({ stats }: ScheduleStatsCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.key} size="sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.label}
            </CardTitle>
            <item.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">
              {item.getValue(stats)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
