"use client"

import { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  minDate?: string
  disablePast?: boolean
}

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

const DIAS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

function parseDate(str: string): Date | null {
  if (!str) return null
  const [y, m, d] = str.split("-").map(Number)
  return new Date(y, m - 1, d)
}

function toStr(year: number, month: number, day: number): string {
  const d = String(day).padStart(2, "0")
  const m = String(month + 1).padStart(2, "0")
  return `${year}-${m}-${d}`
}

export function DatePicker({ value, onChange, minDate, disablePast }: DatePickerProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const min = disablePast
    ? (() => { const t = new Date(); t.setDate(t.getDate() + 1); t.setHours(0, 0, 0, 0); return t })()
    : minDate ? parseDate(minDate) : null

  const initial = value ? parseDate(value) || today : today
  const [viewYear, setViewYear] = useState(initial.getFullYear())
  const [viewMonth, setViewMonth] = useState(initial.getMonth())

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
  const selected = parseDate(value)

  function handlePrev() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1) }
    else { setViewMonth(viewMonth - 1) }
  }

  function handleNext() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1) }
    else { setViewMonth(viewMonth + 1) }
  }

  function handleSelect(day: number) {
    onChange(toStr(viewYear, viewMonth, day))
  }

  function isDisabled(day: number): boolean {
    const d = new Date(viewYear, viewMonth, day)
    d.setHours(0, 0, 0, 0)
    if (min && d < min) return true
    return false
  }

  return (
    <div className="rounded-lg border bg-card p-3 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="icon" className="size-7" onClick={handlePrev}>
          <ChevronLeftIcon className="size-4" />
        </Button>
        <div className="flex-1 flex items-center gap-1">
          <Select value={String(viewMonth)} onValueChange={(v) => setViewMonth(Number(v))}>
            <SelectTrigger className="h-8 w-[110px] text-xs font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((name, i) => (
                <SelectItem key={i} value={String(i)}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(viewYear)} onValueChange={(v) => setViewYear(Number(v))}>
            <SelectTrigger className="h-8 w-[70px] text-xs font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 100 }, (_, i) => today.getFullYear() - i).map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="ghost" size="icon" className="size-7" onClick={handleNext}>
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {DIAS.map((d) => (
          <div key={d} className="text-[10px] font-medium text-muted-foreground text-center py-1">{d}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const disabled = isDisabled(day)
          const isSelected = selected && selected.getDate() === day && selected.getMonth() === viewMonth && selected.getFullYear() === viewYear
          const isToday = today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear
          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => handleSelect(day)}
              className={`h-7 w-full rounded-md text-xs font-medium transition-colors
                ${disabled ? "text-muted-foreground/30 cursor-not-allowed line-through" : ""}
                ${!disabled && isSelected ? "bg-primary text-primary-foreground shadow-sm" : ""}
                ${!disabled && !isSelected && isToday ? "bg-accent text-accent-foreground font-bold" : ""}
                ${!disabled && !isSelected && !isToday ? "hover:bg-accent hover:text-accent-foreground" : ""}
              `}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
