"use client"

import { Input } from "@/components/ui/input"
import { forwardRef } from "react"

interface NumericInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  allowDecimals?: boolean
}

function filterNumeric(value: string, allowDecimals: boolean): string {
  if (allowDecimals) {
    return value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1")
  }
  return value.replace(/[^0-9]/g, "")
}

export const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  ({ allowDecimals = false, onChange, ...props }, ref) => {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const filtered = filterNumeric(e.target.value, allowDecimals)
      const syntheticEvent = { ...e, target: { ...e.target, value: filtered } }
      onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>)
    }

    return <Input ref={ref} inputMode="numeric" onChange={handleChange} {...props} />
  }
)

NumericInput.displayName = "NumericInput"
