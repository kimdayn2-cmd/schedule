import Papa from "papaparse"

import type { ScheduleEvent } from "./types"

type CsvRow = Record<string, string>

function normalizeRowKeys(row: CsvRow): CsvRow {
  const normalized: CsvRow = {}
  for (const [key, value] of Object.entries(row)) {
    normalized[key.replace(/^\uFEFF/, "").trim()] = value
  }
  return normalized
}

function cell(row: CsvRow, header: string): string {
  return row[header] ?? ""
}

function parseCompleted(raw: string): boolean {
  const value = raw.trim().toUpperCase()
  return value === "TRUE" || value === "YES" || value === "완료"
}

export function parseKoreanDate(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  const match = trimmed.match(/(\d{4})\s*\.?\s*(\d{1,2})\s*\.?\s*(\d{1,2})/)
  if (!match) return null

  const year = match[1]
  const month = match[2].padStart(2, "0")
  const day = match[3].padStart(2, "0")
  return `${year}-${month}-${day}`
}

function makeEventId(date: string, time: string, title: string): string {
  const slug = `${date}|${time}|${title}`
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9가-힣|_-]/g, "")
  return slug.slice(0, 120)
}

function normalizeRow(row: CsvRow): ScheduleEvent | null {
  const r = normalizeRowKeys(row)
  const date = parseKoreanDate(cell(r, "날짜"))
  if (!date) return null

  const time = cell(r, "시간").trim() || "—"
  const isAllDay = time === "종일"
  const title = cell(r, "주요 일정/내용").trim()
  if (!title) return null

  return {
    id: makeEventId(date, time, title),
    date,
    dayLabel: cell(r, "요일").trim(),
    time,
    isAllDay,
    title,
    department: cell(r, "담당 부서").trim() || "—",
    completed: parseCompleted(cell(r, "진행 상태 (완료 여부)")),
    notes: cell(r, "비고").trim(),
  }
}

export function parseScheduleCsv(csvText: string): ScheduleEvent[] {
  const parsed = Papa.parse<CsvRow>(csvText, {
    header: true,
    skipEmptyLines: "greedy",
  })

  const events: ScheduleEvent[] = []
  for (const row of parsed.data) {
    const event = normalizeRow(row)
    if (event) events.push(event)
  }

  return sortEvents(events)
}

export function sortEvents(events: ScheduleEvent[]): ScheduleEvent[] {
  return [...events].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    if (a.isAllDay !== b.isAllDay) return a.isAllDay ? -1 : 1
    return compareTime(a.time, b.time)
  })
}

function compareTime(a: string, b: string): number {
  return timeToMinutes(a) - timeToMinutes(b)
}

function timeToMinutes(time: string): number {
  if (time === "종일" || time === "—") return 0
  const match = time.match(/(\d{1,2}):(\d{2})/)
  if (!match) return 9999
  return Number(match[1]) * 60 + Number(match[2])
}
