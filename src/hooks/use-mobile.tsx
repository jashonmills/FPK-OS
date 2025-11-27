import * as React from "react"
import { useCleanup } from "@/utils/cleanupManager"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const cleanup = useCleanup('useIsMobile')

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    cleanup.addEventListener(mql, "change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
  }, [cleanup])

  return !!isMobile
}
