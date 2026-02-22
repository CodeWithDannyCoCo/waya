"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle, Target, Coins, Trophy, ChevronRight } from "lucide-react"
import { GoalsList } from "@/components/goal-better/goals-list"
import { CreateGoalDialog } from "@/components/goal-better/create-goal-dialog"
import { GoalProgress } from "@/components/goal-better/goal-progress"
import { MilestoneTracker } from "@/components/goal-better/milestone-tracker"
import { SavingsInsights } from "@/components/goal-better/savings-insights"

export default function GoalBetterPage() {
  const [availableCoins, setAvailableCoins] = useState(275)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GoalBetter</h1>
          <p className="text-muted-foreground">Set savings goals, track progress, and earn rewards!</p>
        </div>
        <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/20 px-4 py-2 rounded-md">
          <Coins className="h-5 w-5" />
          <span className="font-bold">{availableCoins} coins available</span>
        </div>
      </div>

      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="goals">
            <Target className="h-4 w-4 mr-2" />
            My Goals
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Trophy className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="insights">
            <ChevronRight className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="mt-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Active Savings Goals</h2>
            <CreateGoalDialog>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Goal
              </Button>
            </CreateGoalDialog>
          </div>

          <GoalsList availableCoins={availableCoins} />

          <Card>
            <CardHeader>
              <CardTitle>Featured Goal</CardTitle>
              <CardDescription>Your main savings focus</CardDescription>
            </CardHeader>
            <CardContent>
              <GoalProgress />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <MilestoneTracker />
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <SavingsInsights />
        </TabsContent>
      </Tabs>
    </div>
  )
}
