"use client"

import { useTrackVisit } from "@/hooks/useTrackVisit"

export function TrackVisit() {
  useTrackVisit()
  return null // This component doesn't render anything
}
