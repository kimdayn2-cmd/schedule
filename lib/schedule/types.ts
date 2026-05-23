export type ScheduleEvent = {
  id: string
  date: string
  dayLabel: string
  time: string
  isAllDay: boolean
  title: string
  department: string
  completed: boolean
  notes: string
}

export type ScheduleStats = {
  total: number
  completed: number
  pending: number
  todayCount: number
}

export type ScheduleFilterStatus = "all" | "completed" | "pending"

export type ScheduleFilters = {
  department: string
  status: ScheduleFilterStatus
  search: string
}

export type SchedulePayload = {
  events: ScheduleEvent[]
  stats: ScheduleStats
  fetchedAt: string
  source: "sheet" | "sample"
  error?: string
}
