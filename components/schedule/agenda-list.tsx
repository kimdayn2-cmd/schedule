"use client"

import { differenceInCalendarDays, format, parseISO } from "date-fns"
import { ko } from "date-fns/locale"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getDepartmentColorClass } from "@/lib/schedule/department-colors"
import { getEventsByDate, isWeekendDate } from "@/lib/schedule/queries"
import type { ScheduleEvent } from "@/lib/schedule/types"
import { cn } from "@/lib/utils"

type AgendaListProps = {
  events: ScheduleEvent[]
  onSelectEvent: (event: ScheduleEvent) => void
  referenceDate?: Date
}

function formatDday(dateIso: string, reference: Date): string | null {
  const target = parseISO(dateIso)
  const diff = differenceInCalendarDays(target, reference)
  if (diff === 0) return "오늘"
  if (diff > 0) return `D-${diff}`
  return `D+${Math.abs(diff)}`
}

export function AgendaList({
  events,
  onSelectEvent,
  referenceDate = new Date(),
}: AgendaListProps) {
  const byDate = getEventsByDate(events)
  const sortedDates = Array.from(byDate.keys()).sort()

  if (sortedDates.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
        필터 조건에 맞는 일정이 없습니다.
      </div>
    )
  }

  return (
    <ScrollArea className="h-[min(70vh,640px)] pr-4">
      <div className="space-y-8">
        {sortedDates.map((dateKey) => {
          const dayEvents = byDate.get(dateKey) ?? []
          const dday = formatDday(dateKey, referenceDate)
          const dateLabel = format(parseISO(dateKey), "M월 d일 EEEE", {
            locale: ko,
          })

          return (
            <section key={dateKey}>
              <div
                className={cn(
                  "sticky top-0 z-10 -mx-1 mb-3 flex items-center justify-between gap-2 border-b bg-background/95 px-1 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80",
                  isWeekendDate(dateKey) && "text-muted-foreground"
                )}
              >
                <h3 className="text-sm font-semibold">{dateLabel}</h3>
                {dday && (
                  <Badge variant="outline" className="text-[10px]">
                    {dday}
                  </Badge>
                )}
              </div>
              <ul className="space-y-2">
                {dayEvents.map((event) => (
                  <li key={event.id}>
                    <button
                      type="button"
                      onClick={() => onSelectEvent(event)}
                      className={cn(
                        "flex w-full flex-col gap-2 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:gap-4",
                        !event.completed && "border-l-2 border-l-primary"
                      )}
                    >
                      <span className="w-14 shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                        {event.isAllDay ? "종일" : event.time}
                      </span>
                      <span className="min-w-0 flex-1 font-medium leading-snug">
                        {event.title}
                      </span>
                      <div className="flex shrink-0 flex-wrap items-center gap-2">
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
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </ScrollArea>
  )
}
