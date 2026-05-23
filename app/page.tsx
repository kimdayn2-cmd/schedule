import { ScheduleDashboard } from "@/components/schedule/schedule-dashboard"
import { fetchScheduleData } from "@/lib/schedule/fetch-schedule"

export const revalidate = 300

export default async function Page() {
  const data = await fetchScheduleData()

  return <ScheduleDashboard initialData={data} />
}
