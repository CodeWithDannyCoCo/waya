"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Target, ChevronRight, Calendar } from "lucide-react"
import Image from "next/image"
import { GoalDetailsDialog, type GoalType } from "./goal-details-dialog"

// Mock data for goals
const mockGoals: GoalType[] = [
  {
    id: "1",
    title: "New Bicycle",
    description: "Mountain bike for weekend adventures",
    targetAmount: 2000,
    savedAmount: 1200,
    image: "/placeholder.svg?height=100&width=100",
    deadline: "2 months",
    category: "Sports",
  },
  {
    id: "2",
    title: "Video Game",
    description: "The latest adventure game",
    targetAmount: 600,
    savedAmount: 450,
    image: "/placeholder.svg?height=100&width=100",
    deadline: "2 weeks",
    category: "Entertainment",
  },
  {
    id: "3",
    title: "Art Supplies",
    description: "Professional drawing kit",
    targetAmount: 800,
    savedAmount: 200,
    image: "/placeholder.svg?height=100&width=100",
    deadline: "3 months",
    category: "Hobbies",
  },
]

type GoalsListProps = {
  availableCoins?: number
}

export function GoalsList({ availableCoins = 0 }: GoalsListProps) {
  const [goals, setGoals] = useState(mockGoals)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal) => {
        const progress = Math.round((goal.savedAmount / goal.targetAmount) * 100)

        return (
          <Card key={goal.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-40 bg-muted relative">
              <Image src={goal.image || "/placeholder.svg"} alt={goal.title} fill className="object-cover" />
              <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm">{goal.category}</Badge>
            </div>
            <CardContent className="p-4 space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{goal.title}</h3>
                <p className="text-sm text-muted-foreground">{goal.description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{goal.savedAmount} coins</span>
                  <span>{goal.targetAmount} coins</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{progress}% saved</span>
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {goal.deadline} left
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm">
                  <Target className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="font-medium">{goal.targetAmount - goal.savedAmount} to go</span>
                </div>
                <GoalDetailsDialog
                  goal={{
                    ...goal,
                    transactions: [
                      { date: "Today", amount: 50, type: "deposit", description: "Added from savings" },
                      { date: "3 days ago", amount: 100, type: "deposit", description: "Weekly allowance" },
                      { date: "1 week ago", amount: 75, type: "deposit", description: "Chore completion" },
                    ],
                    milestones: [
                      { percentage: 25, reached: progress >= 25, reward: "Achievement Badge" },
                      { percentage: 50, reached: progress >= 50, reward: "+10 XP Bonus" },
                      { percentage: 75, reached: progress >= 75, reward: "Parent Match Bonus" },
                      { percentage: 100, reached: progress >= 100, reward: "Goal Complete Trophy" },
                    ],
                  }}
                >
                  <Button size="sm" variant="outline">
                    Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </GoalDetailsDialog>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
