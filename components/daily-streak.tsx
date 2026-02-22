"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"

export function DailyStreak() {
  // Mock data
  const currentStreak = 3
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const today = new Date().getDay() // 0 is Sunday, 1 is Monday, etc.
  const adjustedToday = today === 0 ? 6 : today - 1 // Adjust to match our array (0 is Monday)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Flame className="h-5 w-5 mr-2 text-orange-500" />
          Daily Streak
        </CardTitle>
        <CardDescription>{currentStreak} days in a row! Keep it up!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          {daysOfWeek.map((day, index) => {
            const isPast = index < adjustedToday
            const isToday = index === adjustedToday
            const isStreak = isPast && index >= adjustedToday - currentStreak

            return (
              <div key={day} className="flex flex-col items-center">
                <div className="text-xs text-muted-foreground mb-2">{day}</div>
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                    isToday && "bg-blue-500 text-white",
                    isStreak && !isToday && "bg-orange-500 text-white",
                    !isStreak && isPast && "bg-muted text-muted-foreground",
                    !isPast && !isToday && "border border-dashed border-muted-foreground/30 text-muted-foreground/50",
                  )}
                >
                  {isPast || isToday ? "✓" : ""}
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 text-center text-sm">
          <p>Complete at least one quest daily to maintain your streak!</p>
          <p className="text-muted-foreground text-xs mt-1">
            5-day streak bonus: <span className="text-yellow-500 font-medium">+50 coins</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
