import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const getSnapshot = () => window.innerWidth < MOBILE_BREAKPOINT

  return React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => false
  )
}

function subscribe(callback: () => void) {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}