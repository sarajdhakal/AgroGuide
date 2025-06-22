"use client"

import { useState, useEffect } from "react"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"

export function CountUpAnimation({ end, duration = 2000, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0)
  const [ref, isVisible] = useScrollAnimation()

  useEffect(() => {
    if (!isVisible) return

    let startTime = null
    const startValue = 0
    const endValue = Number.parseInt(end.replace(/[^\d]/g, ""))

    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * endValue)

      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(endValue)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  const formatNumber = (num) => {
    if (end.includes("+")) {
      return num.toLocaleString() + "+"
    }
    if (end.includes("%")) {
      return num + "%"
    }
    return num.toLocaleString()
  }

  return (
    <div ref={ref} className="text-3xl sm:text-4xl font-bold text-emerald-400 mb-2">
      {prefix}
      {formatNumber(count)}
      {suffix}
    </div>
  )
}
