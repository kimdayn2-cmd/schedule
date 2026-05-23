import { decodeCsvResponse } from "./decode-csv"
import { parseScheduleCsv } from "./parse-csv"
import { getStats } from "./queries"
import { getSampleEvents } from "./sample-data"
import type { SchedulePayload } from "./types"

/** Google 게시 CSV·CDN 캐시 우회용 쿼리 추가 */
function withCacheBuster(url: string): string {
  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}_=${Date.now()}`
}

export async function fetchScheduleData(): Promise<SchedulePayload> {
  const csvUrl = process.env.GOOGLE_SHEET_CSV_URL?.trim()

  if (!csvUrl) {
    const events = getSampleEvents()
    return {
      events,
      stats: getStats(events),
      fetchedAt: new Date().toISOString(),
      source: "sample",
      error:
        "GOOGLE_SHEET_CSV_URL이 설정되지 않아 샘플 데이터를 표시합니다. .env.local을 참고하세요.",
    }
  }

  try {
    const response = await fetch(withCacheBuster(csvUrl), {
      cache: "no-store",
      headers: {
        Accept: "text/csv; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      throw new Error(`CSV 요청 실패 (${response.status})`)
    }

    const csvText = decodeCsvResponse(await response.arrayBuffer())
    const events = parseScheduleCsv(csvText)

    const hasValidHeaders =
      csvText.includes("날짜") && csvText.includes("주요 일정")
    if (!hasValidHeaders) {
      throw new Error("CSV 인코딩 또는 헤더 형식이 올바르지 않습니다.")
    }

    if (events.length === 0) {
      throw new Error("시트에서 일정을 찾지 못했습니다. 게시 설정을 확인하세요.")
    }

    return {
      events,
      stats: getStats(events),
      fetchedAt: new Date().toISOString(),
      source: "sheet",
    }
  } catch (error) {
    const events = getSampleEvents()
    const message =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."

    return {
      events,
      stats: getStats(events),
      fetchedAt: new Date().toISOString(),
      source: "sample",
      error: `${message} — 샘플 데이터로 대체 표시 중입니다.`,
    }
  }
}
