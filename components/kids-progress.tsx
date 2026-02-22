"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"

export function KidsProgress() {
  // Mock data
  const kids = [
    {
      id: "kid1",
      name: "Alex",
      avatar: "/placeholder.svg?height=40&width=40",
      level: 5,
      xp: 340,
      nextLevelXP: 500,
      coins: 275,
      completedChores: 8,
      pendingChores: 2,
    },
    {
      id: "kid2",
      name: "Jamie",
      avatar: "/placeholder.svg?height=40&width=40",
      level: 3,
      xp: 180,
      nextLevelXP: 300,
      coins: 120,
      completedChores: 4,
      pendingChores: 1,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kids Progress</CardTitle>
        <CardDescription>Track your children's progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {kids.map((kid) => {
          const progress = (kid.xp / kid.nextLevelXP) * 100

          return (
            <div key={kid.id} className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={kid.avatar} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{kid.name}</h4>
                  <p className="text-xs text-muted-foreground">Level {kid.level} Explorer</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    XP: {kid.xp}/{kid.nextLevelXP}
                  </span>
                  <span>Level {kid.level}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-md bg-muted p-2">
                  <div className="font-medium">{kid.coins}</div>
                  <div className="text-xs text-muted-foreground">Coins</div>
                </div>
                <div className="rounded-md bg-muted p-2">
                  <div className="font-medium">{kid.completedChores}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div className="rounded-md bg-muted p-2">
                  <div className="font-medium">{kid.pendingChores}</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
