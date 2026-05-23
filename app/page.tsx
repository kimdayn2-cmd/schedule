import { ScheduleDashboard } from "@/components/schedule/schedule-dashboard"
import { fetchScheduleData } from "@/lib/schedule/fetch-schedule"

/** 배포 환경에서도 시트 수정이 바로 반영되도록 매 요청마다 최신 CSV 로드 */
export const dynamic = "force-dynamic"

export default async function Page() {
  const data = await fetchScheduleData()

  return <ScheduleDashboard initialData={data} />
}
