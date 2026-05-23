"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ScheduleFilterStatus, ScheduleFilters } from "@/lib/schedule/types"

type ScheduleFiltersBarProps = {
  filters: ScheduleFilters
  departments: string[]
  onChange: (filters: ScheduleFilters) => void
}

export function ScheduleFiltersBar({
  filters,
  departments,
  onChange,
}: ScheduleFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="일정·비고 검색"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="pl-9"
        />
      </div>
      <Select
        value={filters.department}
        onValueChange={(department) => onChange({ ...filters, department })}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="부서" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 부서</SelectItem>
          {departments.map((dept) => (
            <SelectItem key={dept} value={dept}>
              {dept}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.status}
        onValueChange={(status) =>
          onChange({ ...filters, status: status as ScheduleFilterStatus })
        }
      >
        <SelectTrigger className="w-full sm:w-[140px]">
          <SelectValue placeholder="상태" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 상태</SelectItem>
          <SelectItem value="completed">완료</SelectItem>
          <SelectItem value="pending">미완료</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
