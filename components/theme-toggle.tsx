"use client"

import { useState, useEffect } from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    const isDark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    setDark(isDark)
    document.documentElement.classList.toggle("dark", isDark)
  }, [])

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
      className="size-9 rounded-full hover:bg-teal-100 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
      onClick={toggle}
    >
      {dark ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
    </Button>
  )
}
