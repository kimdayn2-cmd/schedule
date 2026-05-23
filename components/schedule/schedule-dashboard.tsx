"use client"

import { format, parseISO } from "date-fns"
import { AlertCircle, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import { AgendaList } from "@/components/schedule/agenda-list"
import { DayTimeline } from "@/components/schedule/day-timeline"
import { EventDetailSheet } from "@/components/schedule/event-detail-sheet"
import { MonthCalendar } from "@/components/schedule/month-calendar"
import { ScheduleFiltersBar } from "@/components/schedule/schedule-filters"
import { ScheduleStatsCards } from "@/components/schedule/schedule-stats"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  filterEvents,
  formatFetchedAt,
  getStats,
  getUniqueDepartments,
  getUpcoming,
} from "@/lib/schedule/queries"
import type { ScheduleEvent, ScheduleFilters, SchedulePayload } from "@/lib/schedule/types"
import { cn } from "@/lib/utils"

const DEFAULT_DATE = "2025-12-01"

type ScheduleDashboardProps = {
  initialData: SchedulePayload
}

export function ScheduleDashboard({ initialData }: ScheduleDashboardProps) {
  const router = useRouter()
  const [data, setData] = React.useState(initialData)
  const [refreshing, setRefreshing] = React.useState(false)
  const [filters, setFilters] = React.useState<ScheduleFilters>({
    department: "all",
    status: "all",
    search: "",
  })
  const [selectedDate, setSelectedDate] = React.useState(DEFAULT_DATE)
  const [detailEvent, setDetailEvent] = React.useState<ScheduleEvent | null>(null)
  const [sheetOpen, setSheetOpen] = React.useState(false)

  const filteredEvents = React.useMemo(
    () => filterEvents(data.events, filters),
    [data.events, filters]
  )

  const filteredStats = React.useMemo(
    () => getStats(filteredEvents),
    [filteredEvents]
  )

  const departments = React.useMemo(
    () => getUniqueDepartments(data.events),
    [data.events]
  )

  const eventsOnSelectedDay = React.useMemo(
    () => filteredEvents.filter((e) => e.date === selectedDate),
    [filteredEvents, selectedDate]
  )

  const upcoming = React.useMemo(
    () => getUpcoming(filteredEvents, new Date(), 3),
    [filteredEvents]
  )

  const handleSelectEvent = (event: ScheduleEvent) => {
    setDetailEvent(event)
    setSheetOpen(true)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const res = await fetch("/api/schedule")
      if (res.ok) {
        const json = (await res.json()) as SchedulePayload
        setData(json)
      }
    } finally {
      setRefreshing(false)
      router.refresh()
    }
  }

  React.useEffect(() => {
    const stillVisible = filteredEvents.some((e) => e.date === selectedDate)
    if (!stillVisible && filteredEvents.length > 0) {
      setSelectedDate(filteredEvents[0].date)
    }
  }, [filteredEvents, selectedDate])

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-6 p-4 pb-10 sm:p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Golden Rabbit
          </p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            2025년 12월 일정
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            마지막 갱신 {formatFetchedAt(data.fetchedAt)}
            {data.source === "sample" && " · 샘플 데이터"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="shrink-0"
        >
          <RefreshCw className={cn("size-4", refreshing && "animate-spin")} />
          새로고침
        </Button>
      </header>

      {data.error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p>{data.error}</p>
        </div>
      )}

      <ScheduleStatsCards stats={filteredStats} />

      {upcoming.length > 0 && (
        <div className="rounded-lg border bg-muted/30 px-4 py-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            다가오는 미완료 일정
          </p>
          <ul className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-3">
            {upcoming.map((event) => (
              <li key={event.id}>
                <button
                  type="button"
                  onClick={() => handleSelectEvent(event)}
                  className="text-left text-sm hover:underline"
                >
                  <span className="text-muted-foreground tabular-nums">
                    {format(parseISO(event.date), "M/d")}{" "}
                  </span>
                  {event.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ScheduleFiltersBar
        filters={filters}
        departments={departments}
        onChange={setFilters}
      />

      <Tabs defaultValue="calendar" className="gap-4">
        <TabsList>
          <TabsTrigger value="calendar">캘린더</TabsTrigger>
          <TabsTrigger value="agenda">목록</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border bg-card p-4">
              <MonthCalendar
                events={filteredEvents}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </div>
            <DayTimeline
              date={selectedDate}
              events={eventsOnSelectedDay}
              onSelectEvent={handleSelectEvent}
            />
          </div>
        </TabsContent>

        <TabsContent value="agenda">
          <AgendaList
            events={filteredEvents}
            onSelectEvent={handleSelectEvent}
          />
        </TabsContent>
      </Tabs>

      <EventDetailSheet
        event={detailEvent}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  )
}
