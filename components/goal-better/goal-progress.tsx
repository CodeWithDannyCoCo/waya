"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Coins, Calendar, Target, PiggyBank, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export function GoalProgress() {
  // Mock data for the featured goal
  const [goal, setGoal] = useState({
    id: "1",
    title: "New Bicycle",
    description: "Mountain bike for weekend adventures",
    targetAmount: 2000,
    savedAmount: 1200,
    image: "/placeholder.svg?height=200&width=200",
    deadline: "2 months",
    category: "Sports",
    milestones: [
      { percentage: 25, reached: true, reward: "Achievement Badge" },
      { percentage: 50, reached: true, reward: "+10 XP Bonus" },
      { percentage: 75, reached: false, reward: "Parent Match Bonus" },
      { percentage: 100, reached: false, reward: "Goal Complete Trophy" },
    ],
  })

  const [coinsToAdd, setCoinsToAdd] = useState(10)
  const progress = Math.round((goal.savedAmount / goal.targetAmount) * 100)

  const handleAddCoins = () => {
    setGoal((prev) => ({
      ...prev,
      savedAmount: Math.min(prev.savedAmount + coinsToAdd, prev.targetAmount),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 bg-muted rounded-lg overflow-hidden relative h-48 md:h-auto">
          <Image src={goal.image || "/placeholder.svg"} alt={goal.title} fill className="object-cover" />
        </div>

        <div className="w-full md:w-2/3 space-y-4">
          <div>
            <h3 className="text-xl font-bold">{goal.title}</h3>
            <p className="text-muted-foreground">{goal.description}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center text-sm bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 px-3 py-1 rounded-full">
              <Target className="h-4 w-4 mr-1" />
              <span>{goal.category}</span>
            </div>
            <div className="flex items-center text-sm bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 px-3 py-1 rounded-full">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{goal.deadline} left</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{goal.savedAmount} coins saved</span>
              <span className="font-medium">{goal.targetAmount} coins goal</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{progress}% complete</span>
              <span>{goal.targetAmount - goal.savedAmount} coins to go</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 dark:bg-muted/20 rounded-lg p-4 space-y-4">
        <h4 className="font-medium flex items-center">
          <PiggyBank className="h-5 w-5 mr-2 text-primary" />
          Add to Your Savings
        </h4>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 flex-1">
            <Button variant="outline" size="sm" onClick={() => setCoinsToAdd(Math.max(5, coinsToAdd - 5))}>
              -5
            </Button>
            <div className="bg-background rounded-md px-4 py-2 flex items-center gap-2 flex-1 justify-center">
              <Coins className="h-5 w-5 text-yellow-500" />
              <span className="font-bold text-lg">{coinsToAdd}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setCoinsToAdd(Math.min(100, coinsToAdd + 5))}>
              +5
            </Button>
          </div>

          <Button onClick={handleAddCoins} className="w-full sm:w-auto">
            Add to Savings
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          Adding coins to your savings will help you reach your goal faster!
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          Milestone Rewards
        </h4>

        <div className="relative pt-6">
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
            {goal.milestones.map((milestone) => (
              <div
                key={milestone.percentage}
                className={`absolute h-4 w-4 rounded-full top-1/2 -translate-y-1/2 border-2 border-background ${
                  milestone.reached ? "bg-green-500" : "bg-muted-foreground"
                }`}
                style={{ left: `${milestone.percentage}%` }}
              />
            ))}
            <div className="absolute h-1 bg-green-500 top-0 left-0" style={{ width: `${progress}%` }} />
          </div>

          <div className="flex justify-between mt-6">
            {goal.milestones.map((milestone) => (
              <motion.div
                key={milestone.percentage}
                className={`flex flex-col items-center text-center w-20 ${
                  milestone.reached ? "text-green-500" : "text-muted-foreground"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-xs font-medium">{milestone.percentage}%</span>
                <span className="text-xs mt-1">{milestone.reward}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
