import { NextResponse } from "next/server"

import { fetchScheduleData } from "@/lib/schedule/fetch-schedule"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const data = await fetchScheduleData()
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "일정 데이터를 불러오지 못했습니다."
    return NextResponse.json({ error: message }, { status: 503 })
  }
}
