"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { GameState } from "./types"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Award, TrendingUp, TrendingDown, Users, MessageSquare, Star } from "lucide-react"
import { ConfettiExplosion } from "@/components/confetti-explosion"
import { useState } from "react"

interface PerformanceReviewProps {
  gameState: GameState
  onContinue: () => void
  onRestart: () => void
}

export function PerformanceReview({ gameState, onContinue, onRestart }: PerformanceReviewProps) {
  const [showConfetti, setShowConfetti] = useState(true)

  const { day, history, events, xp, level, balance, inventory } = gameState

  const currentDay = history[history.length - 1]
  const isProfit = currentDay?.profit > 0
  const event = events[events.length - 1]

  // Check if we leveled up
  const previousXP = xp - currentDay?.profit / 10 - (currentDay?.reputation > 0 ? 2 : 0)
  const previousLevel = Math.floor(previousXP / 100) + 1
  const leveledUp = level > previousLevel

  return (
    <div className="space-y-6">
      {(leveledUp || currentDay?.profit > 50) && showConfetti && (
        <ConfettiExplosion force={0.6} duration={3000} particleCount={100} onComplete={() => setShowConfetti(false)} />
      )}

      <div>
        <h2 className="text-xl font-semibold mb-2">Day {day} Results</h2>
        <p className="text-muted-foreground">Review how your business performed today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financial Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isProfit ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">Profit/Loss</span>
              </div>
              <div className={`text-xl font-bold ${isProfit ? "text-green-600" : "text-red-600"}`}>
                ${currentDay?.profit.toFixed(2)}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Customers</span>
              </div>
              <div className="text-xl font-bold">{currentDay?.customers}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Reputation Change</span>
              </div>
              <div className={`text-xl font-bold ${currentDay?.reputation >= 0 ? "text-green-600" : "text-red-600"}`}>
                {currentDay?.reputation >= 0 ? "+" : ""}
                {currentDay?.reputation}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                <span className="font-medium">XP Earned</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">
                  +{Math.max(1, Math.floor(currentDay?.profit / 10) + (currentDay?.reputation > 0 ? 2 : 0))}
                </span>
                {leveledUp && (
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                    Level Up!
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Level {level}</span>
                <span className="text-sm">{xp} XP</span>
              </div>
              <Progress value={xp % 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <div className="text-lg font-medium">{currentDay?.feedback}</div>
            </div>

            {event && (
              <div className="mt-4">
                <Badge
                  className={`mb-2 ${
                    event.effect === "positive"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : event.effect === "negative"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                  }`}
                >
                  {event.name}
                </Badge>
                <p className="text-sm">{event.description}</p>
              </div>
            )}

            <div className="mt-4">
              <h3 className="font-medium mb-2">Business Status</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted p-2 rounded-md">
                  <p className="text-sm font-medium">Current Balance</p>
                  <p className="text-lg font-bold">${balance.toFixed(2)}</p>
                </div>
                <div className="bg-muted p-2 rounded-md">
                  <p className="text-sm font-medium">Inventory Left</p>
                  <p className="text-lg font-bold">{inventory} units</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onRestart}>
          Start New Business
        </Button>
        <Button onClick={onContinue}>Continue to Next Day</Button>
      </div>
    </div>
  )
}
