"use client"

import { format, parseISO } from "date-fns"
import { ko } from "date-fns/locale"
import * as React from "react"
import type { DayButton } from "react-day-picker"

import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
  getDatesWithPending,
  getEventCountByDate,
} from "@/lib/schedule/queries"
import type { ScheduleEvent } from "@/lib/schedule/types"

const DECEMBER_2025 = new Date(2025, 11, 1)

type MonthCalendarProps = {
  events: ScheduleEvent[]
  selectedDate: string
  onSelectDate: (date: string) => void
}

function ScheduleDayButton({
  eventCounts,
  pendingDates,
  onDateSelect,
  ...props
}: React.ComponentProps<typeof DayButton> & {
  eventCounts: Record<string, number>
  pendingDates: Set<string>
  onDateSelect: (dateKey: string) => void
}) {
  const dateKey = format(props.day.date, "yyyy-MM-dd")
  const count = eventCounts[dateKey] ?? 0
  const hasPending = pendingDates.has(dateKey)

  return (
    <CalendarDayButton
      {...props}
      locale={ko}
      onClick={(event) => {
        props.onClick?.(event)
        onDateSelect(dateKey)
      }}
    >
      <span>{props.day.date.getDate()}</span>
      {count > 0 && (
        <span
          className={cn(
            "absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center justify-center",
            count === 1
              ? "size-1.5 rounded-full bg-primary"
              : "min-w-[14px] rounded-full bg-primary px-1 text-[9px] font-medium text-primary-foreground"
          )}
        >
          {count > 1 ? count : null}
        </span>
      )}
      {hasPending && count > 0 && (
        <span className="absolute top-1 right-1 size-1.5 rounded-full bg-amber-500" />
      )}
    </CalendarDayButton>
  )
}

export function MonthCalendar({
  events,
  selectedDate,
  onSelectDate,
}: MonthCalendarProps) {
  const eventCounts = React.useMemo(() => getEventCountByDate(events), [events])
  const pendingDates = React.useMemo(() => getDatesWithPending(events), [events])
  const selected = parseISO(selectedDate)

  const eventDates = React.useMemo(
    () => Object.keys(eventCounts).map((d) => parseISO(d)),
    [eventCounts]
  )

  return (
    <Calendar
      locale={ko}
      mode="single"
      month={DECEMBER_2025}
      defaultMonth={DECEMBER_2025}
      selected={selected}
      onSelect={(date) => {
        if (date) onSelectDate(format(date, "yyyy-MM-dd"))
      }}
      disabled={(date) => date.getMonth() !== 11 || date.getFullYear() !== 2025}
      showOutsideDays={false}
      className="mx-auto w-full max-w-md"
      modifiers={{
        hasEvents: eventDates,
        weekend: (date) => {
          const day = date.getDay()
          return day === 0 || day === 6
        },
      }}
      modifiersClassNames={{
        weekend: "bg-muted/40",
        hasEvents: "font-semibold",
      }}
      components={{
        DayButton: (dayProps) => (
          <ScheduleDayButton
            {...dayProps}
            eventCounts={eventCounts}
            pendingDates={pendingDates}
            onDateSelect={onSelectDate}
          />
        ),
      }}
    />
  )
}
