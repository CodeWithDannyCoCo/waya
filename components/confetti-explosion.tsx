"use client"

import { useEffect, useState } from "react"
import Confetti from "react-confetti"
import { useWindowSize } from "@/hooks/use-window-size"

export function ConfettiExplosion() {
  const { width, height } = useWindowSize()
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!isActive) return null

  return <Confetti width={width} height={height} recycle={false} numberOfPieces={200} gravity={0.2} />
}
