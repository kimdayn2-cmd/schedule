"use client"

import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { getDepartmentColorClass } from "@/lib/schedule/department-colors"
import { formatEventDateLabel } from "@/lib/schedule/queries"
import type { ScheduleEvent } from "@/lib/schedule/types"
import { cn } from "@/lib/utils"

type EventDetailSheetProps = {
  event: ScheduleEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EventDetailSheet({
  event,
  open,
  onOpenChange,
}: EventDetailSheetProps) {
  if (!event) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-left text-lg leading-snug">
            {event.title}
          </SheetTitle>
          <SheetDescription className="text-left">
            {formatEventDateLabel(event.date, event.dayLabel)}
            {event.isAllDay ? " · 종일" : ` · ${event.time}`}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={cn("border", getDepartmentColorClass(event.department))}
            >
              {event.department}
            </Badge>
            <Badge variant={event.completed ? "secondary" : "outline"}>
              {event.completed ? "완료" : "미완료"}
            </Badge>
            {event.isAllDay && <Badge variant="outline">종일</Badge>}
          </div>

          <Separator />

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">비고</p>
            <p className="text-sm leading-relaxed">
              {event.notes || "비고 없음"}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
