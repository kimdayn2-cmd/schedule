import {
  format,
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfWeek,
  endOfWeek,
} from "date-fns"
import { ko } from "date-fns/locale"

import type {
  ScheduleEvent,
  ScheduleFilters,
  ScheduleStats,
} from "./types"
import { sortEvents } from "./parse-csv"

export function getUniqueDepartments(events: ScheduleEvent[]): string[] {
  const departments = new Set(
    events.map((e) => e.department).filter((d) => d && d !== "—")
  )
  return Array.from(departments).sort((a, b) => a.localeCompare(b, "ko"))
}

export function filterEvents(
  events: ScheduleEvent[],
  filters: ScheduleFilters
): ScheduleEvent[] {
  const search = filters.search.trim().toLowerCase()

  return events.filter((event) => {
    if (filters.department !== "all" && event.department !== filters.department) {
      return false
    }
    if (filters.status === "completed" && !event.completed) return false
    if (filters.status === "pending" && event.completed) return false
    if (search) {
      const haystack = `${event.title} ${event.notes} ${event.department}`.toLowerCase()
      if (!haystack.includes(search)) return false
    }
    return true
  })
}

export function getStats(events: ScheduleEvent[], reference = new Date()): ScheduleStats {
  const todayKey = format(reference, "yyyy-MM-dd")
  let completed = 0
  let todayCount = 0

  for (const event of events) {
    if (event.completed) completed += 1
    if (event.date === todayKey) todayCount += 1
  }

  return {
    total: events.length,
    completed,
    pending: events.length - completed,
    todayCount,
  }
}

export function getEventsByDate(
  events: ScheduleEvent[]
): Map<string, ScheduleEvent[]> {
  const map = new Map<string, ScheduleEvent[]>()
  for (const event of sortEvents(events)) {
    const list = map.get(event.date) ?? []
    list.push(event)
    map.set(event.date, list)
  }
  return map
}

export function getEventCountByDate(events: ScheduleEvent[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const event of events) {
    counts[event.date] = (counts[event.date] ?? 0) + 1
  }
  return counts
}

export function getDatesWithPending(events: ScheduleEvent[]): Set<string> {
  const dates = new Set<string>()
  for (const event of events) {
    if (!event.completed) dates.add(event.date)
  }
  return dates
}

export function getUpcoming(
  events: ScheduleEvent[],
  from: Date = new Date(),
  limit = 3
): ScheduleEvent[] {
  const fromKey = format(from, "yyyy-MM-dd")
  return sortEvents(events)
    .filter((e) => e.date >= fromKey && !e.completed)
    .slice(0, limit)
}

export function formatEventDateLabel(dateIso: string, dayLabel?: string): string {
  const date = parseISO(dateIso)
  const base = format(date, "M월 d일 EEEE", { locale: ko })
  if (dayLabel && !base.includes(dayLabel.replace("요일", ""))) {
    return `${format(date, "M월 d일", { locale: ko })} ${dayLabel}`
  }
  return base
}

export function formatFetchedAt(iso: string): string {
  return format(new Date(iso), "yyyy.MM.dd HH:mm", { locale: ko })
}

export function isWeekendDate(dateIso: string): boolean {
  const day = parseISO(dateIso).getDay()
  return day === 0 || day === 6
}

export function isInCurrentWeek(dateIso: string, reference = new Date()): boolean {
  const date = parseISO(dateIso)
  const start = startOfWeek(reference, { weekStartsOn: 1 })
  const end = endOfWeek(reference, { weekStartsOn: 1 })
  return isWithinInterval(date, { start, end })
}

export function isToday(dateIso: string, reference = new Date()): boolean {
  return isSameDay(parseISO(dateIso), reference)
}
