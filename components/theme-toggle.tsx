"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MoonIcon, SunIcon } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false
    const saved = localStorage.getItem("theme")
    return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "size-9 rounded-full hover:bg-white/20 hover:text-white transition-colors",
        className
      )}
      onClick={toggle}
    >
      {dark ? <SunIcon className="size-5 lucide lucide-moon" /> : <MoonIcon className="size-5" />}
    </Button>
  )
}
