"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Zap } from "lucide-react"

export function ProgressTracker() {
  // Mock data
  const level = 5
  const currentXP = 340
  const nextLevelXP = 500
  const progress = (currentXP / nextLevelXP) * 100
  const coins = 275
  const completedChores = 12

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-500" />
            Level {level}
          </CardTitle>
          <CardDescription>Explorer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{currentXP} XP</span>
              <span>{nextLevelXP} XP</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {Math.round(nextLevelXP - currentXP)} XP needed for Level {level + 1}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Coins
          </CardTitle>
          <CardDescription>Your earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{coins}</div>
            <div className="text-xs text-muted-foreground">Earn more by completing quests!</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-amber-500" />
            Achievements
          </CardTitle>
          <CardDescription>Your progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{completedChores}</div>
            <div className="text-xs text-muted-foreground">Quests completed</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
