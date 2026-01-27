"use client"

import { useEffect, useState } from "react"

interface CountdownTimerProps {
  targetDate: Date
}

function pad(n: number) {
  return n.toString().padStart(2, "0")
}

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [time, setTime] = useState(getTimeLeft(targetDate))

  useEffect(() => {
    const id = setInterval(() => {
      setTime(getTimeLeft(targetDate))
    }, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  const units = [
    { label: "d", value: time.days },
    { label: "h", value: time.hours },
    { label: "m", value: time.minutes },
    { label: "s", value: time.seconds },
  ]

  return (
    <div className="flex items-center gap-1">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-1">
          <span className="bg-primary text-primary-foreground rounded-md px-2 py-1 font-mono font-bold text-sm min-w-[2rem] text-center">
            {pad(unit.value)}
          </span>
          {i < units.length - 1 && (
            <span className="text-primary font-bold">:</span>
          )}
        </div>
      ))}
    </div>
  )
}
