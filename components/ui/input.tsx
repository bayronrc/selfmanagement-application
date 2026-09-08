import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-xl border border-input/50 bg-transparent px-3 py-1.5 text-base transition-all duration-200 outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/70 focus-visible:border-emerald-400/50 focus-visible:ring-2 focus-visible:ring-emerald-400/20 focus-visible:bg-white/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/30 disabled:opacity-50 aria-invalid:border-destructive/50 aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/20 dark:disabled:bg-input/60 dark:aria-invalid:border-destructive/40 dark:aria-invalid:ring-destructive/30 hover:border-input/70",
        className
      )}
      {...props}
    />
  )
}

export { Input }
