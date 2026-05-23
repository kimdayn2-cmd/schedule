const DEPARTMENT_PALETTE = [
  "border-chart-1/50 bg-chart-1/15",
  "border-chart-2/50 bg-chart-2/15",
  "border-chart-3/50 bg-chart-3/15",
  "border-chart-4/50 bg-chart-4/15",
  "border-chart-5/50 bg-chart-5/15",
  "border-primary/30 bg-primary/10",
  "border-accent/50 bg-accent/30",
  "border-secondary/50 bg-secondary/40",
] as const

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function getDepartmentColorClass(department: string): string {
  if (!department || department === "—") {
    return "border-border bg-muted/50"
  }
  const index = hashString(department) % DEPARTMENT_PALETTE.length
  return DEPARTMENT_PALETTE[index]
}
