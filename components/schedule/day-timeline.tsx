"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getDepartmentColorClass } from "@/lib/schedule/department-colors"
import { formatEventDateLabel } from "@/lib/schedule/queries"
import type { ScheduleEvent } from "@/lib/schedule/types"
import { cn } from "@/lib/utils"

type DayTimelineProps = {
  date: string
  events: ScheduleEvent[]
  onSelectEvent: (event: ScheduleEvent) => void
}

export function DayTimeline({ date, events, onSelectEvent }: DayTimelineProps) {
  const panelRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [date])

  if (events.length === 0) {
    return (
      <Card ref={panelRef} id="day-schedule-panel">
        <CardHeader>
          <CardTitle className="text-base">주요 일정/내용</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {formatEventDateLabel(date)} — 등록된 일정이 없습니다.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card ref={panelRef} id="day-schedule-panel" className="scroll-mt-4">
      <CardHeader className="gap-1 pb-3">
        <p className="text-xs font-medium text-muted-foreground">선택한 날짜</p>
        <CardTitle className="text-lg">
          {formatEventDateLabel(date, events[0]?.dayLabel)}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{events.length}건의 일정</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="mb-3 text-sm font-semibold">주요 일정/내용</h4>
          <ol className="space-y-3">
            {events.map((event, index) => (
              <li key={event.id}>
                <button
                  type="button"
                  onClick={() => onSelectEvent(event)}
                  className={cn(
                    "w-full rounded-lg border bg-background p-4 text-left transition-colors hover:bg-muted/50",
                    !event.completed && "border-l-4 border-l-primary"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold tabular-nums">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1 space-y-2">
                      <p className="text-base leading-snug font-semibold">
                        {event.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium tabular-nums">
                          {event.isAllDay ? "종일" : event.time}
                        </span>
                        <span aria-hidden>·</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px]",
                            getDepartmentColorClass(event.department)
                          )}
                        >
                          {event.department}
                        </Badge>
                        <Badge
                          variant={event.completed ? "secondary" : "outline"}
                          className="text-[10px]"
                        >
                          {event.completed ? "완료" : "미완료"}
                        </Badge>
                      </div>
                      {event.notes && (
                        <p className="text-sm text-muted-foreground">{event.notes}</p>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <Separator />
        <p className="text-xs text-muted-foreground">
          항목을 클릭하면 상세 정보를 볼 수 있습니다.
        </p>
      </CardContent>
    </Card>
  )
}
