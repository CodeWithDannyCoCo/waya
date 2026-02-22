"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Coins, Target, TrendingUp, CheckCircle, AlertCircle } from "lucide-react"
import Image from "next/image"
import { AddCoinsDialog } from "./add-coins-dialog"

export type GoalType = {
  id: string
  title: string
  description: string
  targetAmount: number
  savedAmount: number
  image: string
  deadline: string
  category: string
  startDate?: string
  milestones?: {
    percentage: number
    reached: boolean
    reward: string
  }[]
  transactions?: {
    date: string
    amount: number
    type: "deposit" | "withdrawal"
    description: string
  }[]
}

type GoalDetailsDialogProps = {
  children: React.ReactNode
  goal?: GoalType
}

export function GoalDetailsDialog({ children, goal }: GoalDetailsDialogProps) {
  const [open, setOpen] = useState(false)

  // If no goal is provided, use a default one
  const defaultGoal = {
    id: "1",
    title: "New Bicycle",
    description: "Mountain bike for weekend adventures",
    targetAmount: 2000,
    savedAmount: 1200,
    image: "/placeholder.svg?height=200&width=200",
    deadline: "2 months",
    category: "Sports",
    startDate: "3 months ago",
    milestones: [
      { percentage: 25, reached: true, reward: "Achievement Badge" },
      { percentage: 50, reached: true, reward: "+10 XP Bonus" },
      { percentage: 75, reached: false, reward: "Parent Match Bonus" },
      { percentage: 100, reached: false, reward: "Goal Complete Trophy" },
    ],
    transactions: [
      { date: "Today", amount: 100, type: "deposit", description: "Weekly allowance" },
      { date: "3 days ago", amount: 200, type: "deposit", description: "Birthday money" },
      { date: "1 week ago", amount: 150, type: "deposit", description: "Chore completion" },
      { date: "2 weeks ago", amount: 50, type: "withdrawal", description: "Bike accessories" },
      { date: "3 weeks ago", amount: 300, type: "deposit", description: "Saved from allowance" },
    ],
  }

  const currentGoal = goal || defaultGoal
  const progress = Math.round((currentGoal.savedAmount / currentGoal.targetAmount) * 100)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{currentGoal.title}</DialogTitle>
          <DialogDescription>{currentGoal.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 bg-muted rounded-lg overflow-hidden relative h-48 md:h-auto">
              <Image
                src={currentGoal.image || "/placeholder.svg"}
                alt={currentGoal.title}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm">{currentGoal.category}</Badge>
            </div>

            <div className="w-full md:w-2/3 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Goal Progress</span>
                </div>
                <span className="text-sm font-medium">{progress}%</span>
              </div>

              <Progress value={progress} className="h-2" />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground">Saved</div>
                  <div className="font-semibold flex items-center gap-1">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    {currentGoal.savedAmount} coins
                  </div>
                </div>

                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground">Target</div>
                  <div className="font-semibold flex items-center gap-1">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    {currentGoal.targetAmount} coins
                  </div>
                </div>

                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground">Started</div>
                  <div className="font-semibold flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    {currentGoal.startDate}
                  </div>
                </div>

                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground">Deadline</div>
                  <div className="font-semibold flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-red-500" />
                    {currentGoal.deadline} left
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="milestones" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="milestones" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Goal Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentGoal.milestones?.map((milestone, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {milestone.reached ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                          )}
                          <span className="font-medium">{milestone.percentage}% Complete</span>
                        </div>
                        <Badge variant={milestone.reached ? "default" : "outline"}>{milestone.reward}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentGoal.transactions?.map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-muted-foreground">{transaction.date}</div>
                        </div>
                        <div
                          className={`font-semibold flex items-center gap-1 ${
                            transaction.type === "deposit" ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {transaction.type === "deposit" ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <AlertCircle className="h-4 w-4" />
                          )}
                          {transaction.type === "deposit" ? "+" : "-"}
                          {transaction.amount} coins
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <AddCoinsDialog goalId={currentGoal.id} goalTitle={currentGoal.title} availableCoins={275}>
            <Button>Add Coins</Button>
          </AddCoinsDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
