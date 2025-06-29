"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function useTrackVisit() {
  const pathname = usePathname()

  useEffect(() => {

    const trackVisitor = async () => {
      try {
        await fetch("/api/track-visitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        })
      } catch (error) {
        console.error("Failed to track visitor:", error)
      }
    }

    // Small delay to ensure the page has loaded
    const timer = setTimeout(trackVisitor, 1000)

    return () => clearTimeout(timer)
  }, [pathname])
}
